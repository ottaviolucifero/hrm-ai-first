# TASKS.md

## Progetto HRM AI-first

Versione: 1.53
Ultimo aggiornamento: 2026-05-06
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

### TASK-042 - Implementare UI Master Data Admin CRUD

Stato: TODO

Obiettivo:

- Implementare create/update/delete UI per Master Data Admin usando le API CRUD backend dei TASK-030, TASK-031 e TASK-032.
- Non usare mock come sostituto dei contratti API backend.

### TASK-043 - Implementare UI Employee management enterprise

Stato: TODO

### TASK-044 - Implementare Security Admin UI

Stato: TODO

Include:

- utenti
- MFA
- tenant access
- ruoli
- permessi

### TASK-045 - Implementare UI Device governance

Stato: TODO

### TASK-046 - Implementare UI PayrollDocument

Stato: TODO

### TASK-047 - Implementare UI LeaveRequest

Stato: TODO

### TASK-048 - Implementare UI HolidayCalendar

Stato: TODO

### TASK-049 - Implementare Audit UI / compliance explorer

Stato: TODO

### TASK-050 - Implementare UI disciplinary governance

Stato: TODO

## FASE 2G - PLATFORM OPERATIONS

### TASK-051 - Implementare Platform Operator / Super Admin governance

Stato: TODO

### TASK-052 - Implementare Cross-tenant admin UI

Stato: TODO

## FASE 3 - STABILIZATION

### TASK-053 - Configurare logging, monitoring e observability enterprise

Stato: TODO

### TASK-054 - Test integrato MVP enterprise completo

Stato: TODO

---

## 6. Cronologia versioni

| Versione | Data | Descrizione |
|---|---|---|
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
