package com.odsoftware.hrm.security;

import com.odsoftware.hrm.entity.identity.UserAccount;
import com.odsoftware.hrm.repository.identity.UserAccountRepository;
import java.util.Locale;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HrmUserDetailsService implements UserDetailsService {

	private final UserAccountRepository userAccountRepository;

	public HrmUserDetailsService(UserAccountRepository userAccountRepository) {
		this.userAccountRepository = userAccountRepository;
	}

	@Override
	@Transactional(readOnly = true)
	public UserDetails loadUserByUsername(String email) {
		String normalizedEmail = normalizeEmail(email);
		UserAccount userAccount = userAccountRepository.findByEmailIgnoreCase(normalizedEmail)
				.orElseThrow(() -> new UsernameNotFoundException("Invalid email or password"));
		if (userAccount.getPasswordHash() == null || userAccount.getPasswordHash().isBlank()) {
			throw new UsernameNotFoundException("Invalid email or password");
		}
		return new HrmUserDetails(
				userAccount.getId(),
				userAccount.getTenant().getId(),
				normalizeEmail(userAccount.getEmail()),
				userAccount.getPasswordHash(),
				userAccount.getUserType().getCode(),
				Boolean.TRUE.equals(userAccount.getActive()),
				!Boolean.TRUE.equals(userAccount.getLocked()));
	}

	private String normalizeEmail(String email) {
		if (email == null) {
			return "";
		}
		return email.trim().toLowerCase(Locale.ROOT);
	}
}
