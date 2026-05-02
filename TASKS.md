# TASKS.md

## Progetto HRM AI-first

Versione: 1.18  
Ultimo aggiornamento: 2026-05-02  
Stato: In avanzamento

---

## 1. Obiettivo

Questo documento contiene i task operativi del progetto HRM.

Ogni task deve essere piccolo, chiaro, verificabile e coerente con:

- `AGENTS.md`
- `ARCHITECTURE.md`
- `ROADMAP.md`
- documenti di analisi del progetto

---

## 2. Regole operative

- Un task alla volta
- Un branch per task
- Una pull request per task
- Nessuna funzionalità fuori MVP
- Prima leggere la documentazione
- Prima riusare, poi creare
- Dopo ogni task eseguire build/test

---

## 3. Stato task

Legenda:

- `TODO`: da fare
- `IN_PROGRESS`: in corso
- `DONE`: completato
- `BLOCKED`: bloccato

---

## 4. Stato attuale

### TASK-001 → TASK-010

Stato: DONE

Completati:

- Creazione repository
- Backend Spring Boot
- Configurazione backend YAML
- PostgreSQL + Docker Compose
- Frontend Angular
- Integrazione asset base Metronic Tailwind HTML
- Shell layout Angular modulare
- Adattamento layout reale Metronic
- Swagger / OpenAPI backend
- Profili backend dev/test/prod

---

### TASK-009 - Configurare Swagger / OpenAPI

Stato: DONE  
Fase roadmap: Fase 1 - Fondazione tecnica

Obiettivo:

Documentare e validare API REST backend.

Attività:

- Aggiungere dipendenza OpenAPI
- Configurare Swagger UI
- Esporre endpoint documentazione
- Validare accesso locale

Output atteso:

- Swagger UI accessibile
- Base governance API pronta

Validazione:

- springdoc OpenAPI integrato
- Swagger UI disponibile
- `/v3/api-docs` validato
- Security mantenuta attiva sugli altri endpoint

---

### TASK-010 - Configurare profili dev/test/prod

Stato: DONE

Validazione:

- Profili dev/test/prod configurati
- Profilo dev validato con PostgreSQL Docker locale
- Profilo test validato con Maven
- Profilo prod configurato con variabili ambiente

### TASK-011 - Creare modello dati iniziale enterprise normalizzato

Stato: TODO

Descrizione:

- Creare foundation dati enterprise MVP con blueprint completo.

MASTER / LOOKUP TABLES:

- Country:
  - id
  - name
  - isoCode
  - active
- Region:
  - id
  - name
  - code
  - country
  - active
- Area:
  - id
  - name
  - code
  - region
  - active
- GlobalZipCode:
  - id
  - country
  - postalCode
  - city
  - area
  - region
  - provinceCode
  - provinceName
  - active
- NationalIdentifierType:
  - id
  - name
  - code
  - country
  - regexPattern
  - active
- Currency:
  - id
  - code
  - name
  - symbol
  - active
- Department:
  - id
  - name
  - code
  - active
- JobTitle:
  - id
  - name
  - code
  - active
- ContractType:
  - id
  - name
  - code
  - active
- EmploymentStatus:
  - id
  - name
  - code
  - active
- WorkMode:
  - id
  - name
  - code
  - active
- Gender:
  - id
  - name
  - code
  - active
- MaritalStatus:
  - id
  - name
  - code
  - active
- DeviceType:
  - id
  - name
  - code
  - active
- DeviceBrand:
  - id
  - name
  - code
  - active
- DeviceStatus:
  - id
  - name
  - code
  - active
- LeaveRequestType:
  - id
  - name
  - code
  - active
- DocumentType:
  - id
  - name
  - code
  - active
- DocumentType esempi:
  - PAYSLIP
  - EMPLOYMENT_CONTRACT
  - CONTRACT_AMENDMENT
  - BONUS_NOTICE
  - FINAL_SETTLEMENT
  - SEVERANCE_DOCUMENT
  - TAX_DOCUMENT
  - DISCIPLINARY_DOCUMENT
- SmtpEncryptionType:
  - id
  - name
  - code
  - active
- AuthenticationMethod:
  - id
  - name
  - code
  - active
- AuthenticationMethod esempi:
  - PASSWORD_ONLY
  - EMAIL_OTP
  - APP_OTP
  - PASSWORD_PLUS_EMAIL_OTP
  - PASSWORD_PLUS_APP_OTP
- UserType:
  - id
  - name
  - code
  - active
- UserType esempi:
  - TENANT_USER
  - TENANT_ADMIN
  - PLATFORM_OPERATOR
  - SUPER_ADMIN
- Role:
  - id
  - name
  - code
  - active
- Permission:
  - id
  - name
  - code
  - module
  - active
- Tenant:
  - id
  - name
  - code
  - active
- CompanyProfileType:
  - id
  - name
  - code
  - active
- CompanyProfileType esempi:
  - LEGAL_ENTITY
  - SUBSIDIARY
  - BUSINESS_UNIT
  - BRANCH_COMPANY
  - PUBLIC_ENTITY
- OfficeLocationType:
  - id
  - name
  - code
  - active
- OfficeLocationType esempi:
  - LEGAL_HEADQUARTER
  - OPERATIONAL_SITE
  - BRANCH
  - WAREHOUSE
  - REMOTE_HUB
- DisciplinaryActionType:
  - id
  - name
  - code
  - severityLevel
  - active
- DisciplinaryActionType esempi:
  - WARNING
  - SUSPENSION
  - POLICY_VIOLATION
  - TERMINATION_NOTICE
- AuditActionType:
  - id
  - name
  - code
  - active
- AuditActionType esempi:
  - CREATE
  - READ
  - UPDATE
  - DELETE
  - LOGIN
  - LOGOUT
  - APPROVE
  - REJECT
  - EXPORT
  - PASSWORD_RESET
  - LOGIN_SUCCESS
  - LOGIN_FAILED
  - OTP_SENT
  - OTP_VERIFIED
  - ACCOUNT_LOCKED
  - TENANT_SWITCH
  - CROSS_TENANT_ACCESS
  - IMPERSONATION_START
  - IMPERSONATION_END

CORE TABLES:

- CompanyProfile:
  - id
  - tenant
  - companyProfileType
  - companyName
  - legalName
  - taxIdentifier
  - vatNumber
  - email
  - phonePrefix
  - phoneNumber
  - website
  - logoPath
  - primaryOfficeLocation
  - active
- CompanyProfile note:
  - Tenant 1 -> N CompanyProfile
  - CompanyProfile rappresenta legal entity o business entity
  - primaryOfficeLocation = sede principale, normalmente sede legale
- SmtpConfiguration:
  - id
  - companyProfile
  - host
  - port
  - username
  - passwordEncrypted
  - encryptionType
  - fromEmail
  - fromName
  - active
- SmtpConfiguration note:
  - OTP email sending
  - password reset
  - system notifications
- OfficeLocation:
  - id
  - tenant
  - companyProfile
  - officeLocationType
  - name
  - code
  - country
  - region
  - area
  - globalZipCode
  - city
  - addressLine1
  - streetNumber
  - addressLine2
  - postalCode
  - active
- OfficeLocation note:
  - CompanyProfile 1 -> N OfficeLocation
  - Una sede legale + più sedi operative
- Employee:
  - id
  - tenant
  - companyProfile
  - firstName
  - lastName
  - email
  - RESIDENCE ADDRESS:
    - residenceCountry
    - residenceRegion
    - residenceArea
    - residenceGlobalZipCode
    - residenceCity
    - residenceAddressLine1
    - residenceStreetNumber
    - residenceAddressLine2
    - residencePostalCode
  - NATIONAL IDENTITY:
    - nationalIdentifier
    - nationalIdentifierType
  - BIRTH DATA:
    - birthDate
    - birthCountry
    - birthRegion
    - birthArea
    - birthCity
  - DEMOGRAPHIC:
    - gender
    - maritalStatus
  - CONTACT:
    - internationalPhonePrefix
    - phoneNumber
  - EMERGENCY CONTACT:
    - emergencyContactName
    - emergencyContactPhonePrefix
    - emergencyContactPhoneNumber
  - FAMILY:
    - hasChildren
    - childrenCount
  - HR / ORGANIZATION:
    - department
    - jobTitle
    - contractType
    - employmentStatus
    - workMode
    - officeLocation
  - LIFECYCLE:
    - hireDate
    - terminationDate
    - active
  - legal/emergency consent governance
    - gdprConsentAt
    - privacyPolicyAcceptedAt
- Employee note:
  - Employee appartiene sempre a tenant + companyProfile
  - officeLocation select legge sedi della companyProfile
- UserAccount:
  - id
  - tenant
  - companyProfile
  - employee
  - userType
  - primaryTenant
  - IDENTITY:
    - email
    - passwordHash
  - SECURITY:
    - authenticationMethod
    - otpSecret
    - emailOtpEnabled
    - appOtpEnabled
    - strongAuthenticationRequired
    - emailVerifiedAt
    - passwordChangedAt
    - lastLoginAt
    - failedLoginAttempts
    - locked
    - active
  - LOCALIZATION:
    - timeZone
    - preferredLanguage
  - BASE AUDIT FIELDS:
    - createdAt
    - updatedAt
    - deletedAt
    - createdBy
    - updatedBy
- UserAccount note:
  - email = login principale
  - username rimosso
  - passwordHash obbligatorio
  - companyProfile nullable per tenant-level admins
  - employee nullable per account non-HR
  - strongAuthenticationRequired = forza MFA
  - emailOtpEnabled = OTP via email
  - appOtpEnabled = OTP via authenticator app
  - otpSecret usato per TOTP
  - unique constraint: tenant + email
  - TENANT_USER = tenant singolo
  - TENANT_ADMIN = tenant singolo
  - PLATFORM_OPERATOR = multi-tenant
  - SUPER_ADMIN = cross-tenant globale
  - PLATFORM_OPERATOR => strongAuthenticationRequired obbligatorio
  - SUPER_ADMIN => strongAuthenticationRequired obbligatorio
  - primaryTenant nullable per super admin globale
- Contract:
  - id
  - tenant
  - companyProfile
  - employee
  - contractType
  - currency
  - startDate
  - endDate
  - baseSalary
  - weeklyHours
  - active
- Device:
  - id
  - tenant
  - companyProfile
  - name
  - type
  - brand
  - model
  - serialNumber
  - purchaseDate
  - warrantyEndDate
  - deviceStatus
  - assignedTo
  - assignedAt
  - active
- PayrollDocument:
  - id
  - tenant
  - companyProfile
  - employee
  - contract
  - documentType
  - fileName
  - filePath
  - periodYear
  - periodMonth
  - uploadedAt
- LeaveRequest:
  - id
  - tenant
  - companyProfile
  - employee
  - leaveRequestType
  - startDate
  - endDate
  - reason
  - status
  - createdAt
  - updatedAt
- EmployeeDisciplinaryAction:
  - id
  - tenant
  - companyProfile
  - employee
  - disciplinaryActionType
  - actionDate
  - title
  - description
  - issuedBy
  - relatedDocument
  - active
- AuditLog:
  - id
  - tenant
  - companyProfile
  - userAccount
  - auditActionType
  - actingTenant
  - targetTenant
  - impersonationMode
  - entityType
  - entityId
  - entityDisplayName
  - description
  - oldValueJson
  - newValueJson
  - ipAddress
  - userAgent
  - createdAt
  - success
  - severityLevel
- HolidayCalendar:
  - id
  - country
  - region
  - area
  - startDate
  - endDate
  - name
  - active

BRIDGE TABLES:

- UserRole:
  - id
  - tenant
  - userAccount
  - role
- RolePermission:
  - id
  - tenant
  - role
  - permission
- UserTenantAccess:
  - id
  - userAccount
  - tenant
  - accessRole
  - active
  - createdAt
  - updatedAt

RELATIONAL GOVERNANCE:

- Country:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - Country 1 -> N Region
    - Country 1 -> N NationalIdentifierType
    - Country 1 -> N GlobalZipCode
    - Country 1 -> N OfficeLocation
    - Country 1 -> N HolidayCalendar
- Region:
  - Primary Key:
    - id
  - Foreign Keys:
    - country -> Country.id
  - Relationships:
    - Country 1 -> N Region
    - Region 1 -> N Area
    - Region 1 -> N GlobalZipCode
    - Region 1 -> N OfficeLocation
    - Region 1 -> N HolidayCalendar
- Area:
  - Primary Key:
    - id
  - Foreign Keys:
    - region -> Region.id
  - Relationships:
    - Region 1 -> N Area
    - Area 1 -> N GlobalZipCode
    - Area 1 -> N OfficeLocation
    - Area 1 -> N HolidayCalendar
- GlobalZipCode:
  - Primary Key:
    - id
  - Foreign Keys:
    - country -> Country.id
    - area -> Area.id
    - region -> Region.id
  - Relationships:
    - Country 1 -> N GlobalZipCode
    - Region 1 -> N GlobalZipCode
    - Area 1 -> N GlobalZipCode
    - GlobalZipCode 1 -> N OfficeLocation
    - GlobalZipCode 1 -> N Employee
- NationalIdentifierType:
  - Primary Key:
    - id
  - Foreign Keys:
    - country -> Country.id
  - Relationships:
    - Country 1 -> N NationalIdentifierType
    - NationalIdentifierType 1 -> N Employee
- Currency:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - Currency 1 -> N Contract
- Department:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - Department 1 -> N Employee
- JobTitle:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - JobTitle 1 -> N Employee
- ContractType:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - ContractType 1 -> N Employee
    - ContractType 1 -> N Contract
- EmploymentStatus:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - EmploymentStatus 1 -> N Employee
- WorkMode:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - WorkMode 1 -> N Employee
- Gender:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - Gender 1 -> N Employee
- MaritalStatus:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - MaritalStatus 1 -> N Employee
- DeviceType:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - DeviceType 1 -> N Device
- DeviceBrand:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - DeviceBrand 1 -> N Device
- DeviceStatus:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - DeviceStatus 1 -> N Device
- LeaveRequestType:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - LeaveRequestType 1 -> N LeaveRequest
- DocumentType:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - DocumentType 1 -> N PayrollDocument
- SmtpEncryptionType:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - SmtpEncryptionType 1 -> N SmtpConfiguration
- AuthenticationMethod:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - AuthenticationMethod 1 -> N UserAccount
- UserType:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - UserType 1 -> N UserAccount
- Tenant:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - Tenant 1 -> N CompanyProfile
    - Tenant 1 -> N Employee
    - Tenant 1 -> N UserAccount
    - Tenant 1 -> N Contract
    - Tenant 1 -> N Device
    - Tenant 1 -> N PayrollDocument
    - Tenant 1 -> N LeaveRequest
    - Tenant 1 -> N AuditLog
- CompanyProfileType:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - CompanyProfileType 1 -> N CompanyProfile
- OfficeLocationType:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - OfficeLocationType 1 -> N OfficeLocation
- DisciplinaryActionType:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - DisciplinaryActionType 1 -> N EmployeeDisciplinaryAction
- AuditActionType:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - AuditActionType 1 -> N AuditLog
- Role:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - Role N -> N Permission (via RolePermission)
    - UserAccount N -> N Role (via UserRole)
- Permission:
  - Primary Key:
    - id
  - Foreign Keys:
    - Nessuna
  - Relationships:
    - Role N -> N Permission (via RolePermission)
- CompanyProfile:
  - Primary Key:
    - id
  - Foreign Keys:
    - tenant -> Tenant.id
    - companyProfileType -> CompanyProfileType.id
    - primaryOfficeLocation -> OfficeLocation.id
  - Relationships:
    - Tenant 1 -> N CompanyProfile
    - CompanyProfile 1 -> N OfficeLocation
    - CompanyProfile 1 -> N Employee
    - CompanyProfile 1 -> N UserAccount
- SmtpConfiguration:
  - Primary Key:
    - id
  - Foreign Keys:
    - companyProfile -> CompanyProfile.id
    - encryptionType -> SmtpEncryptionType.id
  - Relationships:
    - CompanyProfile 1 -> N SmtpConfiguration
- OfficeLocation:
  - Primary Key:
    - id
  - Foreign Keys:
    - tenant -> Tenant.id
    - companyProfile -> CompanyProfile.id
    - officeLocationType -> OfficeLocationType.id
    - country -> Country.id
    - region -> Region.id
    - area -> Area.id
    - globalZipCode -> GlobalZipCode.id
  - Relationships:
    - CompanyProfile 1 -> N OfficeLocation
    - OfficeLocation 1 -> N Employee
- Employee:
  - Primary Key:
    - id
  - Foreign Keys:
    - tenant -> Tenant.id
    - companyProfile -> CompanyProfile.id
    - residenceCountry -> Country.id
    - residenceRegion -> Region.id
    - residenceArea -> Area.id
    - residenceGlobalZipCode -> GlobalZipCode.id
    - nationalIdentifierType -> NationalIdentifierType.id
    - birthCountry -> Country.id
    - birthRegion -> Region.id
    - birthArea -> Area.id
    - gender -> Gender.id
    - maritalStatus -> MaritalStatus.id
    - department -> Department.id
    - jobTitle -> JobTitle.id
    - contractType -> ContractType.id
    - employmentStatus -> EmploymentStatus.id
    - workMode -> WorkMode.id
    - officeLocation -> OfficeLocation.id
  - Relationships:
    - Tenant 1 -> N Employee
    - CompanyProfile 1 -> N Employee
    - Department 1 -> N Employee
    - JobTitle 1 -> N Employee
    - OfficeLocation 1 -> N Employee
    - Employee 1 -> N Contract
    - Employee 1 -> N PayrollDocument
    - Employee 1 -> N LeaveRequest
    - Employee 1 -> N EmployeeDisciplinaryAction
- UserAccount:
  - Primary Key:
    - id
  - Foreign Keys:
    - tenant -> Tenant.id
    - companyProfile -> CompanyProfile.id
    - employee -> Employee.id
    - userType -> UserType.id
    - primaryTenant -> Tenant.id
    - authenticationMethod -> AuthenticationMethod.id
    - createdBy -> UserAccount.id
    - updatedBy -> UserAccount.id
  - Relationships:
    - Employee 1 -> 0..1 UserAccount
    - UserAccount N -> N Role (via UserRole)
    - UserAccount 1 -> N UserTenantAccess
    - UserAccount 1 -> N AuditLog
- Contract:
  - Primary Key:
    - id
  - Foreign Keys:
    - tenant -> Tenant.id
    - companyProfile -> CompanyProfile.id
    - employee -> Employee.id
    - contractType -> ContractType.id
    - currency -> Currency.id
  - Relationships:
    - Employee 1 -> N Contract
    - Contract 1 -> N PayrollDocument
- Device:
  - Primary Key:
    - id
  - Foreign Keys:
    - tenant -> Tenant.id
    - companyProfile -> CompanyProfile.id
    - type -> DeviceType.id
    - brand -> DeviceBrand.id
    - deviceStatus -> DeviceStatus.id
    - assignedTo -> Employee.id
  - Relationships:
    - Employee 1 -> N Device
- PayrollDocument:
  - Primary Key:
    - id
  - Foreign Keys:
    - tenant -> Tenant.id
    - companyProfile -> CompanyProfile.id
    - employee -> Employee.id
    - contract -> Contract.id
    - documentType -> DocumentType.id
  - Relationships:
    - Employee 1 -> N PayrollDocument
    - Contract 1 -> N PayrollDocument
- LeaveRequest:
  - Primary Key:
    - id
  - Foreign Keys:
    - tenant -> Tenant.id
    - companyProfile -> CompanyProfile.id
    - employee -> Employee.id
    - leaveRequestType -> LeaveRequestType.id
  - Relationships:
    - Employee 1 -> N LeaveRequest
- EmployeeDisciplinaryAction:
  - Primary Key:
    - id
  - Foreign Keys:
    - tenant -> Tenant.id
    - companyProfile -> CompanyProfile.id
    - employee -> Employee.id
    - disciplinaryActionType -> DisciplinaryActionType.id
    - issuedBy -> UserAccount.id
    - relatedDocument -> PayrollDocument.id
  - Relationships:
    - Employee 1 -> N EmployeeDisciplinaryAction
- AuditLog:
  - Primary Key:
    - id
  - Foreign Keys:
    - tenant -> Tenant.id
    - companyProfile -> CompanyProfile.id
    - userAccount -> UserAccount.id
    - auditActionType -> AuditActionType.id
    - actingTenant -> Tenant.id
    - targetTenant -> Tenant.id
  - Relationships:
    - UserAccount 1 -> N AuditLog
- HolidayCalendar:
  - Primary Key:
    - id
  - Foreign Keys:
    - country -> Country.id
    - region -> Region.id
    - area -> Area.id
  - Relationships:
    - Country 1 -> N HolidayCalendar
    - Region 1 -> N HolidayCalendar
    - Area 1 -> N HolidayCalendar
- UserRole:
  - Primary Key:
    - id
  - Foreign Keys:
    - tenant -> Tenant.id
    - userAccount -> UserAccount.id
    - role -> Role.id
  - Relationships:
    - UserAccount N -> N Role
- RolePermission:
  - Primary Key:
    - id
  - Foreign Keys:
    - tenant -> Tenant.id
    - role -> Role.id
    - permission -> Permission.id
  - Relationships:
    - Role N -> N Permission
- UserTenantAccess:
  - Primary Key:
    - id
  - Foreign Keys:
    - userAccount -> UserAccount.id
    - tenant -> Tenant.id
  - Relationships:
    - UserAccount 1 -> N UserTenantAccess
    - Tenant 1 -> N UserTenantAccess
  - Unique Constraints:
    - userAccount + tenant unique
  - Ownership Scope:
    - Global platform governance

Specifiche chiave:

- supporto multi-country
- email-first authentication
- identity governance
- authentication governance
- platform operator governance
- super admin governance
- cross-tenant governance
- elevated security governance
- tenant switching governance
- cross-tenant auditability
- MFA readiness
- optional strong authentication
- OTP email readiness
- app OTP readiness
- full multi-tenancy
- tenant boundary globale
- tenant -> multi company profile
- legal entity governance
- office hierarchy governance
- disciplinary governance
- audit governance
- tenant scoping su quasi tutte le business tables
- SaaS-ready architecture
- white-label future ready
- tenant-ready architecture
- company governance
- SMTP governance
- RBAC governance
- geographic governance
- address governance
- global postal governance
- identificativi nazionali per paese
- employee demographic governance
- employee lifecycle governance
- contract governance
- payroll document governance
- final settlement readiness
- device lifecycle governance
- work mode governance
- master data governance
- struttura normalizzata per ridurre refactor

Note architetturali:

- L'accesso piattaforma avviene tramite email, non username
- UserAccount = identity/security entity enterprise-ready
- username rimosso
- email = login unico
- passwordHash obbligatorio
- strongAuthenticationRequired = forza MFA
- emailOtpEnabled = OTP via email
- appOtpEnabled = OTP via authenticator app
- otpSecret usato per TOTP
- employee nullable per account non-HR
- companyProfile nullable per tenant-level admins
- Raccomandazione MVP: foundation per PASSWORD_ONLY, EMAIL_OTP e APP_OTP
- Non implementare ora SMS OTP, hardware keys, SSO enterprise o OAuth external IdP
- RBAC flow: UserAccount -> UserRole -> Role -> RolePermission -> Permission
- UserType governa TENANT_USER, TENANT_ADMIN, PLATFORM_OPERATOR e SUPER_ADMIN
- UserTenantAccess abilita accessi multi-tenant espliciti
- Tenant switching deve essere auditato
- Cross-tenant access deve essere auditato
- Impersonation mode deve essere tracciato in AuditLog
- Tutte le business core tables devono essere tenant-scoped
- CompanyProfile scoped dove applicabile
- Master globali possono essere shared
- Master tenant-specific devono includere tenant
- Tutte le bridge tables devono includere tenant
- FK esplicite nei documenti
- Nessun campo relazionale ambiguo
- Employee NON usa fiscalCode locale fisso
- usare nationalIdentifier + nationalIdentifierType
- Tenant = root boundary cliente SaaS
- CompanyProfile = foundation tenant / azienda
- CompanyProfile = legal/business entity del tenant
- CompanyProfileType distingue natura entità
- OfficeLocationType distingue sede legale/operativa
- Employee sempre scoped a:
  - tenant
  - companyProfile
  - officeLocation
- UserAccount separato da Employee
- Role + Permission = RBAC
- SmtpConfiguration = comunicazione sistema
- Contract separato da PayrollDocument
- FINAL_SETTLEMENT via DocumentType
- GlobalZipCode predisposto per dataset progressivi
- streetNumber separato
- terminationDate nullable
- AuditLog tenant scoped
- Disciplinary governance separata da DocumentType
- Tutte le query business future devono essere tenant-aware
- TASK-011 resta TODO

## FASE 2A - FOUNDATION DATA

### TASK-012 - Implementare master tables globali foundation

Stato: DONE

Include:

- Country
- Region
- Area
- GlobalZipCode
- Currency
- TimeZone
- Gender
- MaritalStatus
- NationalIdentifierType
- ApprovalStatus

Completato:

- Entity JPA global master tables create
- Repository JPA creati
- Migrazione Flyway `V1__create_global_master_tables.sql` creata
- Seed minimo inserito per Country, Currency, Gender, MaritalStatus e ApprovalStatus
- Test smoke backend per context load, migration e seed completato

### TASK-013 - Implementare master tables HR/business

Stato: DONE

Include:

- Department
- JobTitle
- ContractType
- EmploymentStatus
- WorkMode
- LeaveRequestType
- DocumentType
- DeviceType
- DeviceBrand
- DeviceStatus

Completato:

- `BaseTenantMasterEntity` creato per master data tenant-scoped
- Entity JPA HR/business tenant-scoped create
- Repository JPA creati
- Migrazione Flyway `V2__create_tenant_hr_business_master_tables.sql` creata
- Temporary tenant placeholder strategy documentata in DEC-019
- `tenant_id UUID NOT NULL` introdotto come foundation strutturale temporanea senza FK reale fino a TASK-015
- Unique constraint `(tenant_id, code)` applicata a tutte le tabelle TASK-013
- Seed tenant placeholder inserito per WorkMode, DocumentType, DeviceType, DeviceBrand e DeviceStatus
- Test smoke backend per context load, migration V1/V2 e seed completato

Nota architetturale:

Tenant-scoped HR/business master foundation completed. Full Tenant FK hardening deferred to TASK-015.

### TASK-014 - Implementare master tables governance/security

Stato: TODO

Include:

- Role
- Permission
- UserType
- AuthenticationMethod
- AuditActionType
- DisciplinaryActionType
- SmtpEncryptionType
- CompanyProfileType
- OfficeLocationType

Dipendenze:

- Deve mantenere separazione rispetto ai master HR/business giÃ  completati in TASK-013
- Deve rispettare tenant-scoped governance dove prevista dal blueprint TASK-011
- Non deve introdurre `Tenant`, `CompanyProfile`, `UserAccount` o bridge RBAC fuori scope

## FASE 2B - TENANT / COMPANY FOUNDATION

### TASK-015 - Implementare Tenant, CompanyProfile e governance multi-company

Stato: TODO

Dipendenze:

- Deve introdurre il dominio `Tenant`
- Deve trasformare la temporary tenant foundation strategy di TASK-013 in governance tenant reale
- Deve aggiungere FK hardening verso `Tenant` per le master tables tenant-scoped giÃ  create, dove applicabile
- Deve preservare il tenant placeholder tecnico `00000000-0000-0000-0000-000000000001` o migrarlo in modo controllato

### TASK-016 - Implementare OfficeLocation e SmtpConfiguration

Stato: TODO

Dipendenze:

- Richiede TASK-012 per master geografici globali
- Richiede TASK-014 per `OfficeLocationType` e `SmtpEncryptionType`
- Richiede TASK-015 per `Tenant` e `CompanyProfile`
- Deve applicare la governance geografica DEC-018

## FASE 2C - EMPLOYEE CORE DOMAIN

### TASK-017 - Implementare Employee entity enterprise completa

Stato: TODO

Dipendenze:

- Richiede TASK-012 per master globali geografici e demografici
- Richiede TASK-013 per Department, JobTitle, ContractType, EmploymentStatus e WorkMode tenant-scoped
- Richiede TASK-015 per Tenant e CompanyProfile
- Richiede TASK-016 per OfficeLocation

### TASK-018 - Implementare Contract governance e employment lifecycle

Stato: TODO

Dipendenze:

- Richiede TASK-013 per ContractType tenant-scoped
- Richiede TASK-012 per Currency
- Richiede TASK-015 per Tenant e CompanyProfile
- Richiede TASK-017 per Employee

### TASK-019 - Implementare UI Employee management enterprise

Stato: TODO

## FASE 2D - IDENTITY / SECURITY

### TASK-020 - Implementare UserAccount, email login e authentication governance

Stato: TODO

### TASK-021 - Implementare RBAC governance

Stato: TODO

Include:

- UserRole
- RolePermission
- UserTenantAccess

### TASK-022 - Implementare Security Admin UI

Stato: TODO

Include:

- utenti
- MFA
- tenant access
- ruoli
- permessi

## FASE 2E - OPERATIONAL HR

### TASK-023 - Implementare Device backend enterprise

Stato: TODO

### TASK-024 - Implementare UI Device governance

Stato: TODO

### TASK-025 - Implementare PayrollDocument backend + document governance

Stato: TODO

### TASK-026 - Implementare UI PayrollDocument

Stato: TODO

### TASK-027 - Implementare LeaveRequest backend + approval workflow

Stato: TODO

### TASK-028 - Implementare UI LeaveRequest

Stato: TODO

### TASK-029 - Implementare HolidayCalendar backend

Stato: TODO

### TASK-030 - Implementare UI HolidayCalendar

Stato: TODO

## FASE 2F - GOVERNANCE / COMPLIANCE

### TASK-031 - Implementare AuditLog backend enterprise

Stato: TODO

### TASK-032 - Implementare Audit UI / compliance explorer

Stato: TODO

### TASK-033 - Implementare EmployeeDisciplinaryAction backend

Stato: TODO

### TASK-034 - Implementare UI disciplinary governance

Stato: TODO

## FASE 2G - PLATFORM OPERATIONS

### TASK-035 - Implementare Platform Operator / Super Admin governance

Stato: TODO

### TASK-036 - Implementare Cross-tenant admin UI

Stato: TODO

## FASE 3 - STABILIZATION

### TASK-037 - Configurare logging, monitoring e observability enterprise

Stato: TODO

### TASK-038 - Test integrato MVP enterprise completo

Stato: TODO

---

## 5. Cronologia versioni

| Versione | Data | Descrizione |
|---|---|---|
| 1.18 | 2026-05-02 | Hardening documentale post TASK-013: chiarite note architetturali, DEC-019, tenant placeholder strategy e dipendenze TASK-014 -> TASK-018. |
| 1.17 | 2026-05-02 | TASK-013 completato con master tables HR/business tenant-scoped, BaseTenantMasterEntity, migration Flyway V2, seed placeholder e test smoke backend. |
| 1.16 | 2026-05-02 | TASK-012 completato con master tables globali foundation, migration Flyway, seed minimo e test smoke backend. |
| 1.15 | 2026-05-01 | Riorganizzazione completa TASK-012+ in execution slicing enterprise SaaS post TASK-011. |
| 1.14 | 2026-05-01 | TASK-011 integrato con UserType, Platform Operator, Super Admin, UserTenantAccess, tenant switching e cross-tenant auditability. |
| 1.13 | 2026-05-01 | TASK-011 integrato con email-first identity, AuthenticationMethod, strong auth opzionale, OTP email/app, unique tenant+email e MFA readiness. |
| 1.12 | 2026-05-01 | TASK-011 integrato con PK/FK/relationships esplicite per tutte le tabelle e regole globali di relational governance tenant-scoped. |
| 1.11 | 2026-05-01 | TASK-011 ampliato a foundation SaaS multi-tenant con Tenant, multi-company, legal entity, office hierarchy, disciplinary e audit governance. |
| 1.10 | 2026-05-01 | TASK-011 ridefinito come platform data foundation con master/core/bridge separation, tenant, RBAC, SMTP, geographic/address, contract e document governance. |
| 1.9 | 2026-05-01 | TASK-011 documentato con blueprint completo di master/core tables, campi, demographic/contact governance e multi-country governance. |
| 1.8 | 2026-05-01 | TASK-011 ampliato con lifecycle HR/device, lookup status, contract type e standardizzazione contatti employee. |
| 1.7 | 2026-05-01 | TASK-011 ridefinito come modello dati iniziale enterprise normalizzato con master tables, core tables e supporto multi-country. |
| 1.6 | 2026-05-01 | TASK-010 completato; profili backend dev/test/prod configurati e validati. |
| 1.5 | 2026-05-01 | TASK-009 completato; Swagger/OpenAPI integrato e validato mantenendo la security attiva sugli altri endpoint. |
| 1.4 | 2026-05-01 | TASK-008 completato; layout reale Metronic adattato; TASK-009 Swagger prossimo step. |
| 1.3 | 2026-05-01 | Riallineati TASK-006 e TASK-007 come completati; introdotto TASK-008 per layout-6 reale. |
| 1.2 | 2026-05-01 | Aggiornato stato dopo TASK-005 e aggiunto TASK-006 per integrazione Metronic Angular. |
| 1.1 | 2026-05-01 | Aggiornato stato task dopo completamento TASK-001, TASK-002, TASK-003 e TASK-004. |
| 1.0 | 2026-05-01 | Prima versione task operativi MVP. |
