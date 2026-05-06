package com.odsoftware.hrm.dto.masterdata;

import java.util.List;

public record MasterDataPageResponse<T>(
		List<T> content,
		int page,
		int size,
		long totalElements,
		int totalPages,
		boolean first,
		boolean last) {
}
