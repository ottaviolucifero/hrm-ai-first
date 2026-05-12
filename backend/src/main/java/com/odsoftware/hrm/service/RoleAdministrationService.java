package com.odsoftware.hrm.service;

import com.odsoftware.hrm.dto.masterdata.MasterDataPageResponse;
import com.odsoftware.hrm.dto.roleadministration.RoleAdministrationPermissionResponse;
import com.odsoftware.hrm.dto.roleadministration.RoleAdministrationRoleCreateRequest;
import com.odsoftware.hrm.dto.roleadministration.RoleAdministrationRoleDetailResponse;
import com.odsoftware.hrm.dto.roleadministration.RoleAdministrationRoleListItemResponse;
import com.odsoftware.hrm.dto.roleadministration.RoleAdministrationTenantResponse;
import com.odsoftware.hrm.dto.roleadministration.RoleAdministrationRoleUpdateRequest;
import com.odsoftware.hrm.dto.roleadministration.RolePermissionAssignmentResponse;
import com.odsoftware.hrm.dto.roleadministration.RolePermissionAssignmentUpdateRequest;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.master.Permission;
import com.odsoftware.hrm.entity.master.Role;
import com.odsoftware.hrm.entity.rbac.RolePermission;
import com.odsoftware.hrm.exception.InvalidRequestException;
import com.odsoftware.hrm.exception.ResourceConflictException;
import com.odsoftware.hrm.exception.ResourceNotFoundException;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.master.PermissionRepository;
import com.odsoftware.hrm.repository.master.RoleRepository;
import com.odsoftware.hrm.repository.rbac.RolePermissionRepository;
import com.odsoftware.hrm.repository.rbac.UserRoleRepository;
import jakarta.persistence.criteria.Predicate;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.odsoftware.hrm.security.CurrentCaller;
import com.odsoftware.hrm.security.CurrentCallerService;

@Service
@Transactional(readOnly = true)
public class RoleAdministrationService {

	private final RoleRepository roleRepository;
	private final PermissionRepository permissionRepository;
	private final RolePermissionRepository rolePermissionRepository;
	private final UserRoleRepository userRoleRepository;
	private final TenantRepository tenantRepository;
	private final CurrentCallerService currentCallerService;

	public RoleAdministrationService(
			RoleRepository roleRepository,
			PermissionRepository permissionRepository,
			RolePermissionRepository rolePermissionRepository,
			UserRoleRepository userRoleRepository,
			TenantRepository tenantRepository,
			CurrentCallerService currentCallerService) {
		this.roleRepository = roleRepository;
		this.permissionRepository = permissionRepository;
		this.rolePermissionRepository = rolePermissionRepository;
		this.userRoleRepository = userRoleRepository;
		this.tenantRepository = tenantRepository;
		this.currentCallerService = currentCallerService;
	}

	public MasterDataPageResponse<RoleAdministrationRoleListItemResponse> findRoles(UUID tenantId, Integer page, Integer size, String search) {
		UUID authorizedTenantId = resolveAuthorizedTenantFilter(tenantId);
		return MasterDataQuerySupport.toPageResponse(
				roleRepository.findAll(
						roleSpecification(authorizedTenantId, search),
						MasterDataQuerySupport.buildPageable(
								page,
								size,
								MasterDataQuerySupport.defaultNewestFirstSort(Sort.by("code")))),
				this::toRoleListItemResponse);
	}

	public RoleAdministrationRoleDetailResponse findRoleById(UUID roleId) {
		Role role = findRole(roleId);
		assertCallerCanManageRoleTenant(role);
		Tenant tenant = findTenant(role.getTenantId());
		return toRoleDetailResponse(role, tenant);
	}

	@Transactional
	public RoleAdministrationRoleDetailResponse createRole(RoleAdministrationRoleCreateRequest request) {
		assertCallerCanManageTenant(request.tenantId());
		Tenant tenant = findTenant(request.tenantId());
		String code = cleanUpper(request.code());
		if (roleRepository.existsByTenantIdAndCode(tenant.getId(), code)) {
			throw new ResourceConflictException("Role code already exists for tenant: " + code);
		}

		Role role = new Role();
		role.setTenantId(tenant.getId());
		role.setCode(code);
		role.setName(clean(request.name()));
		role.setDescription(clean(request.description()));
		role.setSystemRole(false);
		role.setActive(activeOrDefault(request.active()));
		return toRoleDetailResponse(roleRepository.save(role), tenant);
	}

	@Transactional
	public RoleAdministrationRoleDetailResponse updateRole(UUID roleId, RoleAdministrationRoleUpdateRequest request) {
		Role role = findMutableCustomRole(roleId);
		role.setName(clean(request.name()));
		role.setDescription(clean(request.description()));
		return toRoleDetailResponse(roleRepository.save(role), findTenant(role.getTenantId()));
	}

	@Transactional
	public RoleAdministrationRoleDetailResponse activateRole(UUID roleId) {
		return updateRoleActive(roleId, true);
	}

	@Transactional
	public RoleAdministrationRoleDetailResponse deactivateRole(UUID roleId) {
		return updateRoleActive(roleId, false);
	}

	public RolePermissionAssignmentResponse findAssignedPermissions(UUID roleId) {
		Role role = findRole(roleId);
		assertCallerCanManageRoleTenant(role);
		return toAssignmentResponse(role, findAssignedRolePermissions(role));
	}

	@Transactional
	public RolePermissionAssignmentResponse updateAssignedPermissions(UUID roleId, RolePermissionAssignmentUpdateRequest request) {
		Role role = findMutableCustomRole(roleId);
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

	@Transactional
	public void deleteRole(UUID roleId) {
		Role role = findMutableCustomRole(roleId);
		if (userRoleRepository.existsByTenant_IdAndRole_Id(role.getTenantId(), role.getId())) {
			throw new ResourceConflictException("Role cannot be deleted because it is assigned to one or more users");
		}

		List<RolePermission> existingAssignments = rolePermissionRepository.findByTenant_IdAndRole_Id(role.getTenantId(), role.getId());
		rolePermissionRepository.deleteAll(existingAssignments);
		rolePermissionRepository.flush();
		roleRepository.delete(role);
		roleRepository.flush();
	}

	private Specification<Role> roleSpecification(UUID tenantId, String search) {
		Specification<Role> searchSpecification = MasterDataQuerySupport.searchSpecification(search, "code", "name", "description");
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
		Role role = roleRepository.findById(roleId)
				.orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleId));
		assertCallerCanManageRoleTenant(role);
		return role;
	}

	private Role findMutableCustomRole(UUID roleId) {
		Role role = findRole(roleId);
		if (Boolean.TRUE.equals(role.getSystemRole())) {
			throw new InvalidRequestException("System roles cannot be modified through tenant role administration");
		}
		return role;
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

	private RoleAdministrationRoleDetailResponse updateRoleActive(UUID roleId, boolean active) {
		Role role = findMutableCustomRole(roleId);
		role.setActive(active);
		return toRoleDetailResponse(roleRepository.save(role), findTenant(role.getTenantId()));
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
				role.getDescription(),
				role.getSystemRole(),
				role.getActive(),
				role.getUpdatedAt());
	}

	private RoleAdministrationRoleDetailResponse toRoleDetailResponse(Role role, Tenant tenant) {
		return new RoleAdministrationRoleDetailResponse(
				role.getId(),
				new RoleAdministrationTenantResponse(tenant.getId(), tenant.getCode(), tenant.getName()),
				role.getCode(),
				role.getName(),
				role.getDescription(),
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

	private Boolean activeOrDefault(Boolean active) {
		return active == null ? Boolean.TRUE : active;
	}

	private String cleanUpper(String value) {
		String cleaned = clean(value);
		return cleaned == null ? null : cleaned.toUpperCase(Locale.ROOT);
	}

	private String clean(String value) {
		if (value == null) {
			return null;
		}
		String cleaned = value.trim();
		return cleaned.isEmpty() ? null : cleaned;
	}

	private UUID resolveAuthorizedTenantFilter(UUID tenantId) {
		CurrentCaller caller = currentCaller();
		if (caller.isPlatformUser()) {
			return tenantId;
		}
		if (tenantId != null && !caller.tenantId().equals(tenantId)) {
			throw new AccessDeniedException("Cross-tenant role administration is not allowed for caller");
		}
		return caller.tenantId();
	}

	private void assertCallerCanManageTenant(UUID tenantId) {
		CurrentCaller caller = currentCaller();
		if (!caller.isPlatformUser() && !caller.tenantId().equals(tenantId)) {
			throw new AccessDeniedException("Cross-tenant role administration is not allowed for caller");
		}
	}

	private void assertCallerCanManageRoleTenant(Role role) {
		assertCallerCanManageTenant(role.getTenantId());
	}

	private CurrentCaller currentCaller() {
		return currentCallerService.requireCurrentCaller();
	}
}
