# TASKS.md

## Progetto HRM AI-first

Versione: 1.98
Ultimo aggiornamento: 2026-05-09
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

## 3. Execution rules / Process notes

- Il riferimento operativo principale per i task correnti è `TASKS.md`.
- I vecchi file di analisi iniziale, Excel e Word restano materiale storico/di contesto.
- I vecchi file di analisi iniziale, Excel e Word non devono essere usati come fonte vincolante o come scope automatico dei task.
- Se un campo, vincolo o comportamento non è esplicitamente presente nel task corrente di `TASKS.md`, non deve essere implementato automaticamente.
- Ogni task deve essere implementato solo in base allo scope scritto nel task stesso, `ARCHITECTURE.md` e `DECISIONS.md`.

---

## 4. Stato task

Legenda:

- `TODO`: da fare
- `IN_PROGRESS`: in corso
- `DONE`: completato
- `BLOCKED`: bloccato

---

## 5. Stato attuale

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

Stato: DONE

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

Stato: DONE

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

- Deve mantenere separazione rispetto ai master HR/business già completati in TASK-013
- Deve mantenere separazione rispetto ai master HR/business già completati in TASK-013
- Deve rispettare tenant-scoped governance dove prevista dal blueprint TASK-011
- Non deve introdurre `Tenant`, `CompanyProfile`, `UserAccount` o bridge RBAC fuori scope

Completato:

- Master globali governance/security creati: UserType, AuthenticationMethod, AuditActionType, DisciplinaryActionType, SmtpEncryptionType
- Master tenant-scoped creati: Role, Permission, CompanyProfileType, OfficeLocationType
- Entity JPA create con `BaseMasterEntity` per global e `BaseTenantMasterEntity` per tenant-scoped
- Repository JPA creati
- Migrazione Flyway `V3__create_governance_security_master_tables.sql` creata
- Unique constraint `code` applicata ai master globali
- Unique constraint `(tenant_id, code)` applicata ai master tenant-scoped
- Seed tenant placeholder inserito per Role, Permission, CompanyProfileType e OfficeLocationType
- DEC-020 aggiunta per split governance/security tra standard globali e governance operativa tenant-scoped
- Test smoke backend per context load, migration V1/V2/V3 e seed completato

Nota architetturale:

Governance/security master foundation completed. Operational UserAccount, RBAC bridge tables, Tenant FK hardening and platform audit runtime remain deferred to future tasks.

## FASE 2B - TENANT / COMPANY FOUNDATION

### TASK-015 - Implementare Tenant, CompanyProfile, OfficeLocation e SmtpConfiguration foundation

Stato: DONE

Dipendenze:

- Deve introdurre il dominio `Tenant`
- Deve trasformare la temporary tenant foundation strategy di TASK-013 in governance tenant reale
- Deve aggiungere FK hardening verso `Tenant` per le master tables tenant-scoped già create, dove applicabile
- Deve aggiungere FK hardening verso `Tenant` per le master tables tenant-scoped già create, dove applicabile
- Deve preservare il tenant placeholder tecnico `00000000-0000-0000-0000-000000000001` o migrarlo in modo controllato

Completato:

- Dominio `Tenant` reale introdotto
- `CompanyProfile` foundation introdotto per legal entity principale
- `OfficeLocation` foundation introdotto con sede `HEADQUARTER`
- `SmtpConfiguration` foundation introdotto con password placeholder encrypted string
- Migrazione Flyway `V4__create_tenant_company_office_smtp_foundation.sql` creata
- Tenant placeholder `00000000-0000-0000-0000-000000000001` preservato come `FOUNDATION_TENANT`
- FK reali aggiunte da tutte le tabelle tenant-scoped TASK-013 e TASK-014 verso `tenants.id`
- FK reali aggiunte verso master globali e tenant-scoped coerenti: Country, Currency, CompanyProfileType, OfficeLocationType, SmtpEncryptionType
- Seed foundation inserito per Tenant, CompanyProfile, OfficeLocation e SmtpConfiguration
- Test smoke backend per context load, migration V1/V2/V3/V4, seed e FK hardening completato

Nota architetturale:

Placeholder tenant foundation converted into real Tenant domain. Multi-company and multi-office baseline is ready; operational APIs, service validation and advanced tenant administration remain future work.

### TASK-016 - Consolidare Tenant / Company / Office / SMTP validation e API readiness

Stato: DONE

Dipendenze:

- Richiede TASK-012 per master geografici globali
- Richiede TASK-014 per `OfficeLocationType` e `SmtpEncryptionType`
- Richiede TASK-015 per `Tenant` e `CompanyProfile`
- Deve applicare la governance geografica DEC-018

Nota:

Le tabelle OfficeLocation e SmtpConfiguration sono state anticipate e implementate come foundation dati in TASK-015 su istruzione umana. TASK-016 resta come step futuro per service validation, API readiness e regole operative, senza reintrodurre strutture parallele.

Completato:

- Bean Validation SMTP allineata alla nullability schema: `username` e `passwordEncrypted` opzionali
- DTO read-only foundation creati per evitare esposizione diretta delle entity JPA
- Service layer minimo `FoundationReadService` creato con transazioni read-only
- Controller REST read-only creato sotto `/api/foundation`
- Endpoint disponibili:
  - `GET /api/foundation/tenants`
  - `GET /api/foundation/tenants/{id}`
  - `GET /api/foundation/company-profiles`
  - `GET /api/foundation/offices`
  - `GET /api/foundation/smtp-configurations`
- `passwordEncrypted` non esposto nelle response API SMTP
- Gestione errori base aggiunta per 404, validation error e constraint violation
- OpenAPI/Swagger verificato per gli endpoint foundation
- DEC-022 aggiunta per boundary API foundation read-only basato su DTO/service
- Test backend completati per context, Flyway V1/V2/V3/V4, seed, endpoint API e OpenAPI

Nota architetturale:

Tenant / Company / Office / SMTP foundation API readiness completed. Operational write APIs, admin CRUD, tenant provisioning, Employee, UserAccount and RBAC bridge remain deferred to future tasks.

## FASE 2C - EMPLOYEE CORE DOMAIN

### TASK-017 - Implementare Employee core domain foundation

Stato: DONE

Dipendenze:

- Richiede TASK-012 per master globali geografici e demografici
- Richiede TASK-013 per Department, JobTitle, ContractType, EmploymentStatus e WorkMode tenant-scoped
- Richiede TASK-015 per Tenant e CompanyProfile
- Richiede TASK-016 per OfficeLocation API readiness e foundation validation

Completato:

- Migrazione Flyway `V5__create_employee_core_foundation.sql` creata
- Tabella `employees` introdotta con tenant, company, office, residence address, national identity, birth data, demographic, contact, emergency contact, family, HR organization, lifecycle e consent governance foundation
- FK reali aggiunte verso `tenants`, `company_profiles` e `office_locations`
- Unique constraint `(tenant_id, employee_code)` applicata
- Indici creati su `tenant_id`, `company_id`, `office_id` ed `employment_status`
- Entity JPA `Employee` creata nel package employee
- Repository JPA `EmployeeRepository` creato
- Test backend aggiunti per migration, persistenza Employee con campi foundation estesi e unique constraint tenant + employee code

Nota architetturale:

Employee core persistence foundation completed. API REST Employee, UI Employee, UserAccount linkage, RBAC operativo, payroll, documenti e workflow HR restano fuori scope e differiti ai task successivi.

### TASK-018 - Implementare Contract governance e employment lifecycle

Stato: DONE

Dipendenze:

- Richiede TASK-013 per ContractType tenant-scoped
- Richiede TASK-012 per Currency
- Richiede TASK-015 per Tenant e CompanyProfile
- Richiede TASK-017 per Employee

Completato:

- Migrazione Flyway `V6__create_contract_governance_foundation.sql` creata
- Tabella `contracts` introdotta con tenant, companyProfile, employee, contractType, currency, startDate, endDate, baseSalary, weeklyHours e active
- FK reali aggiunte verso `tenants`, `company_profiles`, `employees`, `contract_types` e `currencies`
- Indici creati su `tenant_id`, `company_profile_id`, `employee_id`, `contract_type_id`, `currency_id` e `active`
- Check constraint minime aggiunte per date range, baseSalary e weeklyHours
- Entity JPA `Contract` creata nel package contract
- Repository JPA `ContractRepository` creato
- Test backend aggiunti per migration V6 e persistenza Contract con relazioni foundation

Nota architetturale:

Contract governance and employment lifecycle foundation completed. Operational contract APIs, workflow HR, payroll integration, UserAccount/RBAC and UI remain fuori scope e differiti ai task successivi.

### TASK-019 - Riorganizzare backlog backend-first

Stato: DONE

Tipo: Documentale

Obiettivo:

- Riallineare il backlog futuro in modalita backend-first
- Mantenere TASK-001 -> TASK-018 invariati
- Fare partire le nuove implementazioni tecniche da TASK-020
- Separare foundation backend, API readiness e UI operative

Completato:

- Backlog futuro rinumerato da TASK-019 in avanti
- TASK-019 ridefinito come task documentale di riorganizzazione backlog
- Sequenza backend-first introdotta per identity, RBAC, device, payroll, leave, holiday, audit e disciplinary foundation
- UI operative rinviate dopo il consolidamento backend core HR
- TASKS.md e ROADMAP.md riallineati

## FASE 2D - IDENTITY / SECURITY

### TASK-020 - Implementare UserAccount identity/security foundation

Stato: DONE

Dipendenze:

- Richiede TASK-014 per UserType e AuthenticationMethod
- Richiede TASK-015 per Tenant e CompanyProfile
- Richiede TASK-017 per Employee
- Richiede TASK-019 per strategia backend-first
- Deve rispettare DEC-015, DEC-016 e DEC-023

Completato:

- Migrazione Flyway `V7__create_user_account_identity_security_foundation.sql` creata
- Tabella `user_accounts` introdotta con identity email-first, authentication governance, OTP readiness, strong authentication flag, localization e audit fields
- FK reali aggiunte verso `tenants`, `company_profiles`, `employees`, `user_types`, `authentication_methods`, `time_zones` e primary tenant
- Self-FK opzionali aggiunte per `created_by` e `updated_by`
- Unique constraint `(tenant_id, email)` applicata
- Check constraint minima aggiunta su `failed_login_attempts`
- Entity JPA `UserAccount` creata nel package identity
- Repository JPA `UserAccountRepository` creato
- Test backend aggiunti per migration V7, persistenza UserAccount, nullable company/employee, strong authentication persistence e unique constraint tenant + email

Nota architetturale:

UserAccount identity/security persistence foundation completed. Login JWT, password reset, OTP runtime, MFA runtime, API REST, UI, UserRole, RolePermission and UserTenantAccess remain fuori scope e differiti ai task successivi.

### TASK-021 - Implementare RBAC bridge foundation

Stato: DONE

Include:

- UserRole
- RolePermission
- UserTenantAccess

Completato:

- Migration Flyway V8 `V8__create_rbac_bridge_foundation.sql`
- Tabelle `user_roles`, `role_permissions` e `user_tenant_accesses`
- FK reali verso `tenants`, `user_accounts`, `roles` e `permissions`
- Unique constraint minime:
  - `user_roles`: `(tenant_id, user_account_id, role_id)`
  - `role_permissions`: `(tenant_id, role_id, permission_id)`
  - `user_tenant_accesses`: `(user_account_id, tenant_id)`
- Entity JPA create nel package `rbac`
- Repository JPA dedicati creati
- `UserTenantAccess.accessRole` implementato come `VARCHAR(50) NOT NULL`, senza enum, FK a ruoli o logica applicativa
- Test backend aggiunti per migration V8, repository boot, persistenza bridge e unique constraint

Nota architetturale:

RBAC bridge persistence foundation completed. API REST, DTO, service layer, login/JWT runtime, Spring Security RBAC runtime, tenant switching, impersonation, audit runtime and UI remain fuori scope e differiti ai task successivi.

## FASE 2E - BACKEND CORE HR FOUNDATION

### TASK-022 - Implementare Device backend foundation

Stato: DONE

Completato:

- Migration Flyway V9 `V9__create_device_backend_foundation.sql`
- Tabella `devices` introdotta con relazioni tenant/company/master device/employee assignment opzionale
- FK reali verso `tenants`, `company_profiles`, `device_types`, `device_brands`, `device_statuses` ed `employees`
- Check constraint `warranty_end_date IS NULL OR warranty_end_date >= purchase_date`
- Entity JPA `Device` creata nel package `device`
- Repository JPA `DeviceRepository` creato
- Test backend aggiunti per migration V9, persistenza Device assegnato, Device non assegnato e query repository tenant/company e tenant/employee

Nota architetturale:

Device backend persistence foundation completed. Device assignment workflow, API REST, DTO, service layer, frontend/UI and operational governance remain fuori scope e differiti ai task successivi.

### TASK-023 - Implementare PayrollDocument backend foundation

Stato: DONE

Completato:

- Migration Flyway V10 `V10__create_payroll_document_backend_foundation.sql`
- Tabella `payroll_documents` introdotta con relazioni tenant/company/employee/contract/document type/uploaded by opzionale
- FK reali verso `tenants`, `company_profiles`, `employees`, `contracts`, `document_types` e `user_accounts`
- Check constraint su `file_size_bytes`, `period_month`, `period_year`, `status` e `published_at` obbligatorio per documenti pubblicati
- Unique constraint su tenant, employee, document type, anno e mese del periodo payroll
- Entity JPA `PayrollDocument` creata nel package `payroll`
- Enum `PayrollDocumentStatus` creato con stati `DRAFT` e `PUBLISHED`
- Repository JPA `PayrollDocumentRepository` creato
- Test backend aggiunti per migration V10, persistenza PayrollDocument DRAFT, persistenza PayrollDocument PUBLISHED e query repository tenant/employee e tenant/employee/periodo/document type
- Test validati con `BUILD SUCCESS`

Nota architetturale:

PayrollDocument backend persistence foundation completed. Upload/download fisico, API REST, DTO, service layer, frontend/UI, notifiche e workflow di pubblicazione restano fuori scope e differiti ai task successivi.

### TASK-024 - Implementare LeaveRequest backend foundation

Stato: DONE

Completato:

- Migration Flyway V11 `V11__create_leave_request_backend_foundation.sql`
- Tabella `leave_requests` introdotta con relazioni tenant/company/employee/leave request type/approver opzionale
- FK reali verso `tenants`, `company_profiles`, `employees` e `leave_request_types`
- Check constraint su range date, durata, giorni dedotti, status e motivo obbligatorio per richieste urgenti
- Entity JPA `LeaveRequest` creata nel package `leave`
- Enum `LeaveRequestStatus` creato con stati `DRAFT`, `SUBMITTED`, `APPROVED`, `REJECTED` e `CANCELLED`
- Repository JPA `LeaveRequestRepository` creato
- Test backend aggiunti per migration V11, persistenza LeaveRequest DRAFT, persistenza LeaveRequest APPROVED con approver, query repository e vincoli DB
- Test validati con `BUILD SUCCESS`

Nota architetturale:

LeaveRequest backend persistence foundation completed. Workflow approvativo operativo, API REST, DTO, service layer, calcolo ferie, LeaveBalance, attachment/file storage, frontend/UI e notifiche restano fuori scope e differiti ai task successivi.

### TASK-025 - Implementare HolidayCalendar backend foundation

Stato: DONE

Completato:

- Migration Flyway V12 `V12__create_holiday_calendar_backend_foundation.sql`
- Tabella `holiday_calendars` introdotta con relazioni country/region/area
- FK reali verso `countries`, `regions` e `areas`
- Check constraint `end_date >= start_date`
- Entity JPA `HolidayCalendar` creata nel package `calendar`
- Repository JPA `HolidayCalendarRepository` creato
- Test backend aggiunti per migration V12, persistenza HolidayCalendar, query country/region/area, default active e vincoli DB/validation
- Test validati con `BUILD SUCCESS`

Nota architetturale:

HolidayCalendar backend persistence foundation completed. API REST, DTO, service layer, UI, seed festivita, calcolo festivita mobili e workflow operativo restano fuori scope e differiti ai task successivi.

### TASK-026 - Implementare AuditLog backend foundation

Stato: DONE

Completato:

- Migration Flyway V13 `V13__create_audit_log_backend_foundation.sql`
- Tabella `audit_logs` introdotta con relazioni tenant/company/user/action/acting tenant/target tenant
- FK reali verso `tenants`, `company_profiles`, `user_accounts` e `audit_action_types`
- Check constraint su `impersonation_mode` e `severity_level`
- Entity JPA `AuditLog` creata nel package `audit`
- Repository JPA `AuditLogRepository` creato
- Test backend aggiunti per migration V13, persistenza AuditLog system/user/cross-tenant metadata, query repository e vincoli DB
- Test validati con `BUILD SUCCESS`

Nota architetturale:

AuditLog backend persistence foundation completed. Runtime audit automatico, interceptor/aspect, integrazione login/JWT, tenant switching reale, impersonation reale, API REST, DTO, service layer e UI restano fuori scope e differiti ai task successivi.

### TASK-027 - Implementare EmployeeDisciplinaryAction backend foundation

Stato: DONE

Completato:

- Migration Flyway V14 `V14__create_employee_disciplinary_action_backend_foundation.sql`
- Tabella `employee_disciplinary_actions` introdotta con relazioni tenant/company/employee/disciplinary action type/issued by/related document
- FK reali verso `tenants`, `company_profiles`, `employees`, `disciplinary_action_types`, `user_accounts` e `payroll_documents`
- `related_document_id` nullable con FK verso `payroll_documents`
- `issued_by_id` obbligatorio con FK verso `user_accounts`
- Entity JPA `EmployeeDisciplinaryAction` creata nel package `disciplinary`
- Repository JPA `EmployeeDisciplinaryActionRepository` creato
- Test backend aggiunti per migration V14, persistenza EmployeeDisciplinaryAction con e senza related document, query repository e vincoli minimi
- Test validati con `BUILD SUCCESS`

Nota architetturale:

EmployeeDisciplinaryAction backend persistence foundation completed. API REST, DTO, service layer, controller, UI, workflow disciplinare, notifiche, upload/download, audit runtime e security integration restano fuori scope e differiti ai task successivi.

### TASK-028 - Consolidare API readiness backend core HR

Stato: DONE

Completato:

- Controller REST read-only `CoreHrReadController` creato sotto `/api/core-hr`
- Service read-only `CoreHrReadService` creato con `@Transactional(readOnly = true)`
- DTO espliciti creati nel package `dto.corehr`
- Endpoint GET lista e GET by id aggiunti per Employee, Contract, Device, PayrollDocument, LeaveRequest, HolidayCalendar, AuditLog ed EmployeeDisciplinaryAction
- Mapping entity -> DTO introdotto senza esporre direttamente entity JPA
- Gestione not found riusata tramite `ResourceNotFoundException`
- Test MockMvc aggiunti per liste, dettaglio by id, 404, UUID invalido e OpenAPI
- Test validati con `BUILD SUCCESS`

Nota architetturale:

Core HR API readiness read-only completed. API write, CRUD operativo, workflow approvativi, upload/download fisico documenti, login/JWT runtime, RBAC runtime, tenant switching runtime, audit automatico, frontend/UI e notifiche restano fuori scope e differiti ai task successivi.

## FASE 2F - API CRUD MASTER DATA / LOGIN / FRONTEND SHELL / UI ADMIN / OPERATIONS

Decisione operativa:

- Prima implementare API CRUD master data backend.
- Poi implementare UI Master Data Admin.
- Le API read-only esistenti (`/api/foundation`, `/api/core-hr`) possono supportare consultazione, ma non sostituiscono le API CRUD necessarie per una UI amministrativa completa.

### TASK-029 - Definire governance frontend UI e shared components

Stato: DONE

Tipo: Documentale / Governance

Completato:

- File `frontend/AGENTS.md` creato con regole operative frontend Angular
- Governance frontend formalizzata su reuse first, extend before creating e componenti shared
- Regole definite per componenti feature-specific e promozione a shared component
- Governance Metronic chiarita come riferimento visuale approvato, non codice da copiare indiscriminatamente
- Regole di consistenza UI definite per riuso di `app-shell`, `app-header`, `app-sidebar` e layout esistenti
- Validazione task frontend chiarita: build frontend per modifiche codice, `git status`/`git diff` per task markdown-only
- Backlog UI e task successivi rinumerati di +1

Nota:

Task documentale completato senza modifiche a codice backend, codice frontend applicativo, `ARCHITECTURE.md` o `DECISIONS.md`. UI Master Data Admin resta non implementata ed è stata successivamente rinviata dopo le API CRUD master data.

### TASK-030 - Implementare API CRUD master data globali

Stato: DONE

Include:

- Country
- Region
- Area
- GlobalZipCode
- Currency
- Gender
- MaritalStatus
- NationalIdentifierType

Completato:

- DTO request/response
- Service layer applicativo `MasterDataGlobalService`
- Controller REST `MasterDataGlobalController` sotto `/api/master-data/global`
- CRUD backend per Country, Region, Area, GlobalZipCode, Currency, Gender, MaritalStatus e NationalIdentifierType
- DELETE implementato come soft delete con `active=false`
- Validazioni minime su campi obbligatori e relazioni geografiche coerenti
- Gestione errori per not found, validation error e conflict 409 su chiavi naturali
- Repository master estesi con metodi `exists/find` necessari
- Test backend MockMvc per CRUD flow, validation error, not found, conflict 409 e OpenAPI `/v3/api-docs`

Nota:

Le API CRUD master data globali sono disponibili prima della UI Master Data Admin. Nessuna migration, nessun frontend e nessuna modifica security runtime introdotta. Validazione completata con BUILD SUCCESS.

### TASK-031 - Implementare API CRUD master data HR/business

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

- DTO request/response generici `TenantMasterDataRequest` e `TenantMasterDataResponse`
- Service layer applicativo `MasterDataHrBusinessService`
- Controller REST `MasterDataHrBusinessController` sotto `/api/master-data/hr-business`
- CRUD backend per Department, JobTitle, ContractType, EmploymentStatus, WorkMode, LeaveRequestType, DocumentType, DeviceType, DeviceBrand e DeviceStatus
- DELETE implementato come soft delete con `active=false`
- Validazioni minime su `tenantId`, `code`, `name`, default `active=true`, normalizzazione `code` uppercase/trim e `name` trim
- Gestione errori per validation/semantic error 400, not found 404 e conflict 409 su `tenantId + code`
- Repository master HR/business estesi con metodi `existsByTenantIdAndCode` e `existsByTenantIdAndCodeAndIdNot`
- Test backend MockMvc per list, get by id, create, update, delete/disable, validation error, not found, conflict 409 e OpenAPI `/v3/api-docs`

Nota:

Le API CRUD master data HR/business sono disponibili prima della relativa gestione UI operativa. Nessuna migration, nessun frontend, nessuna modifica security runtime, nessun login/JWT runtime, nessun RBAC runtime e nessun tenant switching operativo introdotti.

### TASK-032 - Implementare API CRUD master data governance/security

Stato: DONE

Include:

- UserType
- AuthenticationMethod
- Role
- Permission
- AuditActionType
- DisciplinaryActionType
- SmtpEncryptionType
- CompanyProfileType
- OfficeLocationType

Completato:

- DTO request/response espliciti in `dto/masterdata/governancesecurity`
- Service layer applicativo `MasterDataGovernanceSecurityService`
- Controller REST `MasterDataGovernanceSecurityController` sotto `/api/master-data/governance-security`
- CRUD backend per UserType, AuthenticationMethod, AuditActionType, DisciplinaryActionType, SmtpEncryptionType, Role, Permission, CompanyProfileType e OfficeLocationType
- DELETE implementato come soft delete con `active=false`
- Validazioni minime su `code`, `name`, campi specifici obbligatori e `tenantId` per risorse tenant-scoped
- Default `active=true` se assente, normalizzazione `code` uppercase/trim e `name` trim
- Gestione errori per validation/semantic error 400, not found 404 e conflict 409 su `code` o `tenantId + code`
- Repository governance/security estesi con metodi di conflict check necessari
- Test backend MockMvc per list, get by id, create, update, delete/disable, validation error, not found, conflict 409 e OpenAPI `/v3/api-docs`

Nota:

Le API CRUD master data governance/security sono disponibili prima della UI amministrativa completa. Nessuna nuova entity, nessuna migration, nessun frontend, nessun login/JWT runtime, nessun RBAC runtime e nessun tenant switching operativo introdotti.

### TASK-033 - Riorganizzare backlog login/JWT prima delle UI amministrative

Stato: DONE

Tipo: Documentale / Backlog governance

Completato:

- Backlog riorganizzato per introdurre backend login/JWT foundation prima delle UI amministrative
- Frontend login foundation inserita prima della UI Master Data Admin
- UI Master Data Admin foundation/list spostata dopo login foundation
- UI Master Data Admin CRUD spostata dopo UI foundation/list
- Task successivi rinumerati mantenendo ordine e coerenza
- ROADMAP.md aggiornato con nuovo prossimo passo
- DECISIONS.md aggiornato con decisione architetturale dedicata

Nota:

Task solo documentale. Nessun codice backend, nessun codice frontend, nessuna implementazione login/JWT, nessuna UI login e nessuna UI Master Data Admin introdotti.

### TASK-034 - Implementare backend login/JWT foundation

Stato: DONE

Completato:

- Endpoint pubblico `POST /api/auth/login` implementato con login solo email/password
- Endpoint protetto `GET /api/auth/me` implementato per utente autenticato
- DTO auth espliciti `LoginRequest`, `LoginResponse` e `AuthenticatedUserResponse`
- Service layer applicativo `AuthService`
- JWT stateless configurato con Spring Security OAuth2 Resource Server / Jose
- Secret e scadenza JWT configurabili da `application.yml` / variabili ambiente
- Claim JWT principali: `sub`, `userId`, `tenantId`, `userType`
- `UserDetailsService` basato su `UserAccount` e lookup email globale case-insensitive
- `BCryptPasswordEncoder` configurato
- Password policy foundation riusabile introdotta
- Migration Flyway V15 introdotta per vincolo email globale case-insensitive
- Security stateless configurata con `/api/auth/login`, OpenAPI e Swagger pubblici; endpoint applicativi e actuator protetti
- Test backend MockMvc/unitari aggiunti per login valido, email case-insensitive, credenziali errate, account senza password hash, account inactive/locked, `/api/auth/me`, OpenAPI pubblico, actuator protetto e password policy

Nota:

TASK-034 non introduce refresh token, logout server-side, registrazione, forgot password, change password, OTP/MFA runtime, RBAC runtime completo, tenant switching, impersonation, Keycloak, frontend o UI login.

### TASK-035 - Implementare frontend login foundation

Stato: DONE

Obiettivo:

- Implementare la foundation frontend per login usando i contratti backend login/JWT disponibili.
- Riusare shell, layout e convenzioni frontend esistenti secondo `frontend/AGENTS.md`.
- Gestire stato autenticazione, token storage e navigazione base post-login in modo coerente con il MVP.
- Non implementare OTP/MFA UI, RBAC runtime UI, tenant switching UI o impersonation UI.

Sottotask operativi:

035.1 - Analisi frontend esistente
- leggere `frontend/AGENTS.md`
- verificare routing Angular
- verificare layout/shell esistenti
- verificare asset/classi Metronic disponibili
- verificare eventuali asset login/sign-in già presenti
- definire file da modificare/creare

035.2 - Riferimento grafico Metronic
- usare come riferimento visuale una pagina login/sign-in Metronic
- riusare asset/classi Metronic già presenti nel progetto
- non copiare codice HTML/CSS esterno dalla demo
- non usare Stitch come sorgente di codice
- mantenere UI minimale coerente con layout e stile esistenti

URL riferimento visuale:
- https://keenthemes.com/metronic/tailwind/demo1/authentication/classic/sign-in

035.3 - Routing login
- aggiungere rotta `/login`
- verificare redirect iniziale
- evitare modifiche invasive al routing esistente

035.4 - Shared form fields foundation
- creare area shared dedicata ai campi form riusabili
- creare `EmailFieldComponent`
- creare `PasswordFieldComponent`
- supportare Reactive Forms
- API minimale
- stile coerente con Metronic
- nessun form framework generico
- nessun componente base astratto
- nessun componente shared oltre email/password

035.5 - Shared feedback foundation
- creare `AlertMessageComponent` riusabile
- supportare `type`: `danger`, `warning`, `success`, `info`
- supportare messaggio testuale
- dismiss opzionale solo se semplice
- usare classi Metronic/Bootstrap già disponibili
- non creare toast system
- non creare notification center
- non creare gestione globale errori

035.6 - EmailFieldComponent
- input `type="email"`
- validazione formato email tramite Reactive Forms / `Validators.email`
- label configurabile
- placeholder configurabile
- messaggi errore base
- trim del valore prima del submit/login

035.7 - PasswordFieldComponent
- input `type="password"`
- toggle mostra/nascondi password con icona occhio
- label configurabile
- placeholder configurabile
- messaggi errore base
- non implementare password policy nel login
- non loggare mai la password

035.8 - Login page UI
- creare `LoginComponent`
- card centrale stile Metronic
- usare `EmailFieldComponent`, `PasswordFieldComponent` e `AlertMessageComponent`
- validazioni base
- loading state sul submit
- messaggio errore generico per login fallito
- niente registrazione
- niente forgot password
- niente social login

035.9 - Core auth foundation
- creare `frontend/src/app/core/auth/`
- `AuthService`
- `AuthGuard`
- `AuthInterceptor`
- `AuthModels`

035.10 - Auth service
- chiamata `POST /api/auth/login`
- chiamata `GET /api/auth/me`
- gestione token JWT
- persistenza token in `sessionStorage`
- logout base con rimozione token

035.11 - Route guard
- proteggere rotte principali
- redirect a `/login` se non autenticato

035.12 - HTTP auth integration
- aggiungere `Authorization: Bearer <token>`
- usare pattern Angular semplice e mantenibile
- gestire assenza token in modo sicuro
- non gestire errori globali complessi

035.13 - Navigazione post-login
- dopo login valido andare alla shell/app
- se già autenticato evitare di restare sulla login

035.14 - Test e validazione tecnica
- build frontend
- test se presenti
- login con credenziali errate -> HTTP 401
- accesso rotta protetta senza token -> redirect login
- refresh pagina con token presente -> utente autenticato
- logout -> token rimosso

Nota test:
- non sono disponibili credenziali valide in questa fase
- la validazione grafica/manuale della pagina login sarà fatta da una persona
- Codex deve eseguire solo test tecnici automatizzabili o verificabili da build/test

035.15 - Documentazione finale task
- a task completato aggiornare `TASKS.md`
- a task completato aggiornare `ROADMAP.md`
- aggiornare `DECISIONS.md` solo se emerge una decisione architetturale durevole

Fuori scope TASK-035:

- backend
- OTP/MFA
- RBAC UI
- tenant switching
- impersonation
- registrazione utente
- forgot password
- social login
- refactor layout generale
- gestione avanzata sessione multitab
- sincronizzazione logout tra tab
- persistenza cross-tab
- uso di `localStorage` per token
- refresh token
- gestione avanzata scadenza token lato frontend
- frontend app versioning
- auto clean cache dopo nuovo deploy
- service worker / PWA cache strategy
- componenti shared oltre `EmailFieldComponent`, `PasswordFieldComponent` e `AlertMessageComponent`
- toast system o notification center

Completato:

- Route pubblica `/login` aggiunta
- Route principale protetta tramite auth guard
- `LoginComponent` standalone creato con Reactive Forms e UI minimale coerente con Metronic
- Componenti shared `EmailFieldComponent`, `PasswordFieldComponent` e `AlertMessageComponent` creati
- Core auth foundation creata sotto `frontend/src/app/core/auth/`
- `AuthService` creato con `POST /api/auth/login`, `GET /api/auth/me`, token JWT in `sessionStorage` con chiave `hrm.accessToken` e logout base
- `AuthGuard` creato per redirect a `/login` quando manca autenticazione
- `AuthInterceptor` creato per aggiungere `Authorization: Bearer <token>` alle richieste autenticate
- `provideHttpClient` configurato con interceptor
- Errore login generico configurato come `Email o password non corretti.`
- Test tecnici aggiunti per auth service e interceptor
- Build frontend e test frontend validati

Nota:

TASK-035 non introduce backend, proxy frontend, refresh token, gestione scadenza avanzata, gestione multitab avanzata, OTP/MFA, RBAC UI, tenant switching, impersonation, registrazione utente, forgot password, social login, refactor shell/header/sidebar o gestione errori globale.

### TASK-036 - Frontend authenticated home shell foundation

Stato: DONE

Obiettivo:

- Introdurre una home vuota post-login usando la shell Angular esistente, con header e side menu gia presenti.

Scope:

- Frontend only.
- Usare la shell esistente.
- Riusare `app-shell`, `app-header` e `app-sidebar`.
- Nessuna UI Master Data Admin.
- Nessun backend.
- Nessun refactor di shell/header/sidebar.
- Nessun nuovo componente shared se non necessario.
- Nessuna funzionalita business.
- Solo home vuota autenticata post-login.

Output atteso:

- Route autenticata post-login pronta per ospitare future dashboard/moduli.
- Shell/header/sidebar visibili dopo login.
- Pagina home vuota/minimale.

Completato:

- Verificata la shell Angular esistente con `app-shell`, `app-header`, `app-sidebar` e `router-outlet`.
- Introdotto `HomeComponent` standalone locale sotto `frontend/src/app/features/home/`.
- Route principale protetta `/` aggiornata come shell route con child route home.
- `AppShellComponent` mantenuto come layout autenticato con header, sidebar e outlet.
- Rimossi dalla shell i placeholder dashboard/moduli per lasciare una home minimale.
- Nessuna UI Master Data Admin introdotta.
- Nessuna modifica a backend, login/JWT, logout o route pubblica `/login`.
- Build frontend e test frontend validati.

Nota:

TASK-036 prepara la superficie autenticata post-login senza introdurre funzionalita business, redesign generale, nuovi componenti shared o modifiche ai flussi di autenticazione.

### TASK-037 - Frontend application logo integration

Stato: DONE

Obiettivo:

- Integrare nella login UI esistente il logo gia preparato per il progetto.

Scope:

- Frontend only.
- Verificare dove sono gestiti asset/logo e login UI.
- Usare asset esistente se gia presente.
- Se l'asset non e presente, prevedere nel task futuro l'aggiunta nella posizione corretta.
- Integrare il logo nella login UI esistente.
- Non modificare backend.
- Non introdurre logiche business.
- Non creare componenti shared non necessari.
- Non sostituire la shell esistente.
- Non introdurre redesign generale.
- Non modificare sidebar/header/shell.
- Non modificare routing, autenticazione, login/logout.

Output atteso:

- Logo visibile nella login UI.
- Asset referenziato correttamente nel frontend.
- Build Angular funzionante.

Completato:

- Verificata presenza del logo in `frontend/public/assets/logos/hrm-logo.png`.
- Logo integrato nel blocco logo esistente della pagina login.
- Template `LoginComponent` aggiornato per referenziare `assets/logos/hrm-logo.png`.
- Testo alternativo configurato come `HRM AI-first`.
- Nessun nuovo componente shared introdotto.
- Nessuna modifica a routing, autenticazione, login/logout, backend, sidebar/header/shell o UI Master Data Admin.

Nota:

TASK-037 riusa la login UI esistente. Non introduce logiche business, redesign generale, nuove pagine o sostituzione della shell.

### TASK-038 - Frontend design guidelines based on logo brand colors

Stato: DONE

Tipo: Documentale / Frontend governance

Descrizione:

- Definire linee guida frontend coerenti con il logo applicativo e i suoi colori, senza introdurre redesign generale.

Scope:

- Analizzare i colori principali del logo HRM AI-first.
- Definire palette primaria/secondaria frontend.
- Stabilire regole minime di utilizzo per login, shell, header, sidebar, pulsanti e stati UI.
- Documentare le direttive in `frontend/AGENTS.md` in un task successivo dedicato.
- Evitare modifiche invasive alla UI.
- Evitare introduzione di nuovi componenti shared se non strettamente necessario.
- Mantenere coerenza con Metronic/Tailwind e con la shell Angular esistente.

Out of scope:

- Nessun redesign generale.
- Nessuna nuova pagina.
- Nessuna UI Master Data Admin.
- Nessuna modifica backend.
- Nessuna modifica a routing, auth, login/logout.
- Nessuna implementazione grafica in questo task di riallineamento.

Output atteso:

- Direttive frontend/design documentate per l'uso dei colori del logo.
- Regole minime di palette e utilizzo UI pronte per guidare i task frontend successivi.
- `frontend/AGENTS.md` aggiornato nel task dedicato futuro.

Completato:

- Analizzati tecnicamente i colori principali del logo HRM AI-first.
- Palette documentata in `frontend/AGENTS.md` con deep indigo, navy, accent blue, violet-blue e soft highlight tint.
- Regole minime definite per login, shell, header, sidebar, pulsanti, link, badge e stati UI.
- Confermato che l'applicazione delle direttive ai componenti resta fuori scope di TASK-038.
- Nessuna modifica a backend, codice frontend applicativo, routing, auth, login/logout, shell/header/sidebar/login UI o UI Master Data Admin.

Nota:

TASK-038 e documentale e non introduce redesign generale, nuove pagine, componenti shared o modifiche applicative.

### TASK-039 - Frontend sidebar navigation tree foundation

Stato: DONE

Tipo: Frontend foundation

Obiettivo:

- Introdurre una foundation per la navigazione sidebar ad albero, riusando la sidebar esistente senza introdurre nuove pagine funzionali obbligatorie.

Scope:

- Introdurre una struttura dati tipizzata per le voci sidebar.
- Supportare nodi fino a 3 livelli.
- Supportare apertura/chiusura nodi.
- Supportare evidenza active route.
- Aggiungere una piccola ricerca/filtro sul tree.
- Riutilizzare lo stile/sidebar esistente.
- Non creare nuove pagine funzionali obbligatorie.
- Non introdurre RBAC/permission filtering in questo task.
- Non introdurre i18n in questo task.
- Non introdurre nuove librerie.

Output atteso:

- Sidebar pronta a ospitare una navigazione gerarchica.
- Struttura menu tipizzata e locale al frontend.
- Interazione base di espansione/collasso e filtro disponibile.

Completato:

- `AppSidebarComponent` riusato come unica sidebar applicativa.
- Introdotta struttura dati tipizzata locale per la navigazione sidebar.
- Supportati nodi fino a 3 livelli tramite template Angular annidato.
- Introdotto stato locale di apertura/chiusura nodi con Angular signals.
- Evidenza active route collegata al router Angular per le route esistenti.
- Aggiunta ricerca/filtro locale sulle voci del tree.
- Aggiunto stato locale collassato/espanso per la sidebar con toggle visibile, navigazione top-level compatta e search/submenu nascosti in modalita collassata.
- Link navigante mantenuto solo per la route esistente `/`; le voci future restano placeholder non naviganti.
- Test frontend aggiunti per rendering tree e filtro.
- Build frontend e test frontend validati.

Nota:

TASK-039 non introduce nuove pagine funzionali, nuove route, RBAC/permission filtering, i18n, nuove librerie, backend, login/JWT changes o redesign generale.

### TASK-040 - Frontend i18n foundation

Stato: DONE

Tipo: Frontend foundation

Obiettivo:

- Definire e predisporre la strategia multilingua frontend senza introdurre refactor massivo o redesign UI.

Scope:

- Definire la strategia multilingua frontend.
- Valutare Angular built-in i18n vs libreria runtime come Transloco o ngx-translate.
- Predisporre lingua iniziale italiana.
- Prevedere estensione a francese e inglese.
- Estrarre progressivamente i testi statici principali della shell/login/sidebar/header.
- Prevedere selezione lingua futura, senza implementare necessariamente un language switcher completo se fuori scope.
- Non introdurre traduzioni dinamiche da backend in questo task.
- Non modificare flussi auth/JWT.
- Non fare redesign UI.
- Non introdurre refactor massivo.

Output atteso:

- Strategia i18n frontend documentata e implementata nel perimetro minimo approvato.
- Lingua italiana predisposta come baseline iniziale.
- Percorso chiaro per estendere il frontend a francese e inglese.

Completato:

- Introdotta foundation i18n runtime custom/minimale sotto `frontend/src/app/core/i18n/`.
- Definiti `LanguageCode`, lingua default `it`, dizionario typed con baseline italiana completa e fallback automatico su `it`.
- Aggiunto `I18nService` con signal per lingua corrente, metodo `t(key)`, persistenza in `localStorage` e sincronizzazione di `document.documentElement.lang`.
- Aggiornato `frontend/src/index.html` a `lang="it"`.
- Estratti i testi statici principali da login, header, sidebar, home, shared email/password fields e alert close.
- Aggiunto selettore lingua minimale nella card login con opzioni Italiano, Français ed English.
- Mantenuti invariati routing, auth/login/JWT, login/logout, layout, ricerca sidebar, expand/collapse, collapsed initials e placeholder disabled.
- Build frontend e test frontend validati.

Nota:

TASK-040 non introduce nuove dipendenze, `@angular/localize`, Transloco, ngx-translate, language switcher completo, nuove pagine funzionali, redesign, backend o modifiche ai flussi auth/JWT.

### TASK-041 - Implementare UI Master Data Admin foundation/list

Stato: DONE

Tipo: Frontend foundation/list

Obiettivo:

- Implementare la foundation UI e le viste lista della UI Master Data Admin usando API backend disponibili.
- Riusare layout, shell e componenti esistenti secondo `frontend/AGENTS.md`.
- Non implementare CRUD completo se le API write corrispondenti non sono disponibili.

Completato:

- Aggiunta route protetta `/master-data` sotto `AppShellComponent`.
- Attivata voce sidebar reale `Governance > Dati di base` con label i18n `nav.masterData`.
- Introdotta configurazione frontend delle categorie `Global`, `HR/business` e `Governance/security` con risorse read-only disponibili.
- Implementato `MasterDataService` con `HttpClient` per lettura dai tre gruppi endpoint backend gia disponibili.
- Implementato `MasterDataAdminComponent` standalone con select categoria, select entita, tabella read-only, loading state, error state, empty state e refresh manuale.
- Gestita visualizzazione safe di valori nested, boolean e date senza introdurre CRUD, filtri complessi, bulk action, import/export, RBAC UI o audit UI.
- Aggiornato i18n runtime per `it`, `fr` ed `en` con chiavi `nav.masterData`, `masterData.*` e `masterData.entities.*`.
- Aggiornati test frontend per sidebar e componente Master Data Admin.
- Validati `npm.cmd run build` e `npm.cmd test`.

Nota:

TASK-041 resta read-only. Nessuna modifica a backend, auth/login/JWT, dipendenze o redesign UI.

### TASK-042 - Seed/import dati globali iniziali

Stato: DONE

Tipo: Backend/data seed/documentazione

Obiettivo:

- Preparare il seed/import statico e idempotente dei dati globali iniziali necessari al bootstrap operativo.

Completato:

- `countries.default_currency_id` reso nullable.
- Fonte/licenza/mapping documentati in `docs/data-sources/global-master-data.md`.
- Seed statico e idempotente ISO 3166-1 alpha-2 completato con 249 Paesi/territori.
- Migration Flyway `V17__seed_iso3166_countries.sql` vendor-specific per PostgreSQL e H2.
- Test backend validati (`92` test, `0` failure, `0` errori).
- Dati globali seeded visibili nella UI `/master-data`.

Nota:

TASK-042 mantiene fuori scope CAP italiani, ZIP esteri, frontend e API esterne runtime.

### TASK-043 - Master Data API/UI pagination and generic filters

Stato: DONE

Tipo: Backend + Frontend foundation

Obiettivo:

- Aggiungere paginazione e filtro generico alle API e alla UI Master Data Admin prima di importare ulteriori dataset grandi o completare CRUD.

Scope:

- backend: paginazione sugli endpoint Master Data dove necessario
- backend: filtro generico testuale sui campi principali/campi visualizzati
- frontend: adeguare UI `/master-data` per usare paginazione
- frontend: aggiungere filtro generico sulle liste master data
- mantenere compatibilita con Global, HR/business e Governance/security
- test backend e frontend coerenti

Fuori scope:

- CRUD UI completo
- CAP italiani
- ZIP esteri
- redesign UI
- RBAC runtime
- export/import massivo

Completato:

- API Master Data paginate con query params `page`, `size`, `search`.
- Response wrapper unificata con `content`, `page`, `size`, `totalElements`, `totalPages`, `first`, `last`.
- UI `/master-data` aggiornata con filtro generico, debounce e paginazione precedente/successiva.
- Reset pagina su cambio filtro/categoria/entita e compatibilita mantenuta con Global, HR/business e Governance/security.
- Test backend validati: BUILD SUCCESS, 95 test, 0 failure, 0 errori.
- Test frontend validati: build OK, test OK con 27 test passed.
- QA manuale browser eseguito con successo su `/master-data` (lista Paesi, filtro, paginazione, refresh, cambio entita).

Nota:

TASK-043 mantiene fuori scope CRUD UI completo, CAP italiani, ZIP esteri, security/JWT e seed/migration TASK-042.

### TASK-044 - Import CAP italiani

Stato: DONE

Tipo: Backend/data import

Obiettivo:

- Preparare l'import statico e idempotente dei CAP italiani nella tabella `global_zip_codes`.

Scope:

- import CAP italiani nella tabella `global_zip_codes`
- solo Italia
- fonte/licenza da documentare
- import statico/idempotente
- nessun ZIP estero
- nessuna API esterna runtime
- nessun frontend

Completato:

- Generato dataset normalizzato `backend/src/main/resources/master-data/italy-zip-codes.csv` dai JSON sorgente acquistati con regole: `italy_cities.json` base anagrafica, `italy_cap.json` per CAP singolo/range e `italy_multicap.json` per esplosione CAP reali su comuni multi-CAP.
- Validato dataset con 8465 record CAP validi (5 cifre), deduplica su coppia `istat+cap` e gestione righe non importabili nel report.
- Implementato `ItalianZipCodeImportService` con import idempotente su `global_zip_codes` per `Country=IT`, senza CAP esteri e senza API runtime esterne.
- Aggiunto endpoint backend di analisi/import sotto path esistente `/api/master-data/global/zip-codes/import/italy`.
- Aggiunti report import (`rowsRead`, `totalValidSourceZipCodes`, `imported`, `updated`, `skipped`, `errors`, `errorDetails`) e test backend su validazione dataset, idempotenza import e casi invalid/duplicate.
- Regressione validata: backend test PASS (99 test), frontend build/test PASS (nessuna modifica frontend).

### TASK-045 - Shared Master Data table component

Stato: DONE

Tipo: Frontend refactoring dedicato (contenitore)

Obiettivo:

- Scomporre e realizzare in modo incrementale un componente tabellare shared per Master Data, mantenendo il primo rilascio read-only e senza redesign.

Regole funzionali del task:

- il primo rilascio del componente e read-only;
- i filtri restano fuori dal componente tabella e restano gestiti dalla pagina/container;
- editing inline/celle modificabili fuori scope;
- drag & drop colonne fuori scope;
- preferenze utente colonne fuori scope;
- nessuna modifica backend in questo task.

Subtask:
- 045.1 - Analisi e modello configurazione colonne Master Data
  - Stato: DONE
  - Scope:
    - definire interfacce/configurazioni per colonne dinamiche;
    - definire visibilita e ordine visuale colonne via configurazione (ordine di rendering, non sorting dei dati);
    - definire tipo dato e regole di allineamento automatico;
    - prevedere `width` / `minWidth` in configurazione colonna;
    - prevedere formattazione valore tramite tipo colonna o formatter configurabile;
    - prevedere eventuale colonna azioni opzionale per usi futuri, senza introdurre CRUD nel TASK-045;
    - mantenere `align` come override opzionale;
    - definire colonne standard opzionali (`code`, `active`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`) non obbligatorie e non auto-generate.
  - Fuori scope:
    - implementazione visuale del componente;
    - editing inline;
    - logica filtri nella tabella.
  - Acceptance criteria:
    - contratto di configurazione colonne documentato e coerente con le entita Master Data;
    - supporto esplicito a campi nested (esempio `country.code`);
    - regole di allineamento automatico definite;
    - le colonne standard opzionali si mostrano solo se configurate e disponibili nei dati.

- 045.2 - Creazione componente shared DataTable read-only
  - Stato: DONE
  - Scope:
    - creare il componente shared tabellare read-only;
    - rendering righe/colonne dinamiche;
    - supporto molte colonne e scroll orizzontale;
    - mantenere stile UI esistente senza redesign.
  - Fuori scope:
    - CRUD;
    - inline editing;
    - drag & drop colonne.
  - Acceptance criteria:
    - componente riusabile con colonne configurabili e campi nested;
    - nessuna regressione visiva principale rispetto alla pagina esistente.

- 045.3 - Stati UI e paginazione nel componente shared
  - Stato: DONE
  - Scope:
    - gestire loading, error, empty state nel componente;
    - integrare paginazione nel componente (rendering controlli + emissione eventi) mantenendo la logica dati esistente nel container.
  - Fuori scope:
    - spostare la logica filtri dentro la tabella;
    - persistenza preferenze utente;
    - spostare nel componente shared chiamate API, parametri `page/search` o orchestrazione dati.
  - Acceptance criteria:
    - stati UI funzionanti e coerenti con UX esistente;
    - paginazione funzionante senza regressioni.

- 045.4 - Integrazione della shared table nella pagina `/master-data`
  - Stato: DONE
  - Scope:
    - sostituire la tabella attuale con il componente shared;
    - mantenere comportamento esistente di categoria/entita/filtro/paginazione;
    - mantenere compatibilita con Global, HR/business, Governance/security.
  - Fuori scope:
    - redesign pagina;
    - estensioni funzionali non richieste.
  - Acceptance criteria:
    - pagina `/master-data` operativa con il nuovo componente;
    - filtri ancora gestiti dalla pagina/container.

- 045.5 - Test frontend e regressione Master Data UI
  - Stato: DONE
  - Scope:
    - aggiornare/aggiungere test su rendering colonne, visibilita e ordine;
    - test su stati UI e paginazione;
    - test integrazione su `/master-data`.
  - Acceptance criteria:
    - test frontend aggiornati e verdi;
    - nessuna nuova duplicazione tabellare nelle aree migrate.

- 045.6 - Documentazione tecnica e backlog futuro
  - Stato: DONE
  - Scope:
    - documentare debito tecnico residuo;
    - proporre task futuri separati per funzionalita volutamente fuori scope.
  - Acceptance criteria:
    - backlog futuro esplicito e separato per:
      - editing inline / CRUD dinamico;
      - drag & drop colonne;
      - preferenze utente colonne;
      - lookup/select dinamiche;
      - validazioni avanzate.

Acceptance criteria complessivi TASK-045:

- nessuna duplicazione nuova di tabelle Master Data;
- componente shared read-only o pattern configurabile documentato;
- filtri mantenuti fuori dal componente tabellare;
- build frontend OK;
- test frontend OK;
- manual validation UI richiesta se vengono toccate schermate.

Completato:

- Creato componente shared read-only `DataTableComponent` in `frontend/src/app/shared/components/data-table/`.
- Definito modello colonne configurabile con chiavi nested, visibilita, ordine visuale, `width` / `minWidth`, tipo colonna, allineamento automatico, override `align` e formatter opzionale.
- Supportati rendering righe generiche, colonne standard opzionali solo se configurate e presenti nei dati, molte colonne con scroll orizzontale, loading/error/empty state e paginazione tramite eventi.
- Integrata la tabella shared nella pagina `/master-data` mantenendo nel container selezione categoria/entita, filtro generico, debounce, page/search, refresh e chiamate API.
- Aggiunti test frontend per componente shared e mantenuti test di integrazione della pagina Master Data.
- Validazione frontend: `npm.cmd run build` OK, `npm.cmd test` OK (34 test passed).

### TASK-046 - Master Data CRUD standard foundation

Stato: IN_PROGRESS

Tipo: Frontend CRUD standard foundation (contenitore)

Obiettivo:

- Definire e implementare in modo incrementale uno standard CRUD frontend riutilizzabile per le Master Data, basato sul componente shared generico `DataTableComponent`.
- Mantenere configurabilita per entita diverse e usare le API CRUD backend gia esistenti dai TASK-030, TASK-031 e TASK-032.

Decisioni funzionali:

- Il CRUD non deve essere una patch specifica per una sola tabella.
- Il CRUD Master Data deve diventare uno standard riutilizzabile per le Master Data.
- La tabella resta read-only come rendering principale.
- Le azioni CRUD devono essere configurabili per entita.
- L'editing inline nelle celle resta fuori scope iniziale.
- Il pattern preferito e: `DataTableComponent` read-only, azioni riga e form/modal o pannello laterale per create/update.
- Le entita importate o globali possono avere CRUD limitato o restare read-only.
- Le entita tenant-scoped semplici possono essere candidate per CRUD completo.
- Non usare mock come sostituto delle API backend.
- Nessuna modifica backend prevista nel TASK-046, salvo bug bloccante documentato.
- Rispettare i18n `it` / `fr` / `en`.
- Nessun redesign UI.

Subtask:
- 046.1 - Master Data CRUD action foundation
  - Stato: DONE
  - Scope:
    - analizzare la pagina `/master-data` e il componente shared `DataTableComponent`;
    - definire configurazione frontend per abilitare/disabilitare azioni riga per entita;
    - estendere `DataTableComponent` con azioni configurabili e output evento verso il container;
    - mantenere read-only le entita non candidate al CRUD.
  - Acceptance criteria:
    - mappa entita/azioni documentata nel codice o nella configurazione frontend;
    - azioni visuali `edit` / `delete` presenti solo sulle entita candidate;
    - `DataTableComponent` resta generico e senza logica API Master Data;
    - build e test frontend OK.

- 046.2 - Master Data CRUD form foundation
  - Stato: DONE
  - Scope:
    - introdurre un componente form riusabile nella feature Master Data, guidato da metadata risorsa;
    - supportare modalita `create` / `edit` / `view` senza introdurre nuove API backend;
    - collegare azioni `Nuovo`, `Modifica` e `Visualizza` all'apertura del form foundation;
    - supportare campi base testuali, campo boolean, required validation, stato read-only e pulsanti `Salva` / `Annulla` / `Chiudi`.
  - Acceptance criteria:
    - form foundation configurabile per entita candidate (Department, JobTitle, ContractType, WorkMode);
    - nessuna mutazione backend introdotta, solo hook frontend di salvataggio per evoluzioni successive;
    - filtri, paginazione e tabella esistenti restano invariati;
    - build e test frontend OK.

- 046.3 - Master Data CRUD API integration foundation
  - Stato: DONE
  - Scope:
    - collegare la foundation CRUD form alle API CRUD backend esistenti dei TASK-030/TASK-031/TASK-032;
    - integrare create/update sulle prime entita semplici e a basso rischio;
    - mantenere fallback read-only sulle entita non ancora abilitate.
  - Completato:
    - esteso `MasterDataService` con chiamate HTTP reali `POST` / `PUT` senza introdurre nuove API backend;
    - integrato il salvataggio reale nel container `/master-data` riusando il form metadata-driven esistente;
    - abilitate create/update reali per le entita candidate semplici `Department`, `JobTitle`, `ContractType` e `WorkMode`;
    - riusato `tenantId` dell'utente autenticato per `create` e preservato il `tenantId` della riga in `edit/update`;
    - mantenuto il form aperto su errore con messaggio leggibile e dati preservati;
    - chiusura modal, refresh lista e feedback utente aggiunti su salvataggio riuscito;
    - mantenuti invariati filtro, paginazione, tabella shared, view read-only e entita non candidate.
  - Acceptance criteria:
    - chiamate API reali create/update introdotte senza nuove API;
    - comportamento read/list/filter/pagination esistente preservato.

- 046.4 - Master Data CRUD delete, confirmation and error handling foundation
  - Stato: DONE
  - Scope:
    - introdurre conferma esplicita per disattivazione logica;
    - applicare gestione errori coerente su azioni CRUD;
    - mantenere UX consistente con i pattern esistenti e i18n.
  - Completato:
    - esteso `MasterDataService` con chiamata HTTP reale `DELETE` verso gli endpoint backend esistenti, mantenendo la semantica backend di soft-delete;
    - collegata la row action `delete` del container `/master-data` alla disattivazione logica (`active=false`) gia prevista dai servizi Master Data;
    - introdotta conferma utente esplicita in modal locale con overlay, target record leggibile e annullamento sicuro;
    - aggiunti stato `deleting`, disabilitazione temporanea delle azioni e refresh lista coerente dopo successo;
    - rinominata la UX da `Elimina` a `Disattiva`, con feedback `Record disattivato correttamente`;
    - aggiunto mapping errori leggibile con fallback per `400/401/403/404/409/500` e chiavi i18n `it` / `fr` / `en`;
    - mantenuti invariati filtro, paginazione, colonna `active`, `DataTableComponent` shared e nessuna nuova libreria.
  - Limiti / follow-up:
    - la lista continua a mostrare anche record inattivi, coerentemente con le API attuali che non filtrano `active=true`;
    - filtro `Attivi` / `Inattivi` e azione `Riattiva` sono rimandati a task successivi dedicati.
  - Acceptance criteria:
    - disattivazione logica gestita con conferma e feedback utente coerente;
    - error handling CRUD consistente e verificabile.

- 046.5 - Master Data CRUD QA and stabilization
  - Stato: TODO
  - Scope:
    - regressione frontend su `/master-data` con CRUD foundation attiva;
    - stabilizzazione test, i18n e coerenza UX;
    - aggiornamento documentazione solo con esiti reali.
  - Acceptance criteria:
    - build frontend OK;
    - test frontend OK;
    - QA manuale documentato;
    - documentazione allineata con risultati QA reali.

Fuori scope:

- editing inline nelle celle;
- drag & drop colonne;
- preferenze utente colonne;
- lookup remoti complessi;
- validazioni avanzate cross-field;
- workflow approvativi;
- RBAC runtime UI;
- nuove API backend;
- redesign della pagina;
- modifica sidebar/header/shell;
- modifica login/JWT/security.

Acceptance criteria complessivi TASK-046:

- standard CRUD Master Data chiaro e riutilizzabile;
- CRUD configurabile per entita;
- uso delle API backend esistenti dei TASK-030, TASK-031 e TASK-032;
- `DataTableComponent` resta generico e non contiene logica API Master Data;
- primo pattern CRUD senza editing inline;
- i18n `it` / `fr` / `en` rispettato;
- nessun mock usato come sostituto dei contratti API backend;
- nessuna modifica backend salvo bug bloccante documentato.

### TASK-047 - Master Data physical delete for non-referenced records

Stato: IN_PROGRESS

Tipo: Backend + Frontend CRUD safety foundation

Obiettivo:

- Implementare cancellazione fisica reale dei Master Data solo per record non referenziati, mantenendo separata la disattivazione logica `active=false`.

Decisione funzionale:

- `Disattiva` resta soft-delete/logical delete tramite `active=false`.
- `Elimina` e una cancellazione fisica reale.
- La cancellazione fisica non sostituisce la disattivazione logica.
- La cancellazione fisica non deve essere usata per mascherare la presenza di record disattivati.
- I record referenziati da altre tabelle/processi non devono essere eliminabili.

Subtask:

- 047.1 - Master Data physical delete backend foundation
  - Stato: DONE
  - Scope:
    - introdurre endpoint/action backend separata per delete fisico;
    - mantenere invariata la disattivazione logica `active=false`;
    - verificare record referenziati tramite controlli FK preventivi dove coerenti oppure gestione controllata di `DataIntegrityViolationException`;
    - restituire errore coerente, preferibilmente `409 Conflict`, quando il record e collegato ad altri dati;
    - non usare `repository.delete()` per sostituire i metodi di disattivazione esistenti.
  - Completato:
    - endpoint backend separati `DELETE /api/master-data/hr-business/{resource}/{id}/physical` per `departments`, `job-titles`, `contract-types` e `work-modes`;
    - disattivazione logica esistente mantenuta invariata sui `DELETE /{id}` gia presenti;
    - controlli applicativi espliciti su referenze semantiche `Employee` per `Department`, `JobTitle`, `ContractType` e `WorkMode`;
    - safety net su `DataIntegrityViolationException` tradotta in `409 Conflict`;
    - test MockMvc/OpenAPI/backend aggiornati e `mvnw.cmd test` validato con esito reale.
  - Acceptance criteria:
    - delete fisico rimuove realmente solo record non referenziati;
    - record referenziati non vengono rimossi e producono errore leggibile;
    - test backend coprono successo e blocco su record referenziati dove riproducibile.

- 047.2 - Master Data physical delete frontend action
  - Stato: DONE
  - Scope:
    - aggiungere in UI azione separata `Elimina`, distinta da `Disattiva`;
    - usare conferma forte prima della cancellazione fisica;
    - mostrare messaggio chiaro: `Il record non puo essere eliminato perche e collegato ad altri dati`;
    - aggiornare messaggi i18n `it` / `fr` / `en`;
    - aggiornare lista solo dopo successo reale del backend.
  - Completato:
    - aggiunta azione riga `Elimina` alle entità HR/business candidate (`departments`, `job-titles`, `contract-types`, `work-modes`);
    - introdotta conferma esplicita con messaggio specifico e stato `deleting`;
    - integrata chiamata API `DELETE /{id}/physical` e reload pagina corrente coerente con successo;
    - gestione `409` con errore leggibile e messaggio i18n coerente in `it` / `fr` / `en`;
    - aggiornamento test frontend per conferma/successo/errore/aggiornamento pagina.
  - Acceptance criteria:
    - `Disattiva` ed `Elimina` sono azioni visivamente e funzionalmente distinte;
    - la UI non nasconde record per simulare delete fisico;
    - test frontend coprono conferma, successo, errore `409` e refresh lista.

- 047.3 - Master Data physical delete QA and hardening
  - Stato: DONE
  - Scope:
    - regressione backend/frontend su `/master-data`;
    - verifica manuale di record eliminabile e record referenziato;
    - verifica che disattivazione logica, create/edit/view, filtro e paginazione non regrediscano;
    - aggiornamento documentazione e report QA solo con esiti reali.
  - Completato:
    - chiusura QA/hardening registrata per il flusso di cancellazione fisica Master Data;
    - mantenuta separazione tra `Disattiva` e `Elimina`;
    - confermato che i riferimenti QA documentati disponibili restano quelli gia presenti per TASK-047.1 e per le verifiche Master Data precedenti;
    - nessun aggiornamento a `docs/qa/QA-REPORTS.md` in assenza di un nuovo report QA dedicato da registrare.
  - Acceptance criteria:
    - test backend OK;
    - build/test frontend OK;
    - QA manuale documentato;
    - `docs/qa/QA-REPORTS.md` aggiornato solo se QA reale eseguito.

Scope complessivo TASK-047:

- backend endpoint/action separata per delete fisico;
- controlli FK preventivi dove coerenti oppure gestione controllata di `DataIntegrityViolationException`;
- risposta coerente per record referenziati, preferibilmente `409 Conflict`;
- UI con azione separata `Elimina`;
- conferma forte prima della cancellazione fisica;
- messaggio utente chiaro: `Il record non puo essere eliminato perche e collegato ad altri dati`;
- messaggi i18n `it` / `fr` / `en`;
- test backend e frontend;
- QA manuale su `/master-data`.

Fuori scope:

- sostituire o rimuovere la disattivazione logica;
- usare `active=false` come simulazione della cancellazione fisica;
- nascondere record via filtro frontend per simulare delete;
- introdurre RBAC runtime;
- redesign UI;
- cancellazione fisica di record referenziati.

Acceptance criteria:

- `Disattiva` e `Elimina` sono azioni distinte;
- delete fisico rimuove realmente solo record non referenziati;
- record referenziati producono errore leggibile e non vengono rimossi;
- backend non restituisce falso successo quando il record resta in database;
- UI aggiorna la lista dopo successo reale;
- test backend/frontend coprono successo e blocco su record referenziati dove riproducibile.

### TASK-048 - HRflow design system and validated UI templates

Stato: DONE

Scope:

- trasformare TASK-048 in iniziativa generale di design system e template UI HRflow;
- usare Master Data solo come prima applicazione concreta/caso pilota;
- basare i refinement successivi sul catalogo di template UI validato in TASK-048.2;
- mantenere `docs/design/DESIGN-SYSTEM.md` come fonte documentale del catalogo e delle regole UI;
- applicare i template in modo incrementale, senza redesign massivo non autorizzato;
- evitare lavoro doppio sui prossimi task CRUD e amministrativi;
- mantenere coerenza con le regole gia presenti in `frontend/AGENTS.md`.

Acceptance criteria:

- TASK-048 non e piu limitato al solo perimetro Master Data;
- i sottotask TASK-048.3..TASK-048.16 sono allineati ai template UI validati e alla governance frontend collegata;
- i template approvati, extra e futuri sono distinti nei task operativi;
- nessuna modifica Angular/backend prevista nel solo riallineamento documentale;
- non modificare frontend, backend o QA report;
- conferma che TASKS.md e ROADMAP.md sono coerenti.

### TASK-048.1 - Master Data design refinement preparation

Stato: DONE

Tipo: Documentazione / design preparation

Scope:

- analizzare lo stato attuale della UI Master Data;
- identificare schermate, tabelle e popup esistenti;
- definire quali screenshot servono;
- definire quali mockup generare con Google Stitch;
- preparare prompt Stitch mirati per tabella, popup CRUD e conferme delete/deactivate;
- creare il documento preparatorio `docs/design/DESIGN-SYSTEM.md`;
- non modificare codice frontend/backend.

Completato:

- analizzato lo stato attuale della UI Master Data, inclusi tabella condivisa, colonne, row actions, filtri, paginazione, stati loading/error/empty, form modal e conferme delete/deactivate;
- verificato che `frontend/agent.md` non esiste e che le regole frontend/design vigenti sono in `frontend/AGENTS.md`;
- creato `docs/design/DESIGN-SYSTEM.md` come documento draft preparatorio per Master Data table e pop-up CRUD;
- documentato il processo di integrazione mockup Stitch come screenshot/codice -> analisi -> regole riusabili -> applicazione incrementale;
- nessuna modifica a codice frontend, backend, API o QA report.

Acceptance criteria:

- elenco schermate/popup da fotografare o generare;
- elenco mockup Stitch richiesti;
- prompt Stitch documentati;
- nessuna modifica frontend/backend;
- documento design system preparatorio creato.

### TASK-048.2 - Validated UI template catalog from Stitch

Stato: DONE

Scope:

- raccogliere screenshot o codice generato da Google Stitch;
- validare un catalogo astratto di template UI HRflow;
- distinguere template approvati come riferimento, template extra da valutare e pattern avanzati futuri;
- documentare i template validati in `docs/design/DESIGN-SYSTEM.md`;
- ignorare gli screenshot Stitch locali dal versionamento;
- evitare applicazione diretta del codice Stitch senza revisione;
- non modificare codice Angular o backend.

Acceptance criteria:

- catalogo TEMPLATE-01..TEMPLATE-11 validato e documentato;
- template approvati, extra e futuri classificati;
- `docs/design/DESIGN-SYSTEM.md` aggiornato con il catalogo astratto;
- screenshot Stitch locali non versionati;
- nessuna modifica Angular/backend.

Completato:

- validato il catalogo astratto di template UI HRflow generato da Stitch;
- template documentati in `docs/design/DESIGN-SYSTEM.md`;
- screenshot Stitch locali esclusi dal versionamento;
- nessuna modifica Angular/backend.

### TASK-048.3 - Reframe TASK-048 subtasks around validated UI templates

Stato: DONE

Scope:

Completato:

- riallineati i sottotask TASK-048.4..TASK-048.16 al catalogo template UI validato e alla governance frontend collegata;
- TASK-048 ridefinito come iniziativa generale HRflow design system/template UI;
- Master Data mantenuto solo come caso pilota;
- ROADMAP.md aggiornato con nuova sequenza e prossimo step;
- nessuna modifica Angular/backend.

Acceptance criteria:

- TASK-048.4..TASK-048.16 definiti in base ai template validati e alla governance frontend collegata;
- TASK-048.1 e TASK-048.2 mantenuti come DONE;
- ROADMAP.md allineato al nuovo prossimo passo TASK-048.3;
- nessuna modifica Angular/backend.

### TASK-048.4 - Data list and Generic DataTable refinement

Stato: DONE

Template:

- TEMPLATE-01 Data list page;
- TEMPLATE-03 Table states;
- TEMPLATE-10 Generic DataTable.

Scope:

- rifinire pagina lista standard con titolo, toolbar, filtri, tabella e paginazione;
- rifinire tabella gestionale standard;
- rifinire stati loading, empty, error e no results;
- applicare le regole in modo incrementale, partendo dai componenti esistenti;
- riusare componenti esistenti;
- evitare duplicazione di componenti tabellari.

Acceptance criteria:

- pagina lista coerente con TEMPLATE-01;
- stati tabella coerenti con TEMPLATE-03;
- DataTable coerente con TEMPLATE-10;
- nessun testo hardcoded;
- nessuna duplicazione di componenti tabellari;
- build frontend OK;
- test frontend eseguiti se presenti/applicabili.

Completato:

- riusato e rifinito il componente shared `DataTableComponent`, senza creare DataTable parallele;
- applicato TEMPLATE-01 al pattern pagina lista `/master-data` con header, toolbar, azioni principali, filtri, ricerca e card lista;
- applicato TEMPLATE-03 agli stati tabella loading, empty, error e no results;
- applicato TEMPLATE-10 alla tabella gestionale shared, con paginazione/footer e azioni riga mantenute nel componente generico;
- introdotte chiavi i18n generiche `dataTable.*` e nuove label Master Data in `it` / `fr` / `en`;
- mantenute invariate API backend, security/auth, routing e logiche CRUD;
- build frontend OK;
- test frontend OK.

### TASK-048.5 - CRUD modal and action confirmation refinement

Stato: DONE

Template:

- TEMPLATE-04 CRUD modal form;
- TEMPLATE-05 Action confirmation dialogs.

Scope:

- rifinire modali create, edit e view read-only;
- rifinire conferme azioni normali, warning, destructive e irreversibili;
- separare pattern form da pattern conferma;
- mantenere coerenza i18n;
- evitare applicazione diretta del codice Stitch senza revisione.

Acceptance criteria:

- modali CRUD coerenti con TEMPLATE-04;
- conferme azione coerenti con TEMPLATE-05;
- regola UX confermata: non usare insieme "Annulla" e "Chiudi" nella bottom action bar quando hanno la stessa funzione;
- nessun testo hardcoded;
- nessuna modifica funzionale non autorizzata.

Completato:

- standardizzato il footer modal su `/master-data` con separazione visiva dal body, allineamento a destra e spacing coerente;
- introdotto pattern minimo condiviso `kt-modal-footer` + `kt-modal-footer-actions` sopra la base visuale `kt-btn`;
- modali CRUD aggiornate: in `create/edit` il footer espone solo `Annulla` secondario e `Salva` primario; in `view` espone un solo `Chiudi`;
- confirmation dialog aggiornato con ordine coerente `Annulla` secondario + azione destructive;
- riallineato il pattern visuale al mockup HTML validato: modal CRUD compatta, footer piu arioso, cancel outline e pulsanti con larghezza minima coerente;
- mantenuti `app-button`, stati `disabled/loading`, tipi `button/submit` corretti, nessun testo hardcoded e nessuna modifica backend.

### TASK-048.6 - Buttons and toast feedback refinement

Stato: DONE

Template:

- TEMPLATE-07 Toast notifications;
- TEMPLATE-11 Buttons.

Scope:

- standardizzare pulsanti primari, secondari, outline e destructive;
- standardizzare feedback toast success, error, warning e info;
- consolidare i toast come pattern shared riusabile;
- riusare o raffinare AlertMessageComponent come componente visuale shared per i feedback;
- introdurre o consolidare un servizio shared di notification/toast, se non già presente;
- permettere l’invocazione centralizzata dei toast tramite metodi success, error, warning e info;
- integrare i toast solo nei flussi reali già esistenti, ad esempio create/edit/save se già disponibili;
- non simulare toast su CRUD o azioni non ancora implementate;
- mantenere coerenza tra azioni inline, toolbar e modali;
- verificare naming, priorità visiva e stati interattivi;
- rispettare i18n;
- non introdurre nuove librerie UI;
- non modificare backend/API.


Acceptance criteria:

- pulsanti coerenti con TEMPLATE-11;
- toast coerenti con TEMPLATE-07;
- azioni destructive distinguibili dalle azioni standard;
- nessun testo hardcoded;
- nessuna nuova libreria UI introdotta.

Completato:

- raffinato `AlertMessageComponent` come componente visuale shared per feedback toast success, error, warning e info secondo TEMPLATE-07;
- introdotto `NotificationService` e `NotificationHostComponent` come punto di integrazione shared per invocazioni centralizzate `success`, `error`, `warning`, `info`;
- standardizzati pulsanti primari, secondary/outline e destructive via stili globali `kt-btn`;
- aggiunte icone Keenicons confermate per azioni principali Master Data e form, senza introdurre nuove librerie;
- aggiunte chiavi i18n `it/fr/en` per titoli e messaggi toast;
- inserito host notifiche nell'`App` per rendere i feedback globali e non legati ai singoli template;
- build frontend OK;
- test frontend OK (toast service/host verificabili dai test aggiornati su `master-data-admin` e `login`).

### TASK-048.7 - Shared list buttons pattern foundation

Stato: DONE

Template:

- TEMPLATE-11 Buttons.

Scope:

- introdurre una foundation minima condivisa per pulsanti di pagina lista;
- supportare varianti coerenti con `TEMPLATE-11` (primary, secondary, outline, ghost, destructive dove già necessario);
- applicare lo standard a toolbar, paginazione e azioni inline su `/master-data`;
- evitare duplicazioni HTML/CSS locali e preferire riuso di `kt-btn`;
- confermare piena compatibilità con stati disabled/loading e i18n.

Acceptance criteria:

- pulizia visuale e gerarchia coerente tra pulsanti su list page;
- varianti `primary`, `secondary`/`outline`, `ghost`, `destructive` applicate con ruoli coerenti;
- nessuna libreria UI nuova introdotta;
- nessuna modifica backend/API;
- nessun testo hardcoded.

Completato:

- introdotte varianti condivise `kt-btn-secondary`, `kt-btn-ghost`, `kt-btn-icon`, `kt-btn-list-action` in `styles.scss`;
- creato wrapper Angular shared `app-button` sopra il pattern `kt-btn`, con supporto minimo a `variant`, `size`, `type`, `disabled`, `loading`, `icon`, `iconOnly` e `ariaLabel`;
- applicato pattern condiviso su `/master-data` (toolbar, modal/form actions, azioni inline riga, paginazione);
- consolidati classi locale in componenti lista con varianti semantiche (`primary`, `secondary`, `ghost`, `destructive`);
- eliminata sovrapposizione visiva duplicata (`master-data-danger-button`) nel CSS di pagina;
- coerenza con `TEMPLATE-11` mantenuta e nessun cambio backend/API/librerie;
- test build/frontend rieseguiti dopo la patch del wrapper Angular shared.

### TASK-048.8 - Login visual alignment review

Stato: DONE

Template:

- TEMPLATE-06 Login page.

Scope:

- verificare l'allineamento visuale della pagina login rispetto al template validato;
- consolidare gerarchia di titolo, campi, CTA e feedback in stato idle/loading/error;
- mantenere coerenza con foundation autenticazione esistente e i18n `it/fr/en`;
- non introdurre nuove librerie UI e non cambiare logica funzionale login.

Acceptance criteria:

- layout login coerente con TEMPLATE-06 senza redesign massivo;
- stati visuali principali login documentati/validati;
- nessuna modifica backend/API;
- nessun testo hardcoded.

Completato:

- riallineata la gerarchia visuale login rispetto a TEMPLATE-06: selettore lingua in alto a destra, logo con tagline sopra la card, titolo + testo introduttivo nella card;
- seconda iterazione visuale completata con card piu compatta, padding interno coerente col template, brand cluster piu equilibrato, selettore lingua integrato e CTA full-width piu evidente;
- refinement finale completato con link visuale `Password dimenticata?`, footer legale i18n e selettore lingua ripulito dall'icona decorativa non necessaria;
- rifinite spaziature, posizione verticale del blocco login e responsive mobile/tablet senza redesign massivo;
- consolidati stati visuali principali senza cambiare logica: CTA con `disabled`/`aria-busy` in loading, errori campo condivisi e toast credenziali errate invariati;
- mantenuti componenti shared esistenti (`app-email-field`, `app-password-field`), i18n `it/fr/en`, nessuna modifica backend/API o dipendenze.

### TASK-048.9 - Configure Angular AI skills and project agent integration

Stato: DONE

Tipo: Documentazione / AI governance / frontend Angular

Template:

- nessun template UI applicativo.

Contesto:

- la skill Angular ufficiale `angular-developer` puo essere installata o gestita manualmente tramite `npx skills add https://github.com/angular/skills --skill angular-developer`;
- la skill `angular-new-app` non deve essere usata in questo progetto, perche il frontend Angular esiste gia;
- la skill deve supportare gli agenti AI/Codex senza sostituire la governance del repository;
- la skill approvata deve essere integrata anche in forma repository-local e versionata nel repo.

Scope:

- documentare l'uso della skill Angular `angular-developer`;
- includere integrazione repository-local della skill approvata sotto `.agents/skills/angular-developer`;
- includere `skills-lock.json` come tracciamento della skill approvata e del relativo lock;
- chiarire quando deve essere considerata dagli agenti AI/Codex per task Angular;
- collegarla alle regole frontend esistenti in `frontend/AGENTS.md`;
- collegarla alla governance prompt Codex in `docs/ai-prompts/codex-prompt-governance.md`;
- chiarire che la skill e complementare, non sostitutiva, rispetto a `AGENTS.md`, `frontend/AGENTS.md`, `TASKS.md`, `ROADMAP.md`, `DECISIONS.md` e `docs/design/DESIGN-SYSTEM.md`;
- documentare uso per componenti, servizi, routing, forms, accessibilita, testing, styling e best practice frontend;
- documentare regole operative su Plan mode e IDE context;
- evitare modifiche codice applicativo, backend/API, package, dipendenze o configurazioni build.

Acceptance criteria:

- TASK-048.9 presente in `TASKS.md`;
- task successivi TASK-048.x rinumerati in modo coerente;
- `ROADMAP.md` coerente con la nuova sequenza TASK-048;
- governance Codex aggiornata con uso della skill Angular `angular-developer`;
- `angular-new-app` esclusa esplicitamente dal progetto;
- `.agents/` e `skills-lock.json` presenti e inclusi nel perimetro TASK-048.9 come asset repository-local della skill approvata;
- chiaro che `skills-lock.json` traccia la skill approvata corrente;
- Plan mode documentato per analisi iniziale senza modifiche file;
- IDE context documentato come fonte da verificare insieme al prompt;
- collegamento chiaro tra Angular skill, `AGENTS.md`, `frontend/AGENTS.md`, i18n, design system, testing e regole frontend;
- nessuna modifica applicativa;
- nessuna modifica backend/API;
- nessuna nuova dipendenza.

Completato:

- documentata la governance della skill Angular `angular-developer` come supporto complementare alle regole repository;
- integrata la skill repository-local sotto `.agents/skills/angular-developer`;
- incluso `skills-lock.json` come riferimento lock della skill approvata;
- esclusa esplicitamente la skill `angular-new-app` perche il frontend Angular esiste gia;
- aggiornati governance prompt, `AGENTS.md`, `frontend/AGENTS.md` e `DECISIONS.md`;
- nessuna modifica applicativa, backend/API, package o dipendenze.

### TASK-048.10 - Shell navigation visual review

Stato: DONE

Template:

- TEMPLATE-08 Sidebar;
- TEMPLATE-09 Header / topbar.

Scope:

- valutare sidebar, header e topbar come riferimenti extra;
- verificare coerenza con navigazione esistente;
- decidere se e quando applicare i pattern extra;
- documentare che la sidebar verra riallineata al mockup TEMPLATE-08 in un task dedicato successivo;
- non applicare modifiche concrete alla sidebar, all'header/topbar o alla shell in questo task;
- non modificare componenti Angular.

Acceptance criteria:

- TEMPLATE-08 e TEMPLATE-09 valutati come extra;
- decisioni documentate prima di qualunque applicazione;
- nessun redesign della shell non autorizzato;
- nessuna modifica applicativa Angular/backend/API.

Completato:

- valutato TEMPLATE-08 come riferimento visuale futuro per la sidebar esistente;
- valutato TEMPLATE-09 come riferimento extra futuro per header/topbar, senza applicazione concreta in questo task;
- confermato che il riallineamento visuale della sidebar va trattato in TASK-048.11 dedicato;
- nessuna modifica Angular, backend/API, package o librerie.

### TASK-048.11 - Sidebar visual alignment to TEMPLATE-08

Stato: DONE

Template:

- TEMPLATE-08 Sidebar.

Scope:

- applicare alla sidebar esistente il riferimento visuale del mockup TEMPLATE-08;
- preservare routing, i18n, ricerca, collapse desktop, toggle mobile e stato active;
- mantenere il componente sidebar esistente senza creare una shell parallela;
- non toccare header/topbar;
- non fare redesign globale della shell;
- non introdurre nuove librerie UI;
- non modificare backend/API.

Acceptance criteria:

- sidebar allineata visualmente a TEMPLATE-08 in modo compatibile con Angular, Metronic-adapted patterns e `kt-*`;
- routing, i18n, ricerca, collapse desktop, toggle mobile e stato active preservati;
- header/topbar non modificati;
- nessuna nuova libreria UI introdotta;
- build frontend OK;
- test frontend OK.

Completato:

- riallineata la sidebar esistente a TEMPLATE-08 senza creare una shell parallela;
- introdotta resa visuale navy con gerarchia piu marcata per top-level items, stato active a pill primaria e stato branch-active piu morbido;
- raffinati submenu tree, contrasti secondari, arrows, densita verticale, search box e scrollbar con patch locale solo visuale;
- completato un ulteriore refinement di densita enterprise e scrolling: eliminato overflow orizzontale, resa scrollabile internamente l'area menu, compattati item/search/header e reso il submenu active meno massiccio;
- completato l'allineamento finale: active state parent/submenu non aderenti al bordo destro e search box centrata verticalmente nella propria sezione;
- mantenuti routing Angular, i18n, ricerca locale, collapse desktop ed header/topbar invariati;
- aggiunti test sidebar sul mantenimento dell'highlight della route attiva;
- build frontend OK;
- test frontend OK.

### TASK-048.12 - CRUD modal and form visual refinement

Stato: DONE

Template:

- TEMPLATE-04 CRUD modal form.

Scope:

- migliorare popup CRUD e form esistenti;
- riallineare a TEMPLATE-04 CRUD modal form;
- considerare anche conferme azione se ancora collegate al vecchio TASK-048.5;
- migliorare header modal, body, footer, spacing, input, checkbox, focus state e responsive;
- non creare ancora shared modal framework;
- non creare ancora shared form framework;
- non anticipare TASK-048.15;
- non modificare backend/API;
- non introdurre nuove librerie UI.

Acceptance criteria:

- popup CRUD piu coerente con TEMPLATE-04;
- form piu leggibili e compatti;
- footer actions coerenti;
- checkbox/input migliorati senza framework shared prematuro;
- responsive verificato;
- build frontend OK;
- test frontend OK.

Completato:

- rimossa la duplicazione di `Chiudi` dal footer della CRUD modal Master Data, mantenendo la chiusura nell'header;
- riallineato il footer azioni con `Annulla` secondaria e `Salva` primaria allineate a destra;
- migliorati spacing di header/body/footer e stile locale della checkbox `Attivo`, senza introdurre shared modal/form framework e senza modifiche backend/API.

### TASK-048.13 - Header/topbar visual alignment to TEMPLATE-09

Stato: DONE

Template:

- TEMPLATE-09 Header / topbar.

Scope:

- migliorare header/topbar esistente secondo TEMPLATE-09;
- rendere header piu compatta;
- migliorare allineamento verticale titolo, icone, avatar/user menu;
- migliorare separazione header/contenuto;
- migliorare hover/focus area utente;
- verificare responsive mobile;
- mantenere coerenza visuale con la sidebar rifinita;
- non modificare sidebar;
- non modificare backend/API;
- non introdurre nuove librerie UI.

Acceptance criteria:

- header/topbar allineata a TEMPLATE-09;
- contenuti centrati verticalmente;
- area utente/avatar piu pulita;
- responsive verificato;
- sidebar non modificata;
- build frontend OK;
- test frontend OK.

Completato:

- rimosso il quadratino sinistro non funzionale dalla topbar;
- sostituito “Area riservata” con titolo pagina corrente contestuale (i18n);
- introdotta area centrale con titolo pagina per bilanciare la header;
- alleggerito menu utente/hover/focus e separazione header/contenuto;
- mantenuta coerenza con sidebar/template esistente e senza modifiche backend/API.

### TASK-048.14 - Spreadsheet-style bulk editor planning

Stato: TODO

Template:

- TEMPLATE-02 Spreadsheet-style bulk editor.

Scope:

- analizzare il pattern avanzato futuro di inserimento/modifica massiva stile Excel;
- identificare casi d'uso candidati;
- valutare impatti su validazione, i18n, accessibilita e performance;
- non implementare il componente in questo task.

Acceptance criteria:

- TEMPLATE-02 analizzato come pattern futuro;
- casi d'uso candidati documentati;
- rischi e prerequisiti identificati;
- nessuna implementazione frontend/backend.

### TASK-048.15 - Shared form controls and form patterns foundation

Stato: TODO

Tipo: Design system / frontend foundation

Contesto:

- durante TASK-048.5 e emerso che il checkbox della modale CRUD Master Data usa ancora uno stile troppo vicino al browser-default;
- il fix definitivo va pianificato come foundation progressiva dei form controls, non come intervento isolato.

Scope:

- censire le tipologie di form control gia presenti o previste:
  - text input;
  - textarea;
  - select;
  - checkbox;
  - radio;
  - switch/toggle;
  - date input/date picker placeholder;
  - number input;
  - search/filter input;
  - validation/error/help text;
- definire pattern condivisi coerenti con HRflow, Metronic e design system;
- valutare componenti shared Angular dove utile, iniziando dai controlli piu riusabili;
- creare almeno la foundation per `app-checkbox`, se coerente con l'analisi;
- integrare il primo controllo condiviso in un punto sicuro, preferibilmente CRUD modal Master Data;
- non introdurre nuove librerie UI;
- non cambiare logica funzionale dei form;
- rispettare i18n e accessibilita;
- aggiornare `docs/design/DESIGN-SYSTEM.md` se vengono formalizzate regole durevoli.

Acceptance criteria:

- elenco controlli form censito;
- regole base form controls documentate;
- almeno un controllo shared candidato/implementato oppure motivazione documentata se rimandato;
- checkbox Master Data non piu browser-default, se incluso nello scope implementativo;
- build frontend OK;
- test frontend OK;
- TASKS.md e ROADMAP.md aggiornati.

### TASK-048.16 - Global typography foundation

Stato: TODO

Tipo: Design system / frontend foundation

Scope:

- analizzare font attuale dell'app e font ereditati da Metronic;
- confrontare la tipografia attuale con i mockup UI validati;
- decidere se introdurre Inter, Manrope o altro font globale;
- preferire asset locali se si decide di introdurre nuovi font;
- centralizzare font family, pesi, dimensioni base e gerarchie tipografiche;
- aggiornare `docs/design/DESIGN-SYSTEM.md` con regole tipografiche definitive;
- applicare la scelta globalmente, evitando override locali non necessari;
- verificare impatto su pagine esistenti e componenti shared.

Acceptance criteria:

- scelta tipografica documentata;
- font globale centralizzato;
- nessun import/font duplicato nei componenti;
- `docs/design/DESIGN-SYSTEM.md` aggiornato;
- build frontend OK;
- test frontend eseguiti se presenti/applicabili;
- validazione manuale UI base eseguita o dichiarata non eseguita.

### TASK-049 - Platform Super Admin and tenant-aware permissions model

Stato: TODO

Tipo: Governance / RBAC strategy

Obiettivo:

- Definire il modello strategico di autorizzazione tenant-aware prima delle implementazioni CRUD backend reali e della gestione utenti avanzata.

Scope:

- definizione ruolo globale `PLATFORM_SUPER_ADMIN`;
- distinzione esplicita da `TENANT_ADMIN`;
- ruoli base seed non eliminabili;
- ruoli custom tenant-specific;
- permessi CRUD per Global Master Data;
- permessi CRUD per Tenant Master Data;
- regole cross-tenant;
- impatto su backend security e frontend visibility;
- aggiornamento documentale di eventuali decisioni durevoli (`DECISIONS.md`) se approvate.

Fuori scope:

- implementazione CRUD backend reale;
- UI completa di amministrazione utenti/ruoli.

### TASK-050 - User, Role and Permission domain review

Stato: TODO

Tipo: Analisi dominio backend/API

Obiettivo:

- Analizzare il dominio gia presente per utenti, ruoli e permessi e identificare i gap rispetto al modello definito in TASK-049.

Scope:

- review entity/backend esistenti;
- review DTO/API esistenti;
- review seed/ruoli iniziali;
- identificazione gap;
- proposta backlog tecnico minimale per colmare i gap.

Fuori scope:

- implementazione UI completa;
- enforcement permessi runtime.

### TASK-051 - Permission model foundation by scope/resource/action

Stato: TODO

Tipo: Foundation authorization model

Obiettivo:

- Definire o introdurre una foundation permessi semplice ma scalabile, con formato stabile e leggibile.

Modello iniziale:

- scope: `PLATFORM` / `TENANT`
- resource: `TENANT`, `USER`, `ROLE`, `PERMISSION`, `MASTER_DATA`, `EMPLOYEE`, `CONTRACT`, `DEVICE`, `PAYROLL_DOCUMENT`, `LEAVE_REQUEST`
- action: `READ`, `CREATE`, `UPDATE`, `DELETE`, `MANAGE`

Esempi:

- `PLATFORM.TENANT.MANAGE`
- `TENANT.USER.READ`
- `TENANT.USER.MANAGE`
- `TENANT.MASTER_DATA.READ`
- `TENANT.MASTER_DATA.MANAGE`

Note:

- il frontend usa il modello per visibilita UX (menu/pagine/azioni);
- il backend usa il modello per enforcement reale delle API;
- modello iniziale per modulo/risorsa, senza granularita immediata per singola entita Master Data (es. `TENANT.MASTER_DATA.WORK_MODE.CREATE`).

### TASK-052 - Tenant user and role administration foundation

Stato: TODO

Tipo: Frontend + backend foundation

Obiettivo:

- Preparare la base di gestione utenti e ruoli per tenant.

Scope:

- UI foundation per elenco utenti/ruoli;
- assegnazione ruoli;
- distinzione vista platform e vista tenant;
- nessuna gestione avanzata permessi per singola entita.

Fuori scope:

- policy autorizzative granulari per singola entita;
- enforcement backend completo (demandato a TASK-054).

### TASK-053 - Apply permissions to frontend navigation and actions

Stato: TODO

Tipo: Frontend authorization UX

Obiettivo:

- Applicare i permessi lato frontend per menu, pagine e azioni.

Scope:

- nascondere/disabilitare voci menu non autorizzate;
- controllare visibilita/accesso pagine in base ai permessi disponibili;
- nascondere/disabilitare pulsanti CRUD;
- usare permessi disponibili dall'utente autenticato;
- mantenere chiaro che il frontend e solo UX, non sicurezza reale.

### TASK-054 - Apply permissions to backend API authorization

Stato: TODO

Tipo: Backend authorization enforcement

Obiettivo:

- Applicare i permessi lato backend alle API.

Scope:

- protezione endpoint;
- controllo permessi per azioni CRUD;
- rifiuto richieste non autorizzate anche se inviate manualmente;
- nessuna fiducia nel solo frontend.

Nota di sicurezza:

- il backend resta il punto di enforcement reale; il frontend non sostituisce mai i controlli API.

### TASK-055 - Implementare UI Employee management enterprise

Stato: TODO

### TASK-056 - Implementare Security Admin UI

Stato: TODO

Include:

- utenti
- MFA
- tenant access
- ruoli
- permessi

### TASK-057 - Implementare UI Device governance

Stato: TODO

### TASK-058 - Implementare UI PayrollDocument

Stato: TODO

### TASK-059 - Implementare UI LeaveRequest

Stato: TODO

### TASK-060 - Implementare UI HolidayCalendar

Stato: TODO

### TASK-061 - Implementare Audit UI / compliance explorer

Stato: TODO

### TASK-062 - Implementare UI disciplinary governance

Stato: TODO

## FASE 2G - PLATFORM OPERATIONS

### TASK-063 - Implementare Platform Operator / Super Admin governance

Stato: TODO

### TASK-064 - Implementare Cross-tenant admin UI

Stato: TODO

## FASE 3 - STABILIZATION

### TASK-065 - Configurare logging, monitoring e observability enterprise

Stato: TODO

### TASK-066 - Test integrato MVP enterprise completo

Stato: TODO

---

## 6. Cronologia versioni

| Versione | Data | Descrizione |
|---|---|---|
| 1.98 | 2026-05-09 | TASK-048.12 completato: rifinita la CRUD modal/form Master Data con `Chiudi` rimosso dal footer, action bar allineata a destra, spacing piu coerenti e checkbox `Attivo` stilizzata localmente; build/test frontend OK, nessuna modifica backend/API. |
| 1.97 | 2026-05-09 | Backlog TASK-048 aggiornato dopo TASK-048.11: inseriti TASK-048.12 "CRUD modal and form visual refinement" e TASK-048.13 "Header/topbar visual alignment to TEMPLATE-09"; bulk editor, form controls e typography slittati a TASK-048.14, TASK-048.15 e TASK-048.16 senza modifiche applicative. |
| 1.96 | 2026-05-09 | TASK-048.11 alignment polish: active state parent/submenu distanziati dal bordo destro e search box ricentrata verticalmente nella propria sezione; build/test frontend OK. |
| 1.95 | 2026-05-09 | TASK-048.11 refinement pass su densita e scrolling sidebar: rimosso overflow laterale, aggiunto scroll verticale interno stabile, compattati header/search/menu item e alleggerito l'active submenu, con build/test frontend nuovamente OK. |
| 1.94 | 2026-05-09 | TASK-048.11 rifinito ulteriormente: submenu, contrasti, densita, active state e scrollbar della sidebar sono stati resi piu puliti e leggibili mantenendo invariati routing/i18n/ricerca/collapse; build/test frontend rieseguiti con esito OK. |
| 1.93 | 2026-05-09 | TASK-048.11 completato: sidebar esistente riallineata visivamente a TEMPLATE-08 con patch mirata su componente Angular esistente, active/branch-active piu chiari, ricerca su superficie dark, nessuna modifica backend/API/header e build/test frontend OK. |
| 1.92 | 2026-05-09 | TASK-048.10 completato come shell navigation visual review documentale: TEMPLATE-08 e TEMPLATE-09 valutati senza modifiche Angular/backend/API; inserito TASK-048.11 "Sidebar visual alignment to TEMPLATE-08" come task dedicato futuro e rinumerati i successivi TASK-048.x fino a TASK-048.14. |
| 1.91 | 2026-05-09 | TASK-048.9 esteso da sola governance a governance + integrazione repository-local skill Angular approvata: inclusi `.agents/skills/angular-developer` e `skills-lock.json`, esclusa `angular-new-app`, allineati scope/acceptance e riferimenti documentali senza modifiche applicative/backend/API. |
| 1.90 | 2026-05-09 | Inserito TASK-048.9 "Configure Angular AI skills and project agent integration" per documentare l'uso della skill Angular `angular-developer` come supporto complementare alla governance repository; esclusa `angular-new-app`, documentati Plan mode e IDE context, rinumerati i successivi TASK-048.x fino a TASK-048.13, senza modifiche applicative/backend/API. |
| 1.89 | 2026-05-09 | TASK-048.8 final refinement: aggiunti link visuale password dimenticata e footer legale i18n alla login, rimosso marker decorativo dal selettore lingua, senza routing/logica recovery/backend. |
| 1.88 | 2026-05-09 | TASK-048.8 seconda iterazione: login visual alignment review approfondita con layout/card/brand/language selector/CTA piu aderenti a TEMPLATE-06, mantenendo componenti shared email/password e nessuna modifica funzionale/backend. |
| 1.87 | 2026-05-09 | TASK-048.8 completato: login visual alignment review allineata a TEMPLATE-06 con patch minima su layout/login styles+i18n, senza modifiche funzionali o backend; build/test frontend rieseguiti e QA report aggiornato. |
| 1.86 | 2026-05-09 | Rinumerati i subtask TASK-048.x: inserito TASK-048.8 "Login visual alignment review", slittati i successivi (`048.9` shell navigation, `048.10` bulk editor planning, `048.11` shared form controls, `048.12` global typography) e riallineati i riferimenti interni. |
| 1.85 | 2026-05-09 | Aggiunto TASK-048.10 "Shared form controls and form patterns foundation" come TODO per censimento e standardizzazione progressiva dei form controls; rinumerata la typography foundation a TASK-048.11; nessuna modifica codice/frontend/backend. |
| 1.84 | 2026-05-09 | TASK-048.5 follow-up: riallineato il footer modal/dialog al mockup HTML validato con modal CRUD compatta, spacing footer piu coerente, cancel outline e documentazione aggiornata; build/test frontend rieseguiti, nessuna modifica backend/API. |
| 1.83 | 2026-05-09 | TASK-048.5 completato: standardizzati i footer di CRUD modal e confirmation dialog su `/master-data` con ordine azioni coerente, `app-button` e footer condiviso sopra `kt-btn`; build/test frontend OK, nessuna modifica backend/API. |
| 1.80 | 2026-05-09 | TASK-048.6 completato: raffinati pulsanti e feedback toast secondo TEMPLATE-11 e TEMPLATE-07, riusando Metronic/Keenicons e `AlertMessageComponent`; aggiunte chiavi i18n e test frontend, build/test OK, nessuna modifica backend/API. |
| 1.79 | 2026-05-09 | Introdotto "Global typography foundation" come task backlog dedicato alla definizione tipografica globale, successivamente rinumerato a TASK-048.12; nessuna modifica codice applicativo in questa fase. |
| 1.78 | 2026-05-08 | TASK-048.4 completato: raffinato pattern `/master-data` secondo TEMPLATE-01, stati tabella secondo TEMPLATE-03 e `DataTableComponent` shared secondo TEMPLATE-10; introdotte chiavi i18n `dataTable.*`, build/test frontend OK, nessuna modifica backend. |
| 1.77 | 2026-05-08 | TASK-048.3 riallinea i sottotask TASK-048 al catalogo template UI validato in TASK-048.2; TASK-048 diventa iniziativa generale HRflow design system/template UI, Master Data resta caso pilota; nessuna modifica Angular/backend. |
| 1.76 | 2026-05-08 | TASK-048.2 confermato DONE con validazione catalogo astratto UI template Stitch documentato in `docs/design/DESIGN-SYSTEM.md`; screenshot Stitch locali esclusi dal versionamento via `.gitignore`; nessuna modifica Angular/backend. |
| 1.75 | 2026-05-08 | TASK-048.1 completato come preparation documentale: analizzata UI Master Data, creato `docs/design/DESIGN-SYSTEM.md` come draft iniziale, formalizzate regole per tabelle/popup e processo Stitch senza modifiche frontend/backend. |
| 1.74 | 2026-05-08 | TASK-047.3 segnato DONE come chiusura QA/hardening del delete fisico Master Data; aggiunta sintesi prudente senza inventare nuovi esiti di test non documentati e mantenuto invariato il blocco TASK-048. |
| 1.73 | 2026-05-08 | Corretta la rinumerazione dopo l'introduzione di TASK-048 e dei sottotask: mantenuto TASK-054 per backend API authorization, eliminato il doppio TASK-054 e slittati i task successivi fino a TASK-066. |
| 1.72 | 2026-05-07 | TASK-047.1 completato con foundation backend per delete fisico sicuro su entita HR/business candidate (`Department`, `JobTitle`, `ContractType`, `WorkMode`): endpoint `/physical` separati dalla disattivazione logica, conflitti `409` per record referenziati e test backend reali validati. |
| 1.71 | 2026-05-07 | TASK-047 scomposto in subtask incrementali: 047.1 backend foundation delete fisico sicuro, 047.2 azione frontend `Elimina` distinta da `Disattiva`, 047.3 QA/hardening; nessuna rinumerazione dei task successivi. |
| 1.70 | 2026-05-07 | Introdotto TASK-047 "Master Data physical delete for non-referenced records" come task dedicato a cancellazione fisica sicura distinta dalla disattivazione logica `active=false`; backlog Super Admin/RBAC slittato a TASK-048..TASK-053 e task successivi rinumerati fino a TASK-065. |
| 1.69 | 2026-05-07 | TASK-046.4 riallineato alla semantica architetturale esistente: `DELETE` Master Data resta soft-delete/disattivazione `active=false`, UX rinominata da `Elimina` a `Disattiva`, conferma/feedback/error handling i18n aggiornati e follow-up filtro attivi/inattivi + riattiva demandati a task successivi. |
| 1.68 | 2026-05-07 | TASK-046.4 completato con delete/disattivazione frontend su `/master-data`, conferma esplicita, loading/error handling CRUD, feedback utente e build/test frontend validati; prossimo step TASK-046.5. |
| 1.67 | 2026-05-07 | TASK-046.3 completato con integrazione CRUD API reale frontend su entita candidate semplici (`Department`, `JobTitle`, `ContractType`, `WorkMode`): create/update via API backend esistenti, feedback successo/errore, refresh lista post-save e test/build frontend validati senza modifiche backend. |
| 1.66 | 2026-05-07 | Ottimizzati TASK-047..TASK-052 per ridurre sovrapposizioni: 047 strategico/documentale, 048 gap analysis dominio, 049 foundation modello permessi `SCOPE.RESOURCE.ACTION`, 050 foundation utenti/ruoli tenant, 051 UX frontend authorization, 052 enforcement backend reale; chiarita separazione frontend UX vs backend security. |
| 1.65 | 2026-05-07 | Aggiornato TASK-047 come "Platform Super Admin and tenant-aware permissions model" con scope esplicito su `PLATFORM_SUPER_ADMIN`, distinzione `TENANT_ADMIN`, ruoli seed/custom tenant-specific, permessi CRUD Global/Tenant Master Data, regole cross-tenant e impatto frontend/backend. |
| 1.64 | 2026-05-07 | Backlog riorganizzato dopo TASK-046: subtask 046 riallineati (`046.1`-`046.5`), introdotto blocco authorization/Super Admin con TASK-047..TASK-052 (strategy, domain review, permission model, tenant user/role foundation, enforcement frontend/backend), task successivi rinumerati in modo coerente fino a TASK-064. |
| 1.63 | 2026-05-07 | TASK-046.2 completato con Master Data CRUD form foundation frontend: nuovo componente form metadata-driven (create/edit/view), integrazione con azioni `Nuovo`/`Modifica`/`Visualizza`, validazioni base required/read-only, i18n `it/fr/en`, nessuna API backend nuova e test/build frontend validati. |
| 1.62 | 2026-05-07 | TASK-046.1 completato con CRUD action foundation frontend: `DataTableComponent` esteso con azioni riga configurabili, eventi verso il container `/master-data`, entita candidate abilitate con pulsanti `edit` / `delete`, entita non candidate mantenute read-only e test/build frontend validati. |
| 1.61 | 2026-05-07 | TASK-046 ridefinito come contenitore "Master Data CRUD standard foundation": standard CRUD frontend riutilizzabile basato su `DataTableComponent`, azioni configurabili per entita, form/modal o pannello laterale per create/update, API CRUD backend esistenti obbligatorie, editing inline e nuove API backend fuori scope. |
| 1.60 | 2026-05-06 | TASK-045 completato con componente shared read-only `DataTableComponent`, modello colonne configurabile, campi nested, stati loading/error/empty, paginazione tramite eventi e integrazione in `/master-data`; filtri e orchestrazione API restano nel container, build/test frontend validati. |
| 1.59 | 2026-05-06 | TASK-045 scomposto in subtask incrementali 045.1-045.6: configurazione colonne, componente shared read-only, stati UI/paginazione, integrazione `/master-data`, test e backlog evolutivo; confermato che filtri restano nel container e che inline edit/drag&drop/preferenze utente restano fuori scope. |
| 1.58 | 2026-05-06 | Governance/backlog frontend chiariti: aggiunta regola esplicita su riuso tabelle Master Data in `frontend/AGENTS.md`; introdotto TASK-045 dedicato al refactoring shared della tabella Master Data; task successivi rinumerati di +1 a partire dall'ex TASK-045. |
| 1.57 | 2026-05-06 | TASK-044 completato: import CAP italiani da dataset JSON acquistato normalizzato in CSV (`8465` record validi), servizio backend idempotente con report import, endpoint `/api/master-data/global/zip-codes/import/italy`, test backend su validazione/idempotenza/casi invalidi e regressione backend/frontend verificata; nessun CAP estero, nessuna modifica frontend/security. |
| 1.56 | 2026-05-06 | TASK-043 completato: paginazione e filtro generico su Master Data API/UI con query `page/size/search`, response wrapper paginata, UI `/master-data` aggiornata con debounce e precedente/successiva, compatibilita Global/HR-business/Governance-security confermata, test backend/frontend verdi e QA manuale browser superato. |
| 1.55 | 2026-05-06 | TASK-042 chiuso come DONE con seed ISO 3166-1 alpha-2 (249 Paesi/territori), `countries.default_currency_id` nullable, documentazione fonte dati globale e migrazione Flyway V17 PostgreSQL/H2; introdotto TASK-043 su paginazione/filtro generico Master Data API/UI e backlog successivo rinumerato (Import CAP italiani -> TASK-044, CRUD UI Master Data -> TASK-045). |
| 1.54 | 2026-05-06 | TASKS.md riallineato dopo TASK-041 con inserimento TASK-042 seed/import dati globali iniziali e TASK-043 import CAP italiani prima della UI Master Data Admin CRUD. |
| 1.53 | 2026-05-06 | TASK-041 completato con UI Master Data Admin foundation/list read-only: route protetta `/master-data`, voce sidebar `Governance > Dati di base`, categorie Global/HR-business/Governance-security, tabella read-only con loading/error/empty/refresh, i18n `it`/`fr`/`en` completo e test/build frontend validati. |
| 1.52 | 2026-05-05 | TASK-040 completato con foundation i18n runtime custom/minimale: lingua default `it`, dizionario typed, fallback automatico a italiano, `I18nService` con signal, `t(key)`, persistenza `localStorage`, `lang="it"`, testi principali estratti e selettore lingua minimale nella login card senza nuove dipendenze o modifiche auth/routing. |
| 1.51 | 2026-05-05 | TASK-039 rifinito con sidebar collassabile/espandibile: toggle visibile, modalita compatta top-level, search e submenu nascosti quando collassata, placeholder futuri ancora non naviganti e test componente aggiornati. |
| 1.50 | 2026-05-05 | TASK-039 completato con foundation sidebar navigation tree: struttura dati tipizzata locale, nodi fino a 3 livelli, expand/collapse, active route highlighting, ricerca/filtro e placeholder non naviganti per pagine future; nessun backend, RBAC, i18n, nuove route o nuove librerie. |
| 1.49 | 2026-05-05 | Backlog futuro rinumerato in chiusura TASK-036: TASK-039 diventa Frontend sidebar navigation tree foundation, TASK-040 diventa Frontend i18n foundation, UI Master Data Admin slitta a TASK-041/TASK-042 e i task futuri TODO successivi slittano coerentemente fino a TASK-054. |
| 1.48 | 2026-05-05 | Riallineamento documentale intermedio dei task frontend futuri, sostituito dalla rinumerazione definitiva in versione 1.49. |
| 1.47 | 2026-05-05 | TASK-036 completato con home autenticata post-login: route protetta `/` sotto `app-shell`, child route `HomeComponent` minimale, header/sidebar visibili, placeholder dashboard rimossi dalla shell, nessuna UI Master Data Admin e nessuna modifica a backend o login/JWT. |
| 1.46 | 2026-05-05 | TASK-038 completato con direttive frontend/design basate sui colori del logo in `frontend/AGENTS.md`: palette deep indigo, navy, accent blue, violet-blue e soft highlight tint; regole d'uso per login, shell, header, sidebar, pulsanti, link, badge e stati UI; nessuna modifica applicativa. |
| 1.45 | 2026-05-05 | Backlog documentale riallineato dopo TASK-037: introdotto TASK-038 frontend design guidelines based on logo brand colors come task dedicato per documentare palette e direttive UI in `frontend/AGENTS.md`; Master Data Admin foundation/list spostato a TASK-039, Master Data Admin CRUD a TASK-040 e task successivi rinumerati fino a TASK-052. |
| 1.44 | 2026-05-05 | TASK-037 completato con integrazione logo nella login UI esistente: asset `assets/logos/hrm-logo.png`, alt `HRM AI-first`, nessun nuovo componente shared, nessuna modifica a backend, routing, autenticazione, login/logout, sidebar/header/shell o UI Master Data Admin. |
| 1.43 | 2026-05-05 | Backlog documentale riallineato: introdotti TASK-036 frontend authenticated home shell foundation e TASK-037 frontend application logo integration prima della UI Master Data Admin; task successivi rinumerati, poi riallineati nuovamente in 1.45 per inserire le design guidelines basate sul logo. |
| 1.42 | 2026-05-04 | TASK-035 completato con frontend login foundation: route `/login`, LoginComponent, shared EmailField/PasswordField/AlertMessage, core auth service/guard/interceptor, token in `sessionStorage`, route principale protetta, test auth/interceptor, `npm run build` e `npm test` validati. |
| 1.41 | 2026-05-04 | TASK-035 dettagliato con sottotask operativi per frontend login foundation: analisi frontend, riferimento visuale Metronic, routing `/login`, shared form fields, feedback component, login UI, core auth foundation, service/guard/interceptor, navigazione post-login, test tecnici e fuori scope. |
| 1.40 | 2026-05-04 | TASK-034 completato con backend login/JWT foundation: endpoint `/api/auth/login` e `/api/auth/me`, DTO auth, service layer, UserDetailsService su UserAccount, BCrypt, password policy, JWT stateless con Spring Security OAuth2 Resource Server / Jose, migration V15 per email globale case-insensitive, test auth/security/OpenAPI/actuator e BUILD SUCCESS; prossimo passo TASK-035 frontend login foundation. |
| 1.39 | 2026-05-04 | TASK-033 completato come riorganizzazione documentale backlog: introdotti TASK-034 backend login/JWT foundation e TASK-035 frontend login foundation prima delle UI amministrative; UI Master Data Admin spostata dopo login foundation e task successivi rinumerati. |
| 1.38 | 2026-05-04 | TASK-032 completato con API CRUD backend master data governance/security sotto `/api/master-data/governance-security`, DTO request/response globali e tenant-scoped, service layer applicativo, soft delete `active=false`, gestione 400/404/409, test MockMvc/OpenAPI e BUILD SUCCESS; prossimo passo TASK-033 UI Master Data Admin foundation/list. |
| 1.37 | 2026-05-04 | TASK-031 completato con API CRUD backend master data HR/business sotto `/api/master-data/hr-business`, DTO request/response tenant-scoped, service layer applicativo, soft delete `active=false`, gestione 400/404/409, test MockMvc/OpenAPI e BUILD SUCCESS; prossimo passo TASK-032 API CRUD master data governance/security. |
| 1.36 | 2026-05-03 | TASK-030 completato con API CRUD backend master data globali, DTO request/response, service layer applicativo, controller `/api/master-data/global`, soft delete `active=false`, gestione 400/404/409, test MockMvc/OpenAPI e BUILD SUCCESS. |
| 1.35 | 2026-05-03 | Backlog riorganizzato per introdurre API CRUD master data prima della UI Master Data Admin: nuovi TASK-030, TASK-031 e TASK-032 per API CRUD globali, HR/business e governance/security; UI Master Data Admin rinumerata e divisa in foundation/list e CRUD. |
| 1.34 | 2026-05-03 | TASK-029 documentale completato con creazione `frontend/AGENTS.md`, governance frontend UI/shared components e rinumerazione backlog successivo di +1. |
| 1.33 | 2026-05-03 | TASK-028 completato con Core HR API readiness read-only, controller `/api/core-hr`, service read-only, DTO corehr, test MockMvc/OpenAPI e BUILD SUCCESS. |
| 1.32 | 2026-05-03 | TASK-027 completato con EmployeeDisciplinaryAction backend foundation, migration Flyway V14, entity EmployeeDisciplinaryAction, repository JPA e test persistence/query/constraint validati con BUILD SUCCESS. |
| 1.31 | 2026-05-03 | TASK-026 completato con AuditLog backend foundation, migration Flyway V13, entity AuditLog, repository JPA e test persistence/query/constraint validati con BUILD SUCCESS. |
| 1.30 | 2026-05-03 | TASK-025 completato con HolidayCalendar backend foundation, migration Flyway V12, entity HolidayCalendar, repository JPA e test persistence/query/constraint validati con BUILD SUCCESS. |
| 1.29 | 2026-05-03 | TASK-024 completato con LeaveRequest backend foundation, migration Flyway V11, entity LeaveRequest, enum LeaveRequestStatus, repository JPA e test persistence/query/constraint validati con BUILD SUCCESS. |
| 1.28 | 2026-05-03 | TASK-023 completato con PayrollDocument backend foundation, migration Flyway V10, entity PayrollDocument, enum PayrollDocumentStatus, repository JPA e test persistence/query validati con BUILD SUCCESS. |
| 1.27 | 2026-05-02 | TASK-022 completato con Device backend foundation, migration Flyway V9, entity/repository JPA, FK tenant/company/master/employee e test persistence. |
| 1.26 | 2026-05-02 | TASK-021 completato con RBAC bridge foundation, migration Flyway V8, entity/repository JPA, FK rigorose e test persistence/unique constraint. |
| 1.25 | 2026-05-02 | TASK-020 completato con UserAccount identity/security foundation, migration Flyway V7, entity/repository JPA, FK identity governance e test persistence/unique constraint. |
| 1.24 | 2026-05-02 | TASK-019 completato come riorganizzazione documentale backend-first: backlog futuro riallineato, implementazioni tecniche spostate da TASK-020 e UI operative posticipate. |
| 1.23 | 2026-05-02 | TASK-018 completato con Contract governance foundation, migration Flyway V6, entity/repository JPA, FK verso Tenant/CompanyProfile/Employee/ContractType/Currency e test JPA. |
| 1.22 | 2026-05-02 | TASK-017 completato con Employee core persistence foundation documentata, migration Flyway V5, entity/repository JPA e test di persistenza/unique constraint. |
| 1.21 | 2026-05-02 | TASK-016 completato con validation hardening, DTO read-only, service layer, API foundation endpoints, error handling, OpenAPI verification e DEC-022. |
| 1.20 | 2026-05-02 | TASK-015 completato con Tenant reale, CompanyProfile, OfficeLocation, SmtpConfiguration, FK hardening da V2/V3 e migration Flyway V4. |
| 1.19 | 2026-05-02 | TASK-014 completato con master tables governance/security globali e tenant-scoped, migration Flyway V3, DEC-020 e test smoke backend. |
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
