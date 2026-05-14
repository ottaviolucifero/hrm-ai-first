package com.odsoftware.hrm.service;

import com.odsoftware.hrm.dto.masterdata.MasterDataPageResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.function.Function;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.From;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Expression;

public final class MasterDataQuerySupport {

	public static final int DEFAULT_PAGE = 0;
	public static final int DEFAULT_SIZE = 25;
	public static final int MAX_SIZE = 100;

	private MasterDataQuerySupport() {
	}

	public static Pageable buildPageable(Integer page, Integer size, Sort sort) {
		return PageRequest.of(normalizePage(page), normalizeSize(size), sort);
	}

	public static Sort defaultNewestFirstSort(Sort fallbackSort) {
		Sort temporalSort = Sort.by(
				Sort.Order.desc("createdAt"),
				Sort.Order.desc("updatedAt"));
		return fallbackSort == null ? temporalSort : temporalSort.and(fallbackSort);
	}

	public static <T> Specification<T> searchSpecification(String search, String... fieldPaths) {
		String normalizedSearch = normalizeSearch(search);
		if (normalizedSearch == null || fieldPaths.length == 0) {
			return null;
		}

		return (root, query, criteriaBuilder) -> {
			query.distinct(true);

			List<Predicate> predicates = new ArrayList<>();
			for (String fieldPath : fieldPaths) {
				Expression<String> path = resolvePath(root, fieldPath);
				predicates.add(criteriaBuilder.like(criteriaBuilder.lower(path), "%" + normalizedSearch + "%"));
			}

			return criteriaBuilder.or(predicates.toArray(Predicate[]::new));
		};
	}

	public static <T, R> MasterDataPageResponse<R> toPageResponse(Page<T> page, Function<T, R> mapper) {
		return new MasterDataPageResponse<>(
				page.getContent().stream().map(mapper).toList(),
				page.getNumber(),
				page.getSize(),
				page.getTotalElements(),
				page.getTotalPages(),
				page.isFirst(),
				page.isLast());
	}

	public static <T> Specification<T> activeSpecification() {
		return (root, query, criteriaBuilder) -> criteriaBuilder.isTrue(root.get("active"));
	}

	public static <T> Specification<T> and(Specification<T> left, Specification<T> right) {
		if (left == null) {
			return right;
		}
		if (right == null) {
			return left;
		}
		return left.and(right);
	}

	public static <T> Specification<T> or(Specification<T> left, Specification<T> right) {
		if (left == null) {
			return right;
		}
		if (right == null) {
			return left;
		}
		return left.or(right);
	}

	public static <T> Specification<T> digitsOnlyStartsWithSpecification(String search, String... fieldPaths) {
		String normalizedSearch = normalizeDigits(search);
		if (normalizedSearch == null || fieldPaths.length == 0) {
			return null;
		}

		return (root, query, criteriaBuilder) -> {
			query.distinct(true);

			List<Predicate> predicates = new ArrayList<>();
			for (String fieldPath : fieldPaths) {
				Expression<String> path = resolvePath(root, fieldPath);
				predicates.add(criteriaBuilder.like(digitsOnlyExpression(path, criteriaBuilder), normalizedSearch + "%"));
			}

			return criteriaBuilder.or(predicates.toArray(Predicate[]::new));
		};
	}

	private static int normalizePage(Integer page) {
		return page == null || page < 0 ? DEFAULT_PAGE : page;
	}

	private static int normalizeSize(Integer size) {
		if (size == null || size <= 0) {
			return DEFAULT_SIZE;
		}

		return Math.min(size, MAX_SIZE);
	}

	private static String normalizeSearch(String search) {
		if (search == null) {
			return null;
		}

		String normalizedSearch = search.trim().toLowerCase(Locale.ROOT);
		return normalizedSearch.isEmpty() ? null : normalizedSearch;
	}

	private static String normalizeDigits(String search) {
		if (search == null) {
			return null;
		}

		String normalizedDigits = search.replaceAll("[^0-9]", "");
		return normalizedDigits.isBlank() ? null : normalizedDigits;
	}

	private static Expression<String> digitsOnlyExpression(
			Expression<String> expression,
			jakarta.persistence.criteria.CriteriaBuilder criteriaBuilder) {
		Expression<String> normalized = expression;
		for (String token : List.of("+", "-", " ", "(", ")")) {
			normalized = criteriaBuilder.function(
					"replace",
					String.class,
					normalized,
					criteriaBuilder.literal(token),
					criteriaBuilder.literal(""));
		}
		return normalized;
	}

	@SuppressWarnings("unchecked")
	private static <T> Expression<String> resolvePath(Root<T> root, String fieldPath) {
		String[] segments = fieldPath.split("\\.");
		From<?, ?> from = root;
		for (int index = 0; index < segments.length - 1; index++) {
			from = from.join(segments[index], JoinType.LEFT);
		}

		return from.get(segments[segments.length - 1]).as(String.class);
	}
}
