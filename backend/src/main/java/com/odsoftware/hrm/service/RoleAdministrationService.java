package com.odsoftware.hrm.service;

import com.odsoftware.hrm.dto.masterdata.MasterDataPageResponse;
import com.odsoftware.hrm.dto.roleadministration.RoleAdministrationPermissionResponse;
import com.odsoftware.hrm.dto.roleadministration.RoleAdministrationRoleDetailResponse;
import com.odsoftware.hrm.dto.roleadministration.RoleAdministrationRoleListItemResponse;
import com.odsoftware.hrm.dto.roleadministration.RoleAdministrationTenantResponse;
import com.odsoftware.hrm.dto.roleadministration.RolePermissionAssignmentResponse;
import com.odsoftware.hrm.dto.roleadministration.RolePermissionAssignmentUpdateRequest;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.master.Permission;
import com.odsoftware.hrm.entity.master.Role;
import com.odsoftware.hrm.entity.rbac.RolePermission;
import com.odsoftware.hrm.exception.InvalidRequestException;
import com.odsoftware.hrm.exception.ResourceNotFoundException;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.master.PermissionRepository;
import com.odsoftware.hrm.repository.master.RoleRepository;
import com.odsoftware.hrm.repository.rbac.RolePermissionRepository;
import jakarta.persistence.criteria.Predicate;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class RoleAdministrationService {

	private final RoleRepository roleRepository;
	private final PermissionRepository permissionRepository;
	private final RolePermissionRepository rolePermissionRepository;
	private final TenantRepository tenantRepository;

	public RoleAdministrationService(
			RoleRepository roleRepository,
			PermissionRepository permissionRepository,
			RolePermissionRepository rolePermissionRepository,
			TenantRepository tenantRepository) {
		this.roleRepository = roleRepository;
		this.permissionRepository = permissionRepository;
		this.rolePermissionRepository = rolePermissionRepository;
		this.tenantRepository = tenantRepository;
	}

	public MasterDataPageResponse<RoleAdministrationRoleListItemResponse> findRoles(UUID tenantId, Integer page, Integer size, String search) {
		return MasterDataQuerySupport.toPageResponse(
				roleRepository.findAll(
						roleSpecification(tenantId, search),
						MasterDataQuerySupport.buildPageable(
								page,
								size,
								MasterDataQuerySupport.defaultNewestFirstSort(Sort.by("code")))),
				this::toRoleListItemResponse);
	}

	public RoleAdministrationRoleDetailResponse findRoleById(UUID roleId) {
		Role role = findRole(roleId);
		Tenant tenant = findTenant(role.getTenantId());
		return toRoleDetailResponse(role, tenant);
	}

	public RolePermissionAssignmentResponse findAssignedPermissions(UUID roleId) {
		Role role = findRole(roleId);
		return toAssignmentResponse(role, findAssignedRolePermissions(role));
	}

	@Transactional
	public RolePermissionAssignmentResponse updateAssignedPermissions(UUID roleId, RolePermissionAssignmentUpdateRequest request) {
		Role role = findRole(roleId);
		Tenant tenant = findTenant(role.getTenantId());
		List<UUID> requestedPermissionIds = new LinkedHashSet<>(request.permissionIds()).stream().toList();
		List<Permission> permissions = findPermissions(requestedPermissionIds);
		validatePermissionsBelongToRoleTenant(role, permissions);

		List<RolePermission> existingAssignments = rolePermissionRepository.findByTenant_IdAndRole_Id(tenant.getId(), role.getId());
		rolePermissionRepository.deleteAll(existingAssignments);
		rolePermissionRepository.flush();

		List<RolePermission> newAssignments = permissions.stream()
				.map(permission -> newRolePermission(tenant, role, permission))
				.toList();
		rolePermissionRepository.saveAll(newAssignments);

		return toAssignmentResponse(role, newAssignments);
	}

	private Specification<Role> roleSpecification(UUID tenantId, String search) {
		Specification<Role> searchSpecification = MasterDataQuerySupport.searchSpecification(search, "code", "name");
		if (tenantId == null) {
			return searchSpecification;
		}

		return (root, query, criteriaBuilder) -> {
			Predicate tenantPredicate = criteriaBuilder.equal(root.get("tenantId"), tenantId);
			if (searchSpecification == null) {
				return tenantPredicate;
			}

			Predicate searchPredicate = searchSpecification.toPredicate(root, query, criteriaBuilder);
			return searchPredicate == null ? tenantPredicate : criteriaBuilder.and(tenantPredicate, searchPredicate);
		};
	}

	private Role findRole(UUID roleId) {
		return roleRepository.findById(roleId)
				.orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleId));
	}

	private Tenant findTenant(UUID tenantId) {
		return tenantRepository.findById(tenantId)
				.orElseThrow(() -> new ResourceNotFoundException("Tenant not found: " + tenantId));
	}

	private List<Permission> findPermissions(List<UUID> permissionIds) {
		if (permissionIds.isEmpty()) {
			return List.of();
		}

		Map<UUID, Permission> permissionsById = permissionRepository.findAllById(permissionIds).stream()
				.collect(Collectors.toMap(Permission::getId, Function.identity()));
		for (UUID permissionId : permissionIds) {
			if (!permissionsById.containsKey(permissionId)) {
				throw new ResourceNotFoundException("Permission not found: " + permissionId);
			}
		}

		return permissionIds.stream()
				.map(permissionsById::get)
				.toList();
	}

	private void validatePermissionsBelongToRoleTenant(Role role, List<Permission> permissions) {
		for (Permission permission : permissions) {
			if (!role.getTenantId().equals(permission.getTenantId())) {
				throw new InvalidRequestException("Permission does not belong to role tenant: " + permission.getId());
			}
		}
	}

	private List<RolePermission> findAssignedRolePermissions(Role role) {
		return rolePermissionRepository.findByTenant_IdAndRole_IdOrderByPermission_CodeAsc(role.getTenantId(), role.getId());
	}

	private RolePermission newRolePermission(Tenant tenant, Role role, Permission permission) {
		RolePermission rolePermission = new RolePermission();
		rolePermission.setTenant(tenant);
		rolePermission.setRole(role);
		rolePermission.setPermission(permission);
		return rolePermission;
	}

	private RolePermissionAssignmentResponse toAssignmentResponse(Role role, List<RolePermission> rolePermissions) {
		List<RoleAdministrationPermissionResponse> permissions = rolePermissions.stream()
				.map(RolePermission::getPermission)
				.sorted(Comparator.comparing(Permission::getCode))
				.map(this::toPermissionResponse)
				.toList();
		return new RolePermissionAssignmentResponse(role.getId(), role.getTenantId(), permissions);
	}

	private RoleAdministrationRoleListItemResponse toRoleListItemResponse(Role role) {
		return new RoleAdministrationRoleListItemResponse(
				role.getId(),
				role.getTenantId(),
				role.getCode(),
				role.getName(),
				role.getSystemRole(),
				role.getActive());
	}

	private RoleAdministrationRoleDetailResponse toRoleDetailResponse(Role role, Tenant tenant) {
		return new RoleAdministrationRoleDetailResponse(
				role.getId(),
				new RoleAdministrationTenantResponse(tenant.getId(), tenant.getCode(), tenant.getName()),
				role.getCode(),
				role.getName(),
				role.getSystemRole(),
				role.getActive(),
				role.getCreatedAt(),
				role.getUpdatedAt());
	}

	private RoleAdministrationPermissionResponse toPermissionResponse(Permission permission) {
		return new RoleAdministrationPermissionResponse(
				permission.getId(),
				permission.getTenantId(),
				permission.getCode(),
				permission.getName(),
				permission.getSystemPermission(),
				permission.getActive());
	}
}
