package com.odsoftware.hrm.entity.core;

import com.odsoftware.hrm.entity.common.BaseMasterEntity;
import com.odsoftware.hrm.entity.master.SmtpEncryptionType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "smtp_configurations", uniqueConstraints = @UniqueConstraint(name = "uk_smtp_configurations_tenant_code", columnNames = {"tenant_id", "code"}))
public class SmtpConfiguration extends BaseMasterEntity {

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "tenant_id", nullable = false)
	private Tenant tenant;

	@NotBlank
	@Size(max = 50)
	@Column(name = "code", nullable = false, length = 50)
	private String code;

	@NotBlank
	@Size(max = 150)
	@Column(name = "host", nullable = false, length = 150)
	private String host;

	@NotNull
	@Min(1)
	@Max(65535)
	@Column(name = "port", nullable = false)
	private Integer port;

	@NotBlank
	@Size(max = 150)
	@Column(name = "username", nullable = false, length = 150)
	private String username;

	@NotBlank
	@Size(max = 500)
	@Column(name = "password_encrypted", nullable = false, length = 500)
	private String passwordEncrypted;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "smtp_encryption_type_id", nullable = false)
	private SmtpEncryptionType smtpEncryptionType;

	@NotBlank
	@Email
	@Size(max = 150)
	@Column(name = "sender_email", nullable = false, length = 150)
	private String senderEmail;

	@NotBlank
	@Size(max = 150)
	@Column(name = "sender_name", nullable = false, length = 150)
	private String senderName;

	public Tenant getTenant() {
		return tenant;
	}

	public void setTenant(Tenant tenant) {
		this.tenant = tenant;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public Integer getPort() {
		return port;
	}

	public void setPort(Integer port) {
		this.port = port;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPasswordEncrypted() {
		return passwordEncrypted;
	}

	public void setPasswordEncrypted(String passwordEncrypted) {
		this.passwordEncrypted = passwordEncrypted;
	}

	public SmtpEncryptionType getSmtpEncryptionType() {
		return smtpEncryptionType;
	}

	public void setSmtpEncryptionType(SmtpEncryptionType smtpEncryptionType) {
		this.smtpEncryptionType = smtpEncryptionType;
	}

	public String getSenderEmail() {
		return senderEmail;
	}

	public void setSenderEmail(String senderEmail) {
		this.senderEmail = senderEmail;
	}

	public String getSenderName() {
		return senderName;
	}

	public void setSenderName(String senderName) {
		this.senderName = senderName;
	}
}
