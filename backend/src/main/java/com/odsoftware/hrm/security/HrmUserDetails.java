package com.odsoftware.hrm.security;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class HrmUserDetails implements UserDetails {

	private final UUID id;
	private final UUID tenantId;
	private final String email;
	private final String password;
	private final String userType;
	private final boolean active;
	private final boolean accountNonLocked;

	public HrmUserDetails(UUID id, UUID tenantId, String email, String password, String userType, boolean active, boolean accountNonLocked) {
		this.id = id;
		this.tenantId = tenantId;
		this.email = email;
		this.password = password;
		this.userType = userType;
		this.active = active;
		this.accountNonLocked = accountNonLocked;
	}

	public UUID id() {
		return id;
	}

	public UUID tenantId() {
		return tenantId;
	}

	public String email() {
		return email;
	}

	public String userType() {
		return userType;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority("USER_TYPE_" + userType));
	}

	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public String getUsername() {
		return email;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return accountNonLocked;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return active;
	}
}
