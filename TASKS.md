# TASKS.md

## Progetto HRM AI-first

Versione: 2.40
Ultimo aggiornamento: 2026-05-13
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
- Quando un task introduce un nuovo CRUD, una nuova area amministrativa o azioni applicative su una nuova entita/modulo, il task deve prevedere: verifica/aggiunta permessi o authorities del modulo, eventuale seed/migration `Permission`, esposizione nella matrice Ruolo/Permessi, mapping standard `READ/CREATE/UPDATE/DELETE` e test dove applicabile; se non incluso, deve essere dichiarato come fuori scope o follow-up esplicito.

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

Stato: DONE

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

Completato:

- formalizzato il pattern `Spreadsheet-style bulk editor` come editor massivo futuro per dataset tabellari semplici e limitati;
- definiti casi d'uso iniziali compatibili con HRM, con priorita ai master data tenant-scoped a schema semplice;
- esclusi dal primo rilascio i casi ad alta complessita, ad esempio geografie nidificate, ruoli/permessi, record core HR e dataset molto grandi;
- chiarito il comportamento atteso per righe/celle editabili, validazione inline, errori per riga/cella, righe nuove/modificate/invalide, salvataggio massivo e annullamento modifiche;
- documentato il riuso ammesso di shell, toolbar, filtri, feedback, bottoni, modali di conferma e pattern stati gia esistenti;
- raccomandato un componente futuro dedicato, separato da `DataTableComponent`, per evitare regressioni sul pattern read-only/paginato esistente;
- identificati vincoli i18n, accessibilita, responsive e performance, oltre ai futuri task tecnici necessari prima di una implementazione reale.

### TASK-048.15 - Shared form controls and form patterns foundation

Stato: DONE

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

### Stato phase 2

- Created `app-input` in `frontend/src/app/shared/components/input/` as a second safe shared form control.
- Integrated `app-input` in Master Data CRUD modal for non-boolean fields only, with read-only/create/edit behavior unchanged.
- `app-select` was evaluated as phase-2 candidate and deferred to a dedicated task to avoid scope creep and unsafe option/value abstraction.
- Updated shared form control rules in `docs/design/DESIGN-SYSTEM.md` for the phase-2 foundation.

### Nota

- `app-select` is not implemented in this phase by design. Decision kept in design system and QA report to limit regressions.
### TASK-048.16 - Global typography foundation

Stato: DONE

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

Completamento:

- Introdotto `frontend/src/typography.scss` come layer finale della tipografia globale frontend.
- `frontend/angular.json` aggiornato per caricare `src/typography.scss` come ultimo file nell'array `styles`, senza spostare `src/styles.scss`.
- Manrope definito come font applicativo globale tramite token CSS e fallback sicuri, senza introdurre CDN o font remoti.
- Keenicons lasciati invariati; nessun override ai font iconografici.
- `docs/design/DESIGN-SYSTEM.md`, `ROADMAP.md` e `docs/qa/QA-REPORTS.md` aggiornati con la foundation tipografica.
- Verifica reale eseguita con `cd frontend && npm.cmd run build` -> OK e `cd frontend && npm.cmd test` -> OK (`17` file di test, `96` test passed).

### TASK-049 - Platform Super Admin and tenant-aware permissions model

Stato: DONE

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

Analisi modello esistente:

- `UserType` e master globale e contiene il tipo utente piattaforma/tenant, incluso `PLATFORM_SUPER_ADMIN`.
- `Role` e `Permission` sono master tenant-scoped con `tenant_id`, unique constraint `(tenant_id, code)` e flag `system_role` / `system_permission`.
- `UserTenantAccess` modella accessi espliciti utente-tenant, ma non sostituisce il controllo permessi runtime.
- `UserRole` e `RolePermission` sono bridge tenant-scoped gia presenti per collegare utenti, ruoli e permessi.
- `UserAccount` resta il boundary identity/security, con `tenant`, `primaryTenant`, `userType`, autenticazione email-first e strong authentication readiness.
- La security runtime corrente autentica JWT e produce solo authority tecnica `USER_TYPE_<userType>`; RBAC runtime completo, tenant switching e impersonation restano deferred.

Modello strategico approvato per i task successivi:

- `PLATFORM_SUPER_ADMIN` e un tipo utente globale di piattaforma, non un ruolo custom tenant e non un normale utente tenant.
- `TENANT_ADMIN` e un ruolo operativo tenant-scoped, valido solo dentro i tenant autorizzati.
- I ruoli base seed con `system_role=true` sono protetti da delete accidentale e usati per bootstrap/standardizzazione.
- I ruoli custom creati dal tenant restano visibili e validi solo nel tenant di appartenenza.
- I permessi CRUD devono distinguere almeno `READ` / `LIST`, `CREATE`, `UPDATE` e `DELETE`.
- I Global Master Data sono gestiti dalla piattaforma; il tenant admin puo leggerli quando necessario ma non modificarli per default.
- I Tenant Master Data sono gestiti nello scope tenant, con protezione backend su tenant, permessi e riferimenti.
- Le regole cross-tenant sono default deny; accesso cross-tenant solo per platform policy esplicita e auditabile.
- Il backend resta authoritative per autorizzazione e isolamento tenant; frontend visibility e solo supporto UX.
- Il naming futuro dei permessi deve convergere verso `SCOPE.RESOURCE.ACTION`, in continuita con TASK-052.

Decisioni documentate:

- Aggiunta DEC-030 in `DECISIONS.md` per formalizzare il modello autorizzativo tenant-aware.
- Aggiornata `ARCHITECTURE.md` con il modello strategico e i confini tra platform, tenant admin, ruoli custom e permessi CRUD.

Gap aperti demandati al backlog:

- TASK-050 deve valutare e configurare una skill Spring/backend approvata come supporto complementare ai prossimi task backend/security.
- TASK-051 deve verificare gap tecnici e coerenza entity/API/seed rispetto al modello.
- TASK-052 deve definire la foundation dei codici permesso per scope/resource/action.
- TASK-053 deve introdurre amministrazione tenant utenti/ruoli tramite subtask interni senza anticipare enforcement completo.
- TASK-054 deve applicare i permessi alla visibilita frontend.
- TASK-055 deve applicare enforcement reale lato backend.
- Restano fuori scope tenant switching runtime, impersonation runtime e MFA operativa.

Validazione:

- Task solo documentale.
- Nessun codice backend/frontend modificato.
- Nessuna migration creata.
- Nessun test automatico richiesto o necessario.
- Controlli richiesti: diff e coerenza markdown documentale.

### TASK-050 - Configure Spring AI skill and backend agent integration

Stato: DONE

Tipo: Governance / Backend agent integration

Obiettivo:

- Versionare e documentare una skill Spring/backend approvata per standardizzare il lavoro degli agenti sui prossimi task backend/security senza sostituire la governance del repository.

Contesto:

- al momento il repository versiona solo la skill Angular `angular-developer` sotto `.agents/skills/angular-developer` e `skills-lock.json`;
- nessuna skill Spring/backend repository-local risulta ancora approvata o lockata;
- i prossimi task backend/security richiedono convenzioni coerenti su Spring Boot 4, Spring Security, JPA/Flyway, service layer, DTO/controller e test backend.

Scope:

- valutare e integrare skill Spring/backend approvata;
- versionarla in `.agents/skills/...` se disponibile e approvata;
- aggiornare `skills-lock.json` se necessario;
- documentare quando usarla nei task backend;
- documentare l'uso per User/Role/Permission domain review, permission model foundation, backend authorization enforcement, Spring Security, Spring Boot 4, JPA/Flyway, service layer, DTO/controller e test backend;
- chiarire che e supporto complementare a `AGENTS.md`, `backend/AGENTS.md`, `TASKS.md`, `ROADMAP.md`, `DECISIONS.md` e non sostituisce la governance del repository.

Fuori scope:

- codice backend applicativo;
- migration;
- API;
- enforcement RBAC;
- refactor security;
- UI.

Completato:

- verificata la presenza delle sole skill repository-local esistenti, confermando `angular-developer` come unica skill gia lockata prima di questo task;
- confermata assenza di una skill Spring/backend gia disponibile o approvata nel repository;
- approvata e versionata una skill minima repository-local `spring-backend-developer` sotto `.agents/skills/spring-backend-developer`;
- aggiornato `skills-lock.json` con lock dedicato della nuova skill repository-local;
- collegato l'uso della skill a `backend/AGENTS.md` e `docs/ai-prompts/codex-prompt-governance.md`;
- chiarito che la skill si applica a Spring Boot 4, Java 21, Spring Security, JWT/security foundation, User/Role/Permission domain review, permission model foundation, backend authorization enforcement, JPA/Flyway, service layer, DTO/controller e backend tests;
- chiarito che la skill non autorizza nuove architetture parallele, nuove librerie/framework non approvati, migration fuori scope, API non richieste, RBAC enforcement fuori task o refactor security non richiesto;
- mantenuto invariato il codice backend applicativo.

Validazione:

- task documentale/governance completato senza modifiche applicative backend/frontend;
- nessuna migration creata;
- nessuna API creata;
- controlli eseguiti: verifica struttura skill, lock file, `git diff`, `git diff --check` e `git status --short --branch`.

### TASK-051 - User, Role and Permission domain review

Stato: DONE

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

Risultato analisi:

- `UserType` e un master data globale e contiene gia i seed `PLATFORM_SUPER_ADMIN`, `PLATFORM_OPERATOR`, `TENANT_ADMIN` ed `EMPLOYEE`.
- `Role` e `Permission` sono master data tenant-scoped, con `tenant_id`, `code`, `name`, `active`, timestamp e flag di sistema (`system_role`, `system_permission`).
- I bridge `UserRole`, `RolePermission` e `UserTenantAccess` esistono a livello JPA/Flyway e sono tenant-aware per persistenza e vincoli principali.
- `UserTenantAccess` e volutamente semplice: collega utente e tenant con `access_role` stringa e flag `active`, ma non e ancora collegato a `Role` e non modella policy cross-tenant avanzate.
- `Role` e `Permission` sono esposti dalle API `/api/master-data/governance-security`; `UserAccount`, `UserRole`, `RolePermission` e `UserTenantAccess` non hanno ancora API amministrative dedicate.
- Il JWT/login corrente espone `userId`, `tenantId` e `userType`; Spring Security deriva solo authority tecnica `USER_TYPE_<userType>`.
- Non risultano ancora claim o response `/me` con ruoli, permessi, tenant access o permission summary.

Gap analysis:

| Area | Stato attuale | Gap | Impatto | Priorita | Task suggerito |
|---|---|---|---|---|---|
| Platform user type | `PLATFORM_SUPER_ADMIN` esiste come `UserType` globale seed. | Non esiste ancora un flusso amministrativo per gestire utenti platform o elevazioni. | Il confine platform e documentato ma non operabile in sicurezza. | Alta | TASK-053 |
| Tenant admin | `TENANT_ADMIN` esiste sia come `UserType` globale sia come `Role` tenant seed. | La distinzione strategica di TASK-049 non e ancora riflessa da API/policy amministrative esplicite. | Rischio ambiguita tra tipo utente globale e ruolo operativo tenant. | Alta | TASK-053 |
| Ruoli seed | `Role.systemRole` e seed tenant `TENANT_ADMIN`, `HR_MANAGER`, `SUPERVISOR` sono presenti. | Le API consentono ancora di impostare o modificare il flag `systemRole` da request e di disattivare ruoli seed. | I ruoli base non sono ancora protetti come richiesto da TASK-049/DEC-030. | Alta | TASK-053 |
| Ruoli custom | Il modello tenant-scoped consente ruoli per tenant. | Non c'e ancora API/policy dedicata per distinguere ciclo vita seed vs custom. | La futura UI amministrativa non ha contratti sicuri per ruoli custom. | Alta | TASK-053 |
| Permessi CRUD | `Permission` esiste con seed coarse (`EMPLOYEE_READ`, `EMPLOYEE_WRITE`, `DOCUMENT_READ`, `DOCUMENT_WRITE`, `SETTINGS_MANAGE`). | Manca naming `SCOPE.RESOURCE.ACTION` e mancano permessi CRUD granulari per Global/Tenant Master Data. | Blocca una base coerente per frontend visibility e backend enforcement. | Alta | TASK-052 |
| Global vs Tenant Master Data | Le API Master Data sono gia separate in global, HR/business e governance/security. | I permessi non distinguono ancora risorse Global Master Data e Tenant Master Data. | Non e possibile autorizzare in modo coerente azioni platform vs tenant. | Alta | TASK-052 |
| RolePermission | Bridge tenant-scoped e vincolo unico presenti. | Mancano service/API e validazioni applicative su coerenza tenant tra role, permission e bridge. | Assegnazione permessi non amministrabile in modo controllato. | Alta | TASK-053 |
| UserRole | Bridge tenant-scoped e vincolo unico presenti. | Mancano service/API e validazioni applicative tra user, tenant access e role tenant. | Assegnazione ruoli non amministrabile in modo controllato. | Alta | TASK-053 |
| UserTenantAccess | Bridge user-tenant presente con `accessRole` e `active`. | Non filtra sempre per `active`, non collega ruoli e non modella policy cross-tenant/platform. | Base sufficiente per foundation, ma da estendere prima di tenant switching/enforcement. | Media/Alta | TASK-053 / TASK-055 |
| Auth/JWT | Login JWT operativo con `userId`, `tenantId`, `userType`. | Mancano ruoli, permessi, tenant access, primary tenant e permission summary in token o `/me`. | Frontend visibility e backend enforcement non hanno ancora dati autorizzativi completi. | Media/Alta | TASK-054 / TASK-055 |
| API/DTO | CRUD Role/Permission disponibile come governance-security master data. | Nessuna API amministrativa per UserAccount/bridge; flag di sistema scrivibili dai DTO correnti. | La futura amministrazione utenti/ruoli richiede contratti piu stretti. | Alta | TASK-053 |
| Test | Test auth, persistence bridge e governance-security API presenti. | Mancano test per protezione seed, naming permessi, coerenza tenant cross-bridge e permission exposure. | Rischio regressioni quando iniziano TASK-052..TASK-055. | Media | TASK-052 / TASK-053 |

Backlog tecnico minimale post-TASK-051:

1. TASK-052: definire e seedare la foundation dei permessi `SCOPE.RESOURCE.ACTION`, includendo CRUD per Global Master Data e Tenant Master Data, senza enforcement runtime.
2. TASK-053.1: introdurre foundation backend/API per ruoli e assegnazioni ruolo-permesso, con protezione ruoli/permessi seed e validazioni tenant-aware.
3. TASK-053.2: introdurre la foundation frontend per la matrice permessi ruolo, riusando API esistenti e senza enforcement frontend completo.
4. TASK-053.3: introdurre CRUD amministrativo dedicato ai ruoli custom tenant, con protezione esplicita dei ruoli `system_role`.
5. TASK-053.4: introdurre foundation amministrativa tenant read/list/detail utenti, distinguendo vista platform e vista tenant.
6. TASK-053.5: introdurre foundation assegnazione/rimozione ruoli utente tenant.
7. TASK-053.6: introdurre foundation amministrazione password utente tenant.
8. TASK-053.7: introdurre foundation create/edit account utente tenant.
9. TASK-053.8: introdurre foundation lifecycle utente tenant (active/locked/access revocation).
10. TASK-053.9: analizzare e chiarire foundation link `UserAccount` <-> `Employee` per account non collegati.
11. TASK-054: introdurre in frontend permission summary e modello centralizzato di visibility UX, senza considerarlo fonte autoritativa di sicurezza.
12. TASK-055: applicare enforcement backend reale sulle API usando la foundation dei permessi, default deny e mapping endpoint/permesso/azione.
13. TASK-055.1: completare tenant/caller authorization sugli endpoint admin critici, inclusi `/api/admin/roles`.

Validazione:

- suite backend completa avviata ma non usata come criterio finale per TASK-051 perche entra anche nei test/import CAP italiani con logging SQL molto verboso;
- test mirati eseguiti: `cd backend && .\mvnw.cmd "-Dtest=AuthControllerTests,MasterDataGovernanceSecurityControllerTests,HrmBackendApplicationTests" test`;
- esito test mirati: BUILD SUCCESS, 74 test eseguiti, 0 failure, 0 error, 0 skipped;
- nessun codice runtime, migration, API o security configuration modificato.

### TASK-052 - Permission model foundation by scope/resource/action

Stato: DONE

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

Implementazione:

- aggiunti enum backend `PermissionScope`, `PermissionResource`, `PermissionAction`;
- aggiunto helper `PermissionCode` per costruire e validare il formato `SCOPE.RESOURCE.ACTION`;
- aggiunta migration Flyway `V18__seed_permission_model_scope_resource_action.sql`;
- riallineati i 5 seed legacy (`EMPLOYEE_READ`, `EMPLOYEE_WRITE`, `DOCUMENT_READ`, `DOCUMENT_WRITE`, `SETTINGS_MANAGE`) verso codici stabili tenant-scoped;
- seedata la matrice iniziale `PLATFORM` / `TENANT` x resource iniziali x action iniziali, per 100 permessi totali sul foundation tenant;
- tutti i permessi seed restano `system_permission=true`;
- nessuna assegnazione automatica `RolePermission`, nessun cambio JWT/login e nessun enforcement runtime introdotto.

Validazione:

- `cd backend && .\mvnw.cmd "-Dtest=PermissionCodeTests,HrmBackendApplicationTests" test` -> BUILD SUCCESS, 55 test eseguiti, 0 failure, 0 error, 0 skipped;
- confermato che `TENANT.MASTER_DATA.WORK_MODE.CREATE` non e un codice valido nel modello iniziale;
- confermato che il task non introduce granularita permission per singola entita Master Data.

### TASK-053 - Tenant user and role administration foundation

Stato: IN_PROGRESS

Tipo: Epic / Cross-stack foundation

Obiettivo:

- Preparare progressivamente la base di gestione ruoli, permessi e utenti tenant-aware, senza introdurre enforcement backend completo e senza gestione permessi granulari per singola entita.

Nota importante:

- TASK-053 resta il task principale/contenitore.
- TASK-053.1, TASK-053.2, TASK-053.3, TASK-053.4, TASK-053.5, TASK-053.6, TASK-053.7 e TASK-053.8 sono subtask figli interni del TASK-053, non task autonomi allo stesso livello dei task principali TASK-052, TASK-054 e TASK-055.
- TASK-053.9 e un task candidate/opzionale da valutare in base ai risultati della foundation utenti tenant.

#### TASK-053.1 - Backend role administration API foundation

Stato: DONE

Tipo: Backend foundation

Scope:

- API lettura ruoli;
- API dettaglio ruolo;
- API lettura permessi assegnati a un ruolo;
- API update foundation delle assegnazioni ruolo-permesso;
- DTO espliciti;
- service layer transazionale;
- riuso entity/repository esistenti `Role`, `Permission`, `RolePermission`, `Tenant`;
- nessun enforcement backend completo;
- nessuna gestione avanzata permessi per singola entita;
- nessuna UI.

Implementazione:

- aggiunta API backend foundation sotto `/api/admin/roles`;
- aggiunti DTO espliciti per lista ruolo, dettaglio ruolo, tenant reference, permission assegnati e update assegnazioni;
- aggiunto service layer `RoleAdministrationService` con letture `@Transactional(readOnly = true)` e update assegnazioni `@Transactional`;
- implementata semantica replace per assegnazioni `RolePermission`;
- validata esistenza di `Role`, `Permission` e `Tenant`;
- validata coerenza tenant tra ruolo e permessi;
- deduplicati i permission id in input prima della persistenza;
- corretto V18 `V18__seed_permission_model_scope_resource_action.sql` con cast UUID espliciti per compatibilita PostgreSQL;
- nessuna modifica a security globale, JWT, tenant resolution, UI o import CAP/ZIP.

Validazione:

- `cd backend && .\mvnw.cmd -Dtest=RoleAdministrationControllerTests test` -> BUILD SUCCESS, 10 test eseguiti, 0 failure, 0 error, 0 skipped;
- `cd backend && .\mvnw.cmd test` avviato ma interrotto su richiesta per output/attivita massiva preesistente su `global_zip_codes`; da analizzare in task tecnico dedicato;
- nessuna modifica fatta a import CAP/ZIP.

#### TASK-053.2 - Frontend role permission matrix UI foundation

Stato: DONE

Tipo: Frontend foundation

Scope:

- implementare la schermata contenuto ispirata al mockup fornito;
- lista ruoli laterale;
- selezione ruolo;
- matrice permessi per modulo;
- azioni Ripristina e Salva Modifiche;
- checkbox per Lettura, Scrittura, Modifica, Eliminazione;
- integrazione dentro AppShell esistente;
- non ricreare header, sidebar o layout globale;
- rispettare design system HRflow;
- rispettare Manrope come font globale gia configurato;
- usare i18n `it`/`fr`/`en` per tutti i testi;
- nessun enforcement frontend completo;
- nessuna gestione utenti in questo subtask.

Implementazione:

- aggiunta nuova route frontend protetta `/admin/permissions` dentro `AppShellComponent`, senza ricreare shell, header o sidebar;
- aggiunta schermata Angular dedicata con header azioni, lista ruoli tenant a sinistra e matrice permessi a destra, ispirata al mockup ma adattata ai pattern HRflow esistenti;
- riusati `app-button`, `app-checkbox`, `NotificationService`, shell/header/sidebar attuali e styling locale coerente con `master-data`/design system;
- verificata compatibilita reale delle API backend gia presenti sotto `/api/admin/roles` e delle relative response;
- introdotto service frontend locale per:
  - lista ruoli tenant-aware da `/api/admin/roles`;
  - dettaglio ruolo da `/api/admin/roles/{roleId}`;
  - permessi assegnati da `/api/admin/roles/{roleId}/permissions`;
  - update replace assegnazioni da `/api/admin/roles/{roleId}/permissions`;
  - catalogo permessi da `/api/master-data/governance-security/permissions` con raccolta multipagina;
- costruita matrice frontend dai codici permesso `SCOPE.RESOURCE.ACTION`, mappando le colonne UI a `READ`, `CREATE`, `UPDATE`, `DELETE` e lasciando `MANAGE` fuori matrice;
- filtrata la matrice per mostrare solo permessi Master Data realmente presenti nel catalogo tenant (`TENANT.MASTER_DATA.READ|CREATE|UPDATE|DELETE`), senza moduli placeholder o sezioni mock;
- filtrato il catalogo permessi sul `tenantId` del ruolo selezionato, senza introdurre nuova tenant resolution;
- esteso `app-checkbox` in modo minimale e retrocompatibile con supporto `checked`, `ariaLabel`, label visivamente nascosta e variante compatta per uso matriciale;
- aggiornati sidebar, menu `Governance > Sicurezza > Permessi` e header title per la nuova route permessi;
- non implementati creazione, modifica o cancellazione ruoli; il pulsante `+` del mockup e stato lasciato fuori UI in questo task;
- nessuna modifica backend/API/security/JWT o enforcement RBAC.

Validazione:

- `cd frontend && npm.cmd run build` -> OK;
- `cd frontend && npm.cmd test` -> OK;
- la validazione manuale completa richiede un utente tenant-aware con `tenantId` valido (es. `TENANT_ADMIN`); con `PLATFORM_SUPER_ADMIN` la schermata puo non essere completamente esercitabile in assenza di tenant corrente selezionato;
- nessuna validazione browser manuale eseguita in questa sessione CLI.

#### TASK-053.3 - Tenant custom role CRUD foundation

Stato: IN_PROGRESS

Tipo: Frontend + backend foundation

Scope:

- creazione ruolo custom tenant;
- modifica nome e descrizione ruolo;
- attivazione/disattivazione ruolo;
- eliminazione consentita solo per ruoli custom non di sistema;
- protezione dei ruoli `system_role`;
- contratti API e UI dedicati al lifecycle dei ruoli tenant custom;
- eventuale duplicazione ruolo demandata a follow-up opzionale se non entra in questo task.

Fuori scope:

- enforcement backend completo;
- gestione utenti tenant;
- visibility frontend completa basata su permessi;
- duplicazione ruolo obbligatoria nel primo rilascio.

Nota di allineamento review permessi:

- la foundation CRUD ruoli custom tenant resta confinata a TASK-053.3;
- la protezione `system_role` su update/delete/activate/deactivate/update permissions e presente;
- la matrice Ruolo/Permessi consente assegnazioni permessi in modalita foundation;
- i controlli frontend su menu/route/bottoni restano UX e non sicurezza reale;
- l'enforcement RBAC runtime completo resta fuori scope di TASK-053.3;
- l'enforcement backend reale e demandato a TASK-055 e TASK-055.1.

#### TASK-053.4 - Tenant user administration read/list/detail foundation

Stato: DONE

Tipo: Frontend + backend foundation

Scope:

- API lista utenti tenant;
- API dettaglio utente base;
- visualizzazione ruoli assegnati read-only;
- visualizzazione accessi tenant read-only;
- distinzione vista platform e vista tenant;
- UI lista utenti;
- UI dettaglio utente;
- nome/cognome solo come dati derivati da Employee quando `employee_id` e valorizzato;
- fallback su email quando l account non e collegato a Employee.

Fuori scope:

- assegnazione/rimozione ruoli utente;
- gestione password;
- create/edit utente;
- lifecycle attivo/bloccato;
- enforcement backend completo;
- visibility frontend completa basata su permessi;
- policy autorizzative granulari;
- gestione permessi per singola entita;
- nuove migration per aggiungere nome/cognome a UserAccount;
- redesign globale;
- nuove librerie UI;
- duplicazione di componenti tabellari o layout.

Note tecniche:

- `UserAccount` rappresenta l identita applicativa.
- `Employee` rappresenta l anagrafica personale/HR.
- La lista utenti puo mostrare nome/cognome solo se disponibili tramite relazione Employee.
- `accessRole` di `UserTenantAccess` non deve essere presentato come ruolo RBAC.

Implementazione:

- aggiunte API read-only `/api/admin/users` e `/api/admin/users/{userId}`;
- aggiunti DTO espliciti per lista/dettaglio utenti, tenant/company/employee reference, ruoli assegnati e accessi tenant;
- `displayName`, `firstName` e `lastName` sono derivati solo da `UserAccount.employee`; in assenza di Employee il display usa `email`;
- esclusi dai DTO `passwordHash` e `otpSecret`;
- aggiunto fetch graph su `UserAccount` per relazioni singole e query bulk per `UserRole`/`UserTenantAccess`, evitando N+1 su Employee, UserType, Tenant, CompanyProfile, ruoli e accessi;
- aggiunta UI read-only `/admin/users` e dettaglio `/admin/users/:id`;
- aggiunta voce sidebar `Governance > Sicurezza > Utenti`;
- riusati `DataTableComponent`, `app-button`, shell/header/sidebar, i18n runtime e pattern lista amministrativa gia esistenti;
- nessuna create/edit/delete utente, nessuna gestione password, nessuna assegnazione ruoli, nessun lifecycle active/locked, nessuna nuova migration e nessun enforcement RBAC completo.

Validazione:

- `cd backend && .\mvnw.cmd -Dtest=UserAdministrationControllerTests test` -> BUILD SUCCESS, 5 test eseguiti, 0 failure, 0 error, 0 skipped;
- `cd frontend && npm.cmd test -- --include src/app/features/user-administration/user-administration.service.spec.ts --include src/app/features/user-administration/user-administration.component.spec.ts --include src/app/features/user-administration/user-administration-detail.component.spec.ts` -> OK, 3 file test, 9 test passed;
- suite complete backend/frontend richieste registrate nel report QA del task.

#### TASK-053.5 - Tenant user role assignment foundation

Stato: DONE

Tipo: Frontend + backend foundation

Scope:

- lista ruoli disponibili per tenant;
- assegnazione ruolo a utente;
- rimozione ruolo da utente;
- validazioni base anti-duplicato;
- UI minimale per gestione ruoli utente.

Fuori scope:

- gestione permessi granulari;
- enforcement backend completo;
- visibility frontend completa basata su permessi;
- redesign globale.

Implementazione:

- aggiunte API backend sotto `/api/admin/users` per leggere ruoli assegnati per tenant, leggere ruoli disponibili per tenant, assegnare un ruolo e rimuovere un ruolo;
- aggiunto DTO esplicito `UserRoleAssignmentRequest`;
- riusati `UserAccount`, `Role`, `UserRole`, `UserTenantAccess`, `Tenant` e i DTO `UserAdministrationRoleResponse`;
- validati utente, tenant, ruolo, coerenza tenant del ruolo, accesso tenant attivo dell utente e anti-duplicato su assegnazione;
- la lista ruoli disponibili restituisce ruoli attivi del tenant non ancora assegnati all utente;
- estesa la UI dettaglio `/admin/users/:id` con gestione ruoli utente tenant-specific;
- aggiunti selettore tenant da accessi attivi, lista ruoli assegnati, select ruoli disponibili, assegnazione/rimozione e feedback success/error tramite `NotificationService`;
- aggiunte chiavi i18n `it`/`fr`/`en`;
- nessuna nuova migration, nessuna modifica JWT/security globale, nessun enforcement RBAC completo e nessuna visibility frontend completa.

Validazione:

- `cd backend && .\mvnw.cmd "-Dtest=UserAdministrationControllerTests" test` -> BUILD SUCCESS, 11 test eseguiti, 0 failure, 0 error, 0 skipped;
- `cd backend && .\mvnw.cmd test` -> BUILD SUCCESS, 142 test eseguiti, 0 failure, 0 error, 0 skipped;
- `cd frontend && npm.cmd test -- --include src/app/features/user-administration/user-administration.service.spec.ts --include src/app/features/user-administration/user-administration-detail.component.spec.ts` -> OK, 2 file test, 9 test passed;
- `cd frontend && npm.cmd run build` -> OK;
- `cd frontend && npm.cmd test` -> OK, 25 file test passed, 133 test passed;
- `git diff --check` -> OK, solo warning CRLF gia coerenti con ambiente Windows.

#### TASK-053.6 - Tenant user password administration foundation

Stato: DONE

Tipo: Frontend + backend foundation

Scope:

- reset password da admin;
- eventuale password temporanea, se coerente con il modello esistente;
- validazione con password policy esistente;
- visualizzazione dati security utili dove gia presenti.

Fuori scope:

- recupero password self-service;
- flusso email automatico se non gia previsto;
- MFA runtime completo;
- campo `must_change_password`, salvo migration dedicata futura.

#### TASK-053.7 - Tenant user create/edit foundation

Stato: DONE

Tipo: Frontend + backend foundation

Scope:

- creazione UserAccount;
- modifica dati base account;
- gestione tenant/accesso primario;
- eventuale password iniziale;
- collegamento Employee solo se coerente con il dominio esistente.

Implementato:

- API `GET /api/admin/users/form-options`, `POST /api/admin/users` e `PUT /api/admin/users/{userId}`;
- create con email normalizzata, `userType`, tenant, company profile opzionale, `PASSWORD_ONLY`, password iniziale validata da `PasswordPolicy`, `primaryTenant` uguale al tenant iniziale, `active=true`, `locked=false` e `UserTenantAccess` automatico;
- update limitato a email e company profile opzionale/azzerabile;
- UI Angular `/admin/users/new` e `/admin/users/:id/edit`, CTA lista/dettaglio, form a card con componenti shared per button/input/email/password/checkbox, i18n `it/fr/en` e test frontend/backend.

Fuori scope:

- profilo HR avanzato;
- duplicazione dati anagrafici Employee dentro UserAccount;
- gestione permessi granulari;
- enforcement completo.

#### TASK-053.8 - Tenant user lifecycle foundation

Stato: DONE

Tipo: Frontend + backend foundation

Scope:

- attiva/disattiva utente;
- blocca/sblocca utente;
- eventuale revoca accesso tenant;
- audit minimo solo se coerente con pattern esistenti.

Implementato:

- endpoint backend `PUT /api/admin/users/{userId}/activate`, `PATCH /api/admin/users/{userId}/deactivate`, `PUT /api/admin/users/{userId}/lock` e `PUT /api/admin/users/{userId}/unlock`;
- update idempotente dei soli flag `UserAccount.active` e `UserAccount.locked`, con ritorno del dettaglio utente aggiornato e senza nuove migration;
- login backend/frontend esteso con codici errore stabili per account non attivo o bloccato solo dopo validazione corretta delle credenziali, mantenendo messaggio generico per email inesistente o password errata;
- UI login aggiornata con messaggi i18n specifici `Account disattivato` e `Account bloccato`, senza cambiare policy JWT, lockout o password;
- UI Angular nel dettaglio utente `/admin/users/:id` con sezione lifecycle dedicata, CTA chiare, conferma per `disattiva`/`blocca`, feedback `NotificationService`, i18n `it/fr/en` e test frontend/backend;
- nessuna revoca `tenant access` implementata: `UserAdministrationUserDetailResponse` espone `tenantAccesses`, ma il contratto corrente non distingue in modo sicuro accesso primario implicito via `UserAccount.tenant` da accesso bridge `UserTenantAccess`;
- nessun audit applicativo nuovo introdotto: esistono entity/repository `AuditLog`, ma non un pattern service amministrativo riusabile gia consolidato per questi endpoint.

Fuori scope:

- cancellazione fisica;
- policy granulari;
- enforcement completo.
- revoca `tenant access` finche il contratto DTO/modello non distingua esplicitamente accesso primario vs bridge;
- reset automatico di `failedLoginAttempts` o altre policy di unlock non gia definite dal modello corrente.

#### TASK-053.9 - UserAccount Employee link foundation

Stato: DONE

Tipo: Backend + frontend foundation / analysis

Scope:

- chiarire UX/API del collegamento UserAccount <-> Employee;
- gestire casi di account non collegati a Employee;
- valutare se nome/cognome debbano restare solo su Employee o se serva una modellazione separata per account non-employee.

Decisione:

- `UserAccount` resta il boundary di identita applicativa, login, email, stato account, tenant access e ruoli;
- `Employee` resta il boundary anagrafico HR;
- il collegamento `UserAccount.employee` e opzionale;
- account senza Employee collegato sono validi e usano fallback email / tipo account in UI e API amministrative;
- `firstName` e `lastName` non vengono duplicati su `UserAccount`;
- nessuna migration automatica o refactoring strutturale viene introdotto da questo task.

Implementato:

- confermata relazione nullable esistente `user_accounts.employee_id` verso `employees.id`;
- estesi i DTO amministrazione utenti con `employeeId`, `employeeDisplayName` e `hasEmployeeLink`;
- mantenuto `displayName` derivato da Employee quando presente e fallback email quando assente;
- aggiornata UI lista/dettaglio utenti per mostrare esplicitamente account collegato/non collegato a Employee;
- aggiornati testi i18n `it`/`fr`/`en`;
- nessun campo anagrafico aggiunto a `UserAccount`, nessuna migration e nessun profilo HR avanzato.

Fuori scope:

- migration automatica senza decisione esplicita;
- duplicazione non motivata di dati anagrafici;
- profilo HR avanzato.

Validazione:

- `cd backend && .\mvnw.cmd "-Dtest=UserAdministrationControllerTests" test`;
- se frontend modificato, `cd frontend && npm.cmd run build` e `cd frontend && npm.cmd test`;
- esiti reali da registrare in `docs/qa/QA-REPORTS.md`.

### TASK-054 - Frontend permission summary and visibility UX foundation

Stato: COMPLETATO

Tipo: Frontend authorization UX

Obiettivo:

- Introdurre una foundation frontend centralizzata per permission summary e visibility UX basata sui quattro permessi CRUD standard `view/create/update/delete`.

Scope:

- recupero/sintesi permessi utente lato frontend;
- modello centralizzato per visibility UX;
- menu/sidebar visibili ma frozen quando il modulo non ha alcun permesso CRUD disponibile;
- route protette lato frontend con guard su `view/create/update`;
- bottoni e azioni CRUD abilitati/disabilitati in modo uniforme in base ai permessi del modulo;
- nessuna sicurezza reale lato frontend;
- nessuna modifica enforcement backend;
- preparazione al TASK-055.

Implementazione completata:

- aggiunti `PermissionSummaryService`, modello centralizzato `ModulePermissionSummary` e parsing frontend dei codici `SCOPE.RESOURCE.ACTION`;
- aggiunta guard frontend dedicata per route protette con redirect a `/` e warning UX quando manca il permesso richiesto;
- sidebar aggiornata per mantenere visibili le entry dei moduli applicativi e congelarle in stato disabled/frozen quando manca qualsiasi permesso CRUD;
- foundation applicata ai moduli attivi `/master-data`, `/admin/roles`, `/admin/permissions`, `/admin/users`;
- aggiunti test frontend dedicati per summary service, guard e casi CRUD/sidebar frozen;
- nessuna modifica backend; in assenza di permission summary reale in `/api/auth/me`, i moduli protetti restano frozen per design e richiedono follow-up backend in TASK-055 o task dedicato.

Fuori scope:

- enforcement backend;
- default deny server-side;
- gestione completa utenti tenant se non gia prevista;
- modifica catalogo permissions non necessaria.

### TASK-055 - Backend RBAC enforcement foundation

Stato: DONE

Tipo: Backend authorization enforcement

Obiettivo:

- Applicare enforcement RBAC reale lato backend sulle API protette.

Scope:

- enforcement reale lato backend;
- default deny sugli endpoint protetti;
- mapping endpoint/azione verso `Permission` code;
- controllo permessi del caller;
- controllo tenant/caller authorization;
- protezione endpoint admin, inclusi `/api/admin/roles` e `/api/admin/users`;
- `DELETE /api/admin/users/{userId}` come cancellazione fisica controllata;
- `PATCH /api/admin/users/{userId}/deactivate` come disattivazione utente (delete logico);
- test negativi per utente autenticato senza permessi;
- test cross-tenant;
- aggiornamento documentazione governance e QA.

Completato:

- aggiunta risoluzione backend delle authority da DB per request JWT tramite `UserTenantAccess`, `UserRole`, `RolePermission` e `Permission` attivi;
- mantenuta autenticazione JWT stateless, ma con ricalcolo server-side dei permessi del caller a ogni richiesta;
- introdotto `default deny` in `SecurityConfig` per endpoint non esplicitamente mappati;
- protetti `/api/admin/users/**`, `/api/admin/roles/**` e gli endpoint `master-data` con mapping `SCOPE.RESOURCE.ACTION`;
- protetti gli endpoint read `core-hr` gia coperti da resource approvate (`EMPLOYEE`, `CONTRACT`, `DEVICE`, `PAYROLL_DOCUMENT`, `LEAVE_REQUEST`) e negati esplicitamente gli endpoint senza resource approvata;
- introdotti controlli tenant/caller lato service per utenti e ruoli admin, con blocco cross-tenant per caller tenant e blocco gestione utenti platform da parte di tenant admin;
- riallineato `DELETE /api/admin/users/{userId}` a cancellazione fisica controllata, senza cascade delete, con `409 Conflict` se l utente e referenziato e blocco self-delete;
- aggiunto `PATCH /api/admin/users/{userId}/deactivate` per disattivazione logica (`active=false`), con blocco self-deactivate;
- aggiunti handler JSON coerenti per `401` e `403`;
- aggiornati i test backend admin/security e la suite master-data esistente al nuovo enforcement esplicito.

Nota di sicurezza:

- il backend resta il punto di enforcement reale; il frontend non sostituisce mai i controlli API.

Fuori scope:

- redesign frontend;
- nuove UI;
- nuove entita non necessarie;
- refactoring ampio non giustificato.

#### TASK-055.1 - Tenant/caller authorization hardening for admin role endpoints

Stato: DONE

Tipo: Backend authorization hardening

Scope:

- completare controlli tenant/caller sugli endpoint `/api/admin/roles`;
- impedire accessi admin cross-tenant non autorizzati anche con payload/query manipolati;
- introdurre test negativi dedicati sui casi tenant mismatch e caller senza permessi.

Esito:

- completato dentro TASK-055;
- i controlli tenant/caller sono stati applicati sia a `/api/admin/roles` sia a `/api/admin/users`;
- mantenuto come riferimento storico ma assorbito dalla foundation enforcement.

Fuori scope:

- redesign contratti UI;
- nuove feature amministrative non richieste da enforcement;
- refactor esteso fuori dal perimetro authorization.

### TASK-056 - Shared confirmation dialog foundation

Stato: DONE

Tipo: Frontend shared UX foundation

Obiettivo:

- Introdurre un componente shared Angular per popup di conferma si/no da riusare nelle azioni critiche, ad esempio disattivazione o cancellazione record.

Scope:

- creare un componente shared di conferma, ad esempio `ConfirmDialogComponent`;
- usare il mockup Stitch fornito come riferimento UX;
- supportare almeno:
  - titolo;
  - messaggio;
  - label pulsante conferma;
  - label pulsante annulla;
  - variante/severita, ad esempio info/warning/danger;
  - stato loading durante conferma, se utile;
- integrare il componente con il componente shared DataTable esistente;
- permettere alle row actions critiche/distruttive del DataTable di richiedere conferma prima di emettere l azione;
- applicare il popup alle tabelle esistenti che usano il DataTable shared, dove sono presenti azioni come elimina, cancella definitivamente o disattiva;
- aggiornare i18n `it`/`fr`/`en`;
- aggiungere test frontend minimi.

Vincoli:

- nessun redesign generale;
- nessuna duplicazione di popup per singola feature;
- nessuna nuova tabella;
- riusare pattern e stile esistenti;
- non introdurre librerie esterne se non necessarie;
- mantenere compatibilita con le row actions gia esistenti;
- non modificare backend;

Validazione:

- `ConfirmDialogComponent` shared introdotto con varianti `info`/`success`/`warning`/`danger`/`error`, target opzionale e modalita `message` per popup di errore applicativo.
- `DataTableComponent` esteso con configurazione `confirmation` sulle row actions e supporto a target dinamico da riga.
- popup applicato alle tabelle shared di Master Data, Role Administration e User Administration senza duplicare logiche di conferma nelle feature.
- i18n `it`/`fr`/`en` e test frontend aggiornati con esito verde su `npm.cmd run build` e `npm.cmd test`.

Fuori scope:

- workflow approvativi;
- modali form complesse;
- bulk confirmation;
- redesign completo DataTable;
- modifiche backend.

### TASK-057 - Finalize ZIP import foundation and test isolation

Stato: DONE

Tipo: Backend technical debt

Obiettivo:

- migliorare e finalizzare la foundation di import ZIP/CAP gia esistente, riducendo side effect e impatto improprio sulla suite di test backend.

Scope:

- analizzare perche alcuni test o bootstrap attivano insert/select massivi su `global_zip_codes`;
- isolare meglio i side effect non pertinenti nelle suite tecniche;
- mantenere invariato il comportamento runtime applicativo salvo correzioni mirate e autorizzate;
- migliorare osservabilita, gating o test ergonomics dell import ZIP foundation.

Esito:

- lo scope principale e gia stato coperto dal commit `f9963b9` (`test: make Italian ZIP import tests lightweight`), verificato come patch limitata ai test backend;
- `ItalianZipCodeImportServiceTests` non usa piu il CSV completo da `8465` righe e lavora su fixture CSV piccola in memoria da `3` righe;
- `MasterDataGlobalControllerTests` isola l import ZIP tramite `@MockitoBean ItalianZipCodeImportService` e non attiva piu l import reale del CSV di default;
- non risultano bootstrap o test aggiuntivi che attivino import massivi automatici su `global_zip_codes`;
- il comportamento runtime applicativo e rimasto invariato: `ItalianZipCodeImportService`, `MasterDataGlobalService` e gli endpoint dedicati continuano a usare il CSV reale solo su invocazione esplicita.

Validazione:

- ricerca repository su `ItalianZipCodeImportService`, `importDefaultCsv`, `analyzeDefaultCsv`, `global_zip_codes`, `italy-zip-codes.csv`, `8465`;
- review del commit `f9963b9` e confronto con lo stato corrente dei test backend;
- eseguito `cd backend && .\\mvnw.cmd -Dtest=ItalianZipCodeImportServiceTests,MasterDataGlobalControllerTests test` con `BUILD SUCCESS`.

Fuori scope:

- modifica del perimetro funzionale di TASK-053.2;
- redesign del modello ZIP globale;
- introduzione di logiche permessi utenti/ruoli.

### TASK-058 - Riorganizzazione documentale backlog post TASK-057

Stato: TODO

Obiettivo:

- riallineare la pianificazione backlog dopo TASK-057 con numerazione coerente e riferimenti aggiornati.

Include:

- aggiornamento coordinato di `TASKS.md` e `ROADMAP.md`;
- verifica riferimenti incrociati e range fasi;
- conferma assenza di riferimenti incoerenti alla numerazione precedente.

### TASK-059 - Master Data CRUD completion

Stato: DONE

Include:

- analisi delle entità Master Data esistenti;
- verifica delle azioni CRUD disponibili a livello tabella/frontend;
- verifica degli endpoint backend CRUD mancanti;
- completamento del delete fisico solo dove esplicitamente richiesto;
- mantenimento della disattivazione logica gia esistente;
- rispetto dei pattern esistenti per Master Data, DataTable, i18n, RBAC/authorities e permessi.

Completato:

- confermato che backend entity, repository, DTO request/response, service, controller ed endpoint CRUD soft-delete erano gia presenti per `EmploymentStatus`, `LeaveRequestType`, `DocumentType`, `DeviceType`, `DeviceBrand` e `DeviceStatus`;
- aggiunti backend repository checks, service methods ed endpoint `DELETE {id}/physical` per `EmploymentStatus`, `LeaveRequestType`, `DocumentType`, `DeviceType`, `DeviceBrand` e `DeviceStatus`;
- mantenuto il pattern esistente con `404` su record assente, `409 Conflict` su record referenziato e fallback `DataIntegrityViolationException -> 409`;
- verificato il mapping reale dei riferimenti business: `Employee.employmentStatus` come string code tenant-scoped, `LeaveRequest.leaveRequestType`, `PayrollDocument.documentType`, `Device.type`, `Device.brand`, `Device.deviceStatus` come FK;
- abilitati in UI Master Data form create/edit/view e row actions `view/edit/disattiva/elimina` per le sei entita richieste, riusando `DataTableComponent`, `MasterDataFormComponent`, `deletePhysicalRow(...)` e confirmation dialog shared;
- aggiornato il messaggio i18n `masterData.deletePhysical.confirmMessage` in `it/fr/en` per chiarire che l eliminazione e permanente e consentita solo se il record non e collegato a dati business;
- confermati permessi/authorities esistenti `TENANT.MASTER_DATA.DELETE|MANAGE` e `PLATFORM.MASTER_DATA.DELETE|MANAGE` per entrambe le azioni distruttive, senza introdurre nuovi permission code o migration;
- rimandata la standardizzazione del campo `code` a follow-up dedicato `TASK-059.1`.

Validazione:

- backend test mirato `cd backend && .\mvnw.cmd -Dtest=MasterDataHrBusinessControllerTests test` OK, 16 test, 0 failure, 0 error, 0 skipped;
- backend test completo `cd backend && .\mvnw.cmd test` OK, 189 test, 0 failure, 0 error, 0 skipped;
- frontend build `cd frontend && npm.cmd run build` OK;
- frontend test completo `cd frontend && npm.cmd test` OK, 30 file test, 202 test passed.

### TASK-059.1 - Standardizzare code Master Data HR/business

Stato: DONE

Include:

- rendere `code` non editabile da UI per `EmploymentStatus`, `LeaveRequestType`, `DocumentType`, `DeviceType`, `DeviceBrand`, `DeviceStatus`;
- generare `code` automaticamente lato backend;
- formato `prefisso 2 lettere + progressivo 3 cifre`;
- prefissi proposti: `ES`, `LR`, `DT`, `DV`, `DB`, `DS`;
- analisi impatto su dati esistenti, API, UI e riferimenti business prima di ogni rollout.

Completato:

- introdotto DTO backend dedicato senza campo `code` per create/update delle 6 entita (`TenantMasterDataAutoCodeRequest`);
- aggiornati controller e service HR/business per usare auto-code lato backend su `EmploymentStatus`, `LeaveRequestType`, `DocumentType`, `DeviceType`, `DeviceBrand`, `DeviceStatus`;
- implementata generazione `code` con formato `PPNNN` (`prefix 2 lettere + progressivo 3 cifre`) calcolando il massimo progressivo per tenant/entita/prefisso e incrementando di 1;
- mantenuta assenza di tabella contatori, con gestione collisioni tramite vincolo unique esistente e messaggio di conflitto chiaro;
- resa immutabile la modifica manuale del `code` sulle 6 entita in update (il codice esistente viene preservato);
- aggiunta migration Flyway `V21` per PostgreSQL e H2 per migrare i codici esistenti delle 6 entita al nuovo formato (`ES/LR/DT/DV/DB/DS` + progressivo), sostituendo i codici seed storici;
- incluso mapping `employees.employment_status` da vecchio codice a nuovo codice per tenant nella migration;
- frontend `/master-data` aggiornato per non inviare `code` alle 6 entita auto-code e per mostrare `code` in sola lettura in edit/view (non editabile);
- mantenuti invariati scope security/tenant/RBAC e pattern shared esistenti (`DataTable`, form metadata-driven, i18n `it/fr/en`).

Validazione:

- backend test completo `cd backend && .\mvnw.cmd test` OK, 189 test, 0 failure, 0 error, 0 skipped;
- backend test mirato `cd backend && .\mvnw.cmd "-Dtest=MasterDataHrBusinessControllerTests,HrmBackendApplicationTests" test` OK, 70 test, 0 failure, 0 error, 0 skipped;
- frontend build `cd frontend && npm.cmd run build` OK;
- frontend test completo `cd frontend && npm.cmd test -- --watch=false` OK, 30 file test, 203 test passed.

### TASK-059.2 - Estendere code automatico ai restanti Master Data

Stato: DONE

Include:

- estendere `code` automatico alle restanti entita Master Data HR/business non ancora coperte da TASK-059.1:
  - `Department`
  - `JobTitle`
  - `ContractType`
  - `WorkMode`;
- rendere `code` non editabile da UI anche per queste entita;
- usare lo stesso pattern backend (`prefisso 2 lettere + progressivo 3 cifre`) e la stessa strategia senza tabella contatori;
- valutare e pianificare migrazione dei codici esistenti e impatto sui riferimenti business prima del rollout.

Completato:

- esteso il DTO backend `TenantMasterDataAutoCodeRequest` anche a `Department`, `JobTitle`, `ContractType` e `WorkMode`, rimuovendo il `code` dal contratto applicativo di create/update per queste 4 entita;
- aggiornati controller e service HR/business per usare auto-code lato backend su `Department`, `JobTitle`, `ContractType` e `WorkMode`;
- applicati i prefissi `DE`, `JO`, `CO`, `WO` con progressivo a 3 cifre, riusando il pattern esistente tenant-scoped basato sul massimo progressivo per entita/prefisso, senza tabella contatori;
- preservato il `code` esistente in update per tutte le 4 entita e mantenuta la gestione collisioni tramite vincolo unique esistente e messaggio di conflitto chiaro;
- aggiunta migration Flyway `V22` per PostgreSQL e H2 per normalizzare i codici esistenti di `departments`, `job_titles`, `contract_types` e `work_modes`;
- verificato prima della migration che `employees.department`, `employees.job_title`, `employees.contract_type` e `employees.work_mode` sono usati dal codice come riferimenti stringa ai `code` Master Data quando coerenti, ma non hanno FK hard-enforced;
- implementato quindi aggiornamento condizionale di `employees.*` solo quando il valore corrente coincide con un `old_code` reale della rispettiva tabella per lo stesso tenant; eventuali valori descrittivi o free-text non vengono modificati;
- confermato nel repository corrente che non esistono seed iniziali per `Department`, `JobTitle` e `ContractType`, mentre `WorkMode` ha seed storici migrati al nuovo formato in `V22`;
- frontend `/master-data` aggiornato per rendere `code` non editabile anche per `Department`, `JobTitle`, `ContractType` e `WorkMode`, riusando il pattern `autoCode` e il form shared metadata-driven;
- aggiornati test backend/frontend per coprire create auto-code, update con `code` preservato, migration seed `WorkMode`, payload UI senza `code` e visibilita del campo in sola lettura.

Validazione:

- backend test mirato `cd backend && .\mvnw.cmd "-Dtest=MasterDataHrBusinessControllerTests,HrmBackendApplicationTests" test` OK, 71 test, 0 failure, 0 error, 0 skipped;
- backend test completo `cd backend && .\mvnw.cmd test` OK, 190 test, 0 failure, 0 error, 0 skipped;
- frontend test completo `cd frontend && npm.cmd test -- --watch=false` OK, 30 file test, 204 test passed;
- frontend build `cd frontend && npm.cmd run build` OK.

### TASK-059.3 - Analisi Governance/security Master Data, interfacce Sicurezza e gestione codice

Stato: TODO

Include:

- analizzare le entita Governance/security:
  - `UserType`
  - `AuthenticationMethod`
  - `Role`
  - `Permission`
  - `AuditActionType`
  - `DisciplinaryActionType`
  - `SmtpEncryptionType`
  - `CompanyProfileType`
  - `OfficeLocationType`;
- verificare duplicazioni tra Master Data generica e UI Sicurezza;
- classificare il tipo di `code`:
  - tecnico
  - semantico
  - visuale/anagrafico
  - authority;
- valutare il rischio di modifica del `code`;
- definire quali entita devono restare nella Master Data generica;
- definire quali entita devono essere escluse dalla Master Data generica;
- definire quali entita devono essere read-only;
- definire quali entita possono usare auto-code `PPNNN`;
- documentare rischi su RBAC, authorities, seed, audit, tenant, utenti, ruoli custom, migrazioni e test.

Decisione attesa:

- `Role` e `Permission` non devono restare come anagrafiche editabili nella Master Data generica;
- `AuditActionType` e tecnico e non deve essere gestito dalla Master Data generica;
- `CompanyProfileType`, `OfficeLocationType`, `DisciplinaryActionType` sono candidati per auto-code futuro;
- `UserType`, `AuthenticationMethod`, `SmtpEncryptionType` devono mantenere codici tecnici stabili.

### TASK-059.4 - Razionalizzazione Governance/security Master Data UI e auto-code selettivo

Stato: DONE

Include:

- rimuovere/nascondere dalla UI Master Data generica:
  - `Role`
  - `Permission`
  - `AuditActionType`;
- lasciare visibili nella Master Data generica, senza auto-code:
  - `UserType`
  - `AuthenticationMethod`
  - `SmtpEncryptionType`;
- applicare auto-code `PPNNN` a:
  - `CompanyProfileType` con prefisso `CP`;
  - `OfficeLocationType` con prefisso `OL`;
  - `DisciplinaryActionType` con prefisso `DA`;
- rendere `code` non editabile da UI per le entita con auto-code;
- nascondere sempre dalla tabella Master Data generica le colonne:
  - `tenant`
  - `tenantId`
  - `tenantName`;
- non modificare `Role.code`, `Permission.code`, `UserType.code`, `AuthenticationMethod.code`, `SmtpEncryptionType.code`, `AuditActionType.code`;
- non modificare seed tecnici, RBAC, authorities o tenant isolation fuori scope;
- aggiornare test backend/frontend mirati;
- aggiornare `TASKS.md`, `ROADMAP.md` e `docs/qa/QA-REPORTS.md` a completamento task.

Note:

- `Role` resta gestito solo sotto UI Sicurezza `/admin/roles`;
- `Permission` resta gestito solo tramite matrice/catalogo permessi sotto Sicurezza;
- `AuditActionType` resta tecnico per audit log;
- eventuali viste Platform Admin / Owner Platform con filtro tenant saranno gestite in task separato.

Completato:

- verificata la configurazione reale della Master Data UI generica Governance/security, confermando che `Role`, `Permission` e `AuditActionType` erano ancora esposti nel selettore generico mentre `UserType`, `AuthenticationMethod`, `SmtpEncryptionType`, `CompanyProfileType`, `OfficeLocationType` e `DisciplinaryActionType` restavano disponibili;
- verificato il pattern auto-code gia introdotto in `TASK-059.1` e `TASK-059.2` e riusato lo stesso approccio backend senza architetture parallele, con generazione `prefisso + progressivo 3 cifre` e preservazione del `code` in update;
- verificato lo scope reale delle entita: `CompanyProfileType` e `OfficeLocationType` tenant-scoped, `DisciplinaryActionType` global-scoped;
- rimossi dalla Master Data UI generica `Role`, `Permission` e `AuditActionType`, lasciando visibili senza auto-code `UserType`, `AuthenticationMethod` e `SmtpEncryptionType`;
- applicato auto-code backend a `CompanyProfileType` (`CP`), `OfficeLocationType` (`OL`) e `DisciplinaryActionType` (`DA`) per i nuovi record, preservando sempre il `code` in update e senza riscrivere seed tecnici fuori scope;
- aggiornato il contratto create/update backend per le tre entita auto-code usando DTO senza `code`, con `code` sempre preservato in update;
- aggiunta la migration `V23` PostgreSQL/H2 per riallineare in modo deterministico i record gia esistenti di `CompanyProfileType`, `OfficeLocationType` e `DisciplinaryActionType` ai formati `CPNNN`, `OLNNN` e `DANNN`, ordinando per `created_at`, poi `id` e lasciando invariati gli altri codici Governance/security fuori scope;
- completata la cancellazione fisica backend per `CompanyProfileType`, `OfficeLocationType` e `DisciplinaryActionType` con endpoint `/physical`, controlli di referenza coerenti con scope e FKs esistenti e conflitto `409` quando il record e referenziato;
- resa non editabile da UI la proprieta `code` solo per `CompanyProfileType`, `OfficeLocationType` e `DisciplinaryActionType`, riusando i metadata form condivisi;
- nascosta in modo generale dalla tabella Master Data generica la visualizzazione delle colonne `tenant`, `tenantId` e `tenantName`, senza modificare il componente tabellare shared;
- aggiunta nella Master Data UI generica l icona delete con conferma e refresh tabella per `CompanyProfileType`, `OfficeLocationType` e `DisciplinaryActionType`, riusando il pattern gia adottato per i Master Data HR/business;
- aggiornati test backend/frontend mirati per auto-code Governance/security, riallineamento dati, visibilita entita, payload UI, colonne tecniche e cancellazione fisica.

Validazione:

- backend test mirato `cd backend && .\mvnw.cmd "-Dtest=MasterDataGovernanceSecurityControllerTests,HrmBackendApplicationTests" test` OK, 70 test, 0 failure, 0 error, 0 skipped;
- backend test regressione HR/business `cd backend && .\mvnw.cmd "-Dtest=MasterDataHrBusinessControllerTests" test` OK, 16 test, 0 failure, 0 error, 0 skipped;
- backend test completo `cd backend && .\mvnw.cmd test` OK, 196 test, 0 failure, 0 error, 0 skipped;
- frontend build `cd frontend && npm.cmd run build` OK;
- frontend test completo `cd frontend && npm.cmd test -- --watch=false` OK, 30 file test, 211 test passed.

### TASK-060 - Verifica uso tecnico codice ruolo e strategia codice autogenerato

Stato: DONE

Decisione adottata:

- `Role.code` non e usato come authority runtime; l enforcement backend usa `permission.code` risolto via `RolePermission`.
- i ruoli di sistema seedati mantengono il codice semantico esistente, ad esempio `TENANT_ADMIN`, `HR_MANAGER`, `SUPERVISOR`;
- i ruoli custom creati da UI/API generano automaticamente `Role.code` con formato tenant-scoped `RO001`, `RO002`, `RO003`, ...;
- il codice resta visibile in lista/dettaglio;
- il codice non e editabile;
- il create form `/admin/roles` non espone piu il campo `code`;
- edit/view mantengono `code` in sola lettura;
- non viene introdotto alcun campo `businessCode`.

Implementazione:

- aggiornato `RoleAdministrationService` per ignorare il vecchio input `code` in creazione e generare il prossimo progressivo `RO###` per tenant;
- mantenuto il vincolo unico `(tenant_id, code)` e la gestione collisioni tramite vincolo DB con errore applicativo coerente;
- confermato che l update ruolo non modifica il codice;
- aggiornato `RoleAdministrationRoleCreateRequest` rimuovendo `code`;
- aggiornati test backend per coprire:
  - creazione senza `code`;
  - primo codice `RO001`;
  - progressivo successivo corretto;
  - isolamento tenant del progressivo;
  - protezione dei ruoli di sistema;
- aggiornato frontend role administration per:
  - rimuovere `code` dal payload create;
  - rimuovere `code` dal form di creazione;
  - mantenere `code` visibile in tabella;
  - mantenere `code` read-only in edit/view;
- aggiornati i test frontend collegati al payload create.

Validazione:

- analisi confermata: `Role.code` non governa autorizzazioni runtime; le autorizzazioni backend restano basate su `permission.code`;
- backend test mirato `cd backend && .\mvnw.cmd -Dtest=RoleAdministrationControllerTests test` OK, 22 test, 0 failure, 0 error, 0 skipped;
- backend test completo `cd backend && .\mvnw.cmd test` OK, 197 test, 0 failure, 0 error, 0 skipped;
- frontend build `cd frontend && npm.cmd run build` OK;
- frontend test completo `cd frontend && npm.cmd test -- --watch=false` OK, 30 file test, 212 test passed.

### TASK-061 - i18n alert/messages consistency check

Stato: DONE

Include:

- revisione messaggi alert/error/success/warning;
- verifica i18n italiano/francese/inglese;
- rimozione stringhe hardcoded in componenti/template;
- controllo fallback lingua;
- test frontend/build;
- validazione manuale minima con cambio lingua in UI.

Nota avanzamento:

- fallback raw da API rimosso dalle notifiche frontend coinvolte e sostituito con risoluzione i18n controllata;
- spostati in i18n gli `aria-label` hardcoded del footer login;
- `cd frontend && npm.cmd run build` OK;
- `cd frontend && npm.cmd test -- --watch=false` OK;
- avvio locale frontend verificato con risposta HTTP `200`;
- QA manuale browser completata con cambio lingua `it` / `fr` / `en`;
- nessuna regressione rilevata;
- TASK-061 completato.

### TASK-062 - Address geography model decision

Stato: DONE

Tipo: Documentale / decisionale

Obiettivo:

Formalizzare la decisione sul modello geografico indirizzi prima di procedere con il backend geography e prima della UI Employee management.

Decisione da documentare:

- `Country` resta globale.
- `Region` e `Area` restano due tabelle distinte.
- `Area` continua a dipendere da `Region`.
- `Region` diventa tenant-scoped e collegata a `Country`.
- `Area` diventa tenant-scoped e collegata a `Country` + `Region`.
- ZIP/CAP usa un modello ibrido:
  - Italia: record globali/importati, `tenant_id` NULL;
  - Paesi diversi da Italia: record creati manualmente dal tenant, `tenant_id` valorizzato.
- `City` non diventa tabella separata per ora.
- `City` resta attributo del record ZIP/CAP.
- Deve essere possibile avere piu city per lo stesso CAP.
- La chiave unica non deve essere solo `postal_code`.
- Unique suggerite:
  - record globali: `country_id + postal_code + city` con `tenant_id` NULL;
  - record tenant: `tenant_id + country_id + postal_code + city`.
- Per Italia:
  - l'utente seleziona il CAP da dataset globale;
  - city, area/provincia e region/regione sono ricavate dal CAP;
  - i campi derivati vengono visualizzati readonly/freeze nella UI.
- Per paesi diversi da Italia:
  - il tenant crea manualmente Region, Area e ZIP/CAP;
  - ZIP/CAP contiene city e riferimenti a Country, Region e Area;
  - i dati sono riutilizzabili nei successivi Employee e OfficeLocation.

Vincoli:

- solo documentazione e decisione;
- nessuna migration;
- nessuna modifica backend/frontend;
- nessun test modificato;
- nessuna implementazione UI Employee.

Output atteso:

- decisione architetturale tracciata in `DECISIONS.md`;
- backlog aggiornato con TASK-063 backend foundation e TASK-065 Employee UI;
- eventuali impatti su `ARCHITECTURE.md` demandati al task tecnico/documentale successivo se il backend foundation richiede dettaglio strutturale aggiuntivo.

Completato:

- decisione architetturale formalizzata in `DECISIONS.md` tramite `DEC-038`;
- confermata la sequenza corretta:
  - `TASK-063` backend geography foundation;
  - `TASK-065` Employee UI;
- nessun codice introdotto;
- nessuna migration introdotta;
- nessun test modificato;
- nessuna UI Employee implementata.

### TASK-063 - Address geography backend foundation

Stato: DONE

Tipo: Backend foundation completato

Prerequisiti:

- TASK-062 completato.

Obiettivo:

Implementare la foundation backend del modello geografico indirizzi approvato in TASK-062.

Include:

- migration DB;
- aggiornamento entity `Region` / `Area` / `GlobalZipCode` o eventuale `ZipCode`;
- tenant scope per `Region` e `Area`;
- supporto `tenant_id` nullable sui CAP se si conferma la tabella ibrida;
- aggiornamento repository/service/API;
- aggiornamento test backend;
- verifica impatto su:
  - `Employee`;
  - `OfficeLocation`;
  - `HolidayCalendar`;
  - Master Data globali.

Vincoli:

- non introdurre `City` come tabella separata;
- non implementare UI Employee;
- non introdurre modelli geografici paralleli;
- mantenere coerenza con `DECISIONS.md` e con la governance tenant-aware esistente.

Completato:

- migration Flyway `V24__make_address_geography_tenant_aware.sql` aggiunta per rendere tenant-aware `Region` e `Area`, aggiungere `tenant_id` nullable e `tenant_scope_key` a `global_zip_codes`, preservando il modello ibrido DEC-038;
- migration vendor-specific `V25__add_address_geography_tenant_unique_indexes.sql` aggiunta per PostgreSQL e H2 con unique index coerenti su `Region`, `Area` e ZIP/CAP ibridi senza introdurre tabelle parallele;
- entity `Region` e `Area` allineate a `BaseTenantMasterEntity` con `tenantId` obbligatorio e unique tenant-scoped;
- entity `GlobalZipCode` estesa con `tenantId` nullable e chiave di scope tecnica per garantire univocita cross-db del modello globale/tenant-specific;
- repository, service, DTO e API global master data aggiornati con `tenantId` esplicito per `Region`/`Area`, filtro opzionale per liste geography e supporto ZIP/CAP ibridi globali + tenant-specific;
- import ZIP italiani mantenuto globale (`tenantId = null`) e reso coerente con il nuovo modello;
- verificato l impatto su `Employee`, `OfficeLocation`, `HolidayCalendar` e Master Data globali senza introdurre refactor o UI fuori scope;
- test backend aggiornati per migration/model, tenant scope geography, ZIP/CAP ibridi e regressioni foundation.

Test eseguiti:

- `cd backend && .\mvnw.cmd -Dtest=ItalianZipCodeImportServiceTests,MasterDataGlobalControllerTests test` -> `BUILD SUCCESS`;
- `cd backend && .\mvnw.cmd -Dtest=HrmBackendApplicationTests test` -> `BUILD SUCCESS`, dopo riallineamento dei fixture foundation a `tenantId`;
- `cd backend && .\mvnw.cmd test` -> `BUILD SUCCESS`, `201` test, `0` failure, `0` error, `0` skipped.

Nota architetturale:

`DEC-038` resta invariata. Il task consolida il backend geography tenant-aware senza introdurre `City`, senza frontend e senza cambiare il modello Employee oltre alla compatibilita con i riferimenti geography esistenti.

### TASK-064 - Tenant CRUD Administration and backlog reorganization

Stato: IN_PROGRESS

Tipo: Full-stack administration CRUD + backlog governance

Obiettivo:

Implementare la gestione CRUD dei Tenant nella piattaforma HRM, riusando il modello tenant-aware esistente e aggiornando la documentazione di backlog con la nuova numerazione.

Include:

- riorganizzazione numerazione task in `TASKS.md`;
- aggiornamento coerente `ROADMAP.md`;
- analisi del modello `Tenant` esistente;
- backend CRUD Tenant Administration platform-only;
- DTO request/response coerenti con i pattern esistenti;
- validazioni minime su `code`, `name`, `legalName`, `defaultCountry`, `defaultCurrency`;
- gestione `active/inactive` coerente con il modello esistente;
- API REST tenant administration sotto `/api/admin/tenants`;
- frontend Angular per lista Tenant;
- frontend Angular per creazione/modifica/dettaglio Tenant;
- azioni activate/deactivate/delete coerenti con i pattern esistenti;
- riuso di `DataTableComponent`, dialog conferma e pattern CRUD administration esistenti;
- i18n `it`/`fr`/`en` per tutti i testi UI;
- aggiornamento catalogo permissions/authorities e matrice ruoli se necessario;
- test backend;
- build/test frontend;
- aggiornamento `docs/qa/QA-REPORTS.md`.

Vincoli:

- non introdurre un modello `Tenant` parallelo;
- non modificare la governance tenant-aware fuori scope;
- non modificare `SecurityConfig` o login salvo reale necessità documentata per il nuovo endpoint mapping;
- non introdurre billing, subscription, piani commerciali o onboarding tenant completo;
- non duplicare componenti tabellari frontend;
- non introdurre redesign UI;
- rispettare i pattern CRUD già presenti;
- rispettare i18n frontend;
- rispettare il principio tenant-aware già esistente;
- il CRUD Tenant resta platform-only;
- il delete fisico segue la policy già documentata: hard delete controllato separato da activate/deactivate, con blocco su tenant referenziati;
- non fare commit.

Prerequisiti:

- TASK-055 completato per enforcement RBAC backend sugli endpoint admin;
- TASK-056 completato per riuso del confirmation dialog frontend.

Follow-up subtask pianificati (post TASK-064):

### TASK-064.1 - Tenant UI naming and layout refinement

Stato: DONE

Obiettivo:

- mostrare `legalName` come `Nome gruppo` / `Group name` / `Nom du groupe`;
- valutare se modificare solo label/i18n frontend o anche DTO;
- correggere layout tabella Tenant spostata a destra;
- allineare layout a Master Data, Ruoli e Utenti;
- eseguire test/build frontend.

Validazione:

- label `legalName` riallineata lato frontend/i18n come `Nome gruppo` / `Group name` / `Nom du groupe`, mantenendo invariati DTO e API;
- layout pagina Tenant Administration riallineato ai pattern lista gia usati in Master Data, Ruoli e Utenti;
- causa del disallineamento identificata nel layout locale della card lista Tenant, che applicava padding attorno alla tabella shared;
- test e build frontend eseguiti con esito reale registrato in `docs/qa/QA-REPORTS.md`.

### TASK-064.2 - Tenant automatic code generation

Stato: DONE

Obiettivo:

- rendere `code` Tenant automatico e non editabile;
- formato `TE001`, `TE002`, `TE003`;
- generazione codice lato backend;
- UI senza editing manuale del codice;
- test backend/frontend.

Validazione:

- `Tenant.code` viene generato lato backend in create con prefisso globale `TE` e progressivo a 3 cifre;
- il payload create non richiede piu `code` e un eventuale `code` manuale extra viene ignorato coerentemente con i pattern gia adottati;
- l update Tenant preserva sempre il `code` esistente senza rigenerarlo o accettarne la modifica manuale;
- la UI Tenant non permette piu l editing del `code`: il campo e nascosto in create e mostrato read-only in edit/view;
- test backend dedicati Tenant Administration aggiornati per create auto-code, progressivo corretto, update stabile e payload manuale ignorato;
- build/test frontend e test backend reali eseguiti con esito registrato in `docs/qa/QA-REPORTS.md`.

### TASK-064.3 - Automatic code standard for future entities

Stato: TODO

Obiettivo:

- documentare lo standard: ogni nuova entita con campo `code` deve usare codice automatico;
- formato: prime due lettere entita + progressivo a 3 cifre;
- eccezioni ammesse solo se documentate.

### TASK-064.4 - Company Profile fiscal fields

Stato: TODO

Obiettivo:

- aggiungere `taxNumber` su `CompanyProfile`;
- usare label/traduzioni generiche per `it`/`fr`/`en`;
- aggiungere campi Italia-specifici `pecEmail` e `sdiCode`;
- copertura migration/entity/DTO/test;
- non inserire questi dati su `Tenant`.

### TASK-064.5 - Company Profile Administration UI foundation

Stato: TODO

Obiettivo:

- creare UI amministrativa `CompanyProfile`;
- lista/dettaglio/modifica;
- relazione con `Tenant`;
- gestione campi esistenti e predisposizione campi fiscali;
- i18n `it`/`fr`/`en`;
- riuso componenti shared.

### TASK-065 - Implementare UI Employee management enterprise

Stato: TODO

Prerequisiti:

- TASK-062 completato;
- TASK-063 completato.

Nota:

La UI Employee deve usare il modello geografico indirizzi stabilizzato prima di implementare form, select, readonly/freeze fields e riuso dei dati geografici per Employee.

### TASK-066 - Implementare Security Admin UI

Stato: TODO

Include:

- utenti;
- MFA;
- tenant access;
- ruoli;
- permessi.

### TASK-067 - Implementare UI Device governance

Stato: TODO

### TASK-068 - Implementare UI PayrollDocument

Stato: TODO

### TASK-069 - Implementare UI LeaveRequest

Stato: TODO

### TASK-070 - Implementare UI HolidayCalendar

Stato: TODO

### TASK-071 - Implementare Audit UI / compliance explorer

Stato: TODO

### TASK-072 - Implementare UI disciplinary governance

Stato: TODO

## FASE 2G - PLATFORM OPERATIONS

### TASK-073 - Implementare Platform Operator / Super Admin governance

Stato: TODO

### TASK-074 - Implementare Cross-tenant admin UI

Stato: TODO

## FASE 3 - STABILIZATION

### TASK-075 - Configurare logging, monitoring e observability enterprise

Stato: TODO

### TASK-076 - Test integrato MVP enterprise completo

Stato: TODO

---

## 6. Cronologia versioni

| Versione | Data | Descrizione |
|---|---|---|
| 2.40 | 2026-05-13 | TASK-064.2 completato: `Tenant.code` ora viene autogenerato lato backend come `TE###`, la UI Tenant non consente piu editing manuale del codice, test backend/frontend reali rieseguiti e QA report aggiornato. |
| 2.39 | 2026-05-13 | TASK-064.1 completato: label utente `legalName` riallineata a `Nome gruppo` / `Group name` / `Nom du groupe`, layout Tenant Administration allineato a Master Data/Ruoli/Utenti con patch frontend-only, test/build frontend e QA report aggiornati. |
| 2.38 | 2026-05-13 | TASK-064 aggiornato con sezione follow-up subtask pianificati (`TASK-064.1`..`TASK-064.5`) per naming/layout Tenant UI, auto-code Tenant, standard auto-code futuro, campi fiscali `CompanyProfile` e foundation UI CompanyProfile; nessuna modifica runtime in questo passaggio. |
| 2.37 | 2026-05-13 | TASK-063 completato: introdotta la foundation backend geography tenant-aware conforme a `DEC-038` con migration Flyway `V24`/`V25`, `Region` e `Area` tenant-scoped, modello ZIP/CAP ibrido su `global_zip_codes`, test backend reali verdi e prossimo passo riallineato a `TASK-065` Employee UI. |
| 2.36 | 2026-05-13 | TASK-062 chiuso come DONE documentale: formalizzata la decisione architetturale sul modello geografico tramite `DEC-038`, confermato che il task non introduce codice, migration, test o UI e mantenuta la sequenza `TASK-063` backend foundation -> `TASK-065` Employee UI. |
| 2.35 | 2026-05-13 | Inseriti TASK-062 Address geography model decision e TASK-063 Address geography backend foundation prima della UI Employee; l'ex TASK-062 Employee UI slitta a `TASK-065`, poi il nuovo `TASK-064` Tenant CRUD Administration and backlog reorganization anticipa il blocco applicativo successivo e la numerazione viene riallineata fino a `TASK-076`. |
| 2.34 | 2026-05-12 | TASK-060 completato: `Role.code` resta semantico solo per i ruoli seed di sistema, mentre i ruoli custom tenant usano auto-code `RO###` generato lato backend; create senza campo `code`, edit/view read-only, test backend/frontend reali verdi e nessun `businessCode` introdotto. |
| 2.33 | 2026-05-12 | Ricostruito `TASK-060` come task documentale separato prima di `TASK-061` per analizzare l'uso tecnico di `Role.code` e definire la strategia corretta tra codice tecnico, auto-code business/UI o separazione dei due concetti, senza modifiche runtime in questa fase. |
| 2.32 | 2026-05-12 | TASK-061 completato: confermata coerenza i18n dei messaggi alert/error/success/warning con rimozione dei fallback raw backend e degli `aria-label` hardcoded residui nel login, build/test frontend OK, frontend locale avviato OK, QA manuale browser completata con cambio lingua `it/fr/en` e nessuna regressione rilevata. |
| 2.31 | 2026-05-12 | TASK-061 portato in `IN_PROGRESS`: rimossi i fallback notifiche non localizzati da API backend, introdotta utility frontend minima per risoluzione errori i18n, spostati in i18n gli `aria-label` hardcoded del footer login, build/test frontend verdi e avvio locale HTTP `200` verificato; task non chiuso per mancanza di QA manuale browser completa in questa sessione CLI. |
| 2.30 | 2026-05-12 | TASK-059.4 completato: razionalizzata la Master Data UI Governance/security rimuovendo `Role`, `Permission` e `AuditActionType` dal selettore generico, mantenendo visibili `UserType`/`AuthenticationMethod`/`SmtpEncryptionType`, estendendo auto-code backend/UI a `CompanyProfileType`, `OfficeLocationType` e `DisciplinaryActionType`, nascondendo le colonne tecniche tenant e confermando test backend/frontend reali verdi. |
| 2.29 | 2026-05-12 | Inseriti `TASK-059.3` e `TASK-059.4` tra `TASK-059.2` e `TASK-061` per ripristinare continuita del backlog senza rinumerare i task successivi; `TASK-060` resta assente come sezione attiva e va ricostruito in task documentale separato. |
| 2.28 | 2026-05-12 | TASK-059.2 completato: esteso auto-code backend/UI a `Department`, `JobTitle`, `ContractType`, `WorkMode`, aggiunta migration V22 PostgreSQL/H2 con aggiornamento condizionale di `employees.department/job_title/contract_type/work_mode` solo quando allineati a `old_code` reali per tenant, test backend/frontend reali verdi. |
| 2.27 | 2026-05-12 | Inserito TASK-059.2 `Estendere code automatico ai restanti Master Data` e rinumerato il backlog successivo da TASK-060..TASK-072 a TASK-061..TASK-073 in coerenza con la pianificazione. |
| 2.26 | 2026-05-12 | TASK-059.1 completato: standardizzazione `code` per 6 entita HR/business con auto-generazione backend per tenant/prefisso/progressivo, `code` non editabile da UI, migration V21 PostgreSQL/H2 con re-codifica dati esistenti e mapping `employees.employment_status`, test backend/frontend reali verdi. |
| 2.25 | 2026-05-12 | TASK-059 completato nel perimetro chiarito: physical delete backend/frontend aggiunto solo per EmploymentStatus, LeaveRequestType, DocumentType, DeviceType, DeviceBrand e DeviceStatus, con reference checks, conferma condivisa, i18n aggiornato, test backend/frontend verdi e follow-up TASK-059.1 riservato alla standardizzazione futura dei code. |
| 2.24 | 2026-05-12 | TASK-059 completato: abilitato CRUD soft-delete frontend per EmploymentStatus, LeaveRequestType, DocumentType, DeviceType, DeviceBrand e DeviceStatus riusando DataTable/form/confirmation esistenti; backend CRUD gia presente confermato con test mirato e suite completa, nessuna nuova permission granulare o decisione architetturale. |
| 2.23 | 2026-05-12 | Backlog riorganizzato da TASK-058: TASK-058 riallineato come task documentale, inseriti TASK-059 (Master Data CRUD completion) e TASK-060 (i18n alert/messages consistency check), task applicativi successivi rinumerati fino a TASK-072 e riferimenti interni aggiornati in coerenza. |
| 2.22 | 2026-05-12 | TASK-057 chiuso come completato senza patch runtime: verificato che il commit `f9963b9` aveva gia isolato i test ZIP/CAP usando fixture piccola e mock nel controller, confermato che non esistono bootstrap massivi residui su `global_zip_codes`, test backend mirati verdi e prossimo passo riallineato a TASK-058. |
| 2.21 | 2026-05-12 | TASK-056 completato: introdotto `ConfirmDialogComponent` shared, esteso `DataTableComponent` con conferme dichiarative e target dinamico, migrate le conferme tabellari di Master Data / Ruoli / Utenti, aggiornati i18n `it`/`fr`/`en` e test frontend/documentazione senza modifiche backend. |
| 2.20 | 2026-05-12 | Inserito nuovo TASK-056 `Shared confirmation dialog foundation` prima del backlog applicativo successivo; l ex TASK-056 su ZIP import slitta a TASK-057 e i task successivi vengono rinumerati in modo coerente fino a TASK-072, senza modifiche a codice frontend/backend. |
| 2.19 | 2026-05-12 | TASK-055 completato: introdotto enforcement RBAC reale lato backend con authority risolte da DB per request JWT, `default deny` sugli endpoint protetti, mapping esplicito endpoint/permessi, hardening tenant/caller su `/api/admin/users` e `/api/admin/roles`, `DELETE /api/admin/users/{userId}` riallineato a hard delete controllato e nuovo `PATCH /api/admin/users/{userId}/deactivate` per disattivazione logica; test backend completi verdi e patch frontend minima allineata. |
| 2.18 | 2026-05-11 | TASK-054 completato: introdotta foundation frontend centralizzata per permission summary e visibility UX, con parsing `SCOPE.RESOURCE.ACTION`, sidebar visibile ma frozen senza permessi CRUD, guard route `view/create/update`, applicazione ai moduli `/master-data`, `/admin/roles`, `/admin/permissions`, `/admin/users`, test frontend verdi e nessuna modifica backend. |
| 2.17 | 2026-05-11 | TASK-053.9 completato: chiarito e applicato il link opzionale `UserAccount.employee`, con account validi senza Employee, fallback email/tipo account, DTO admin espliciti `employeeId`/`employeeDisplayName`/`hasEmployeeLink`, UI lista/dettaglio con stato collegato/non collegato, nessuna migration e nessuna duplicazione `firstName`/`lastName` su `UserAccount`. |
| 2.16 | 2026-05-11 | TASK-053.8 esteso con patch minima UX login: codici errore backend stabili per account inactive/locked solo dopo validazione password corretta, messaggi login i18n `Account disattivato` / `Account bloccato`, mantenuto errore generico per email inesistente o password errata, test backend/frontend completi verdi. |
| 2.15 | 2026-05-11 | TASK-053.8 completato: aggiunta foundation lifecycle utenti tenant con endpoint `activate/deactivate/lock/unlock` su `/api/admin/users/{userId}`, sezione lifecycle nel dettaglio Angular `/admin/users/:id`, conferma per azioni distruttive, i18n `it/fr/en`, test backend/frontend completi verdi e limite esplicito sulla revoca `tenant access` per mancanza di distinzione sicura tra accesso primario e bridge nel contratto corrente. |
| 2.14 | 2026-05-11 | TASK-053.7 completato: aggiunta foundation create/edit utenti tenant con API `/api/admin/users/form-options`, `POST /api/admin/users`, `PUT /api/admin/users/{userId}`, create con password iniziale e `UserTenantAccess` automatico, update limitato a email/company profile, UI Angular `/admin/users/new` e `/admin/users/:id/edit`, i18n `it/fr/en`, riuso componenti shared e test backend/frontend completi verdi. |
| 2.13 | 2026-05-11 | TASK-053.6 completato: aggiunta foundation reset password amministrativo tenant-aware con API `PUT /api/admin/users/{userId}/password`, validazione `PasswordPolicy`, update `passwordHash`/`passwordChangedAt`, UI inline nel dettaglio utente, i18n `it/fr/en`, test backend/frontend completi verdi e nessuna introduzione di self-service, email automatiche, MFA runtime o `must_change_password`. |
| 2.12 | 2026-05-11 | TASK-053.5 completato: aggiunta foundation assegnazione/rimozione ruoli utente tenant con API `/api/admin/users/{userId}/roles`, lista ruoli disponibili per tenant, validazioni tenant/accesso/duplicato, UI minimale nel dettaglio utente, i18n `it/fr/en` e test backend/frontend completi verdi. |
| 2.11 | 2026-05-10 | TASK-053.4 completato: aggiunte API read-only `/api/admin/users` e `/api/admin/users/{userId}`, UI `/admin/users` e `/admin/users/:id`, ruoli/accessi tenant in sola lettura, display name derivato da Employee con fallback email, query bulk anti N+1, i18n `it/fr/en`, test backend/frontend e QA registrati; nessuna migration, gestione password, role assignment o lifecycle utente. |
| 2.10 | 2026-05-10 | TASK-053.4 splittato in backlog utenti tenant: ridefinito TASK-053.4 come read/list/detail foundation (ruoli/accessi read-only, nome/cognome derivati da Employee con fallback email), aggiunti TASK-053.5 role assignment, TASK-053.6 password administration, TASK-053.7 create/edit, TASK-053.8 lifecycle e TASK-053.9 opzionale per UserAccount-Employee link, senza modifiche codice applicativo. |
| 2.09 | 2026-05-10 | Backlog allineato pre-commit TASK-053.3: aggiunta regola governance CRUD/permessi nei process notes, chiarito limite/follow-up di TASK-053.3 (foundation CRUD + protezione `system_role`), ridefiniti TASK-054 e TASK-055 e aggiunto TASK-055.1 per tenant/caller authorization su endpoint admin `/api/admin/roles`, senza modifiche codice applicativo. |
| 2.08 | 2026-05-10 | TASK-053.2 riallineato dopo review: route frontend rinominata in `/admin/permissions`, menu `Governance > Sicurezza > Permessi`, matrice filtrata ai soli permessi Master Data reali presenti, test/frontend QA aggiornati e nota esplicita sulla validazione manuale tenant-aware. |
| 2.07 | 2026-05-10 | TASK-053.2 completato: aggiunta UI frontend `/admin/permissions` per matrice permessi ruolo tenant-aware, con riuso API backend gia presenti `/api/admin/roles`, route/shell/sidebar coerenti, estensione minima retrocompatibile di `app-checkbox`, build/test frontend verdi e backlog raffinato con nuovo TASK-053.3 per CRUD ruoli custom tenant, TASK-053.4 per user administration e TASK-057 per il debito tecnico import ZIP. |
| 2.06 | 2026-05-10 | TASK-053.1 completato: aggiunta API backend `/api/admin/roles` per lista/dettaglio ruoli, lettura permessi assegnati e replace transazionale delle assegnazioni ruolo-permesso con DTO espliciti, validazione tenant role/permission, test mirati verdi e fix cast UUID in Flyway V18 per PostgreSQL; nessuna UI, security/JWT/enforcement o import CAP modificati. |
| 2.05 | 2026-05-10 | TASK-053 riorganizzato come epic/contenitore con subtask interni TASK-053.1 backend role administration API foundation, TASK-053.2 frontend role permission matrix UI foundation, TASK-053.3 tenant custom role CRUD foundation e TASK-053.4 tenant user administration UI/API foundation; chiariti fuori scope verso TASK-054 frontend visibility e TASK-055 backend enforcement, senza modifiche codice. |
| 2.04 | 2026-05-10 | TASK-052 completato: introdotti enum/helper backend per codici permission `SCOPE.RESOURCE.ACTION`, migration Flyway V18 con matrice iniziale PLATFORM/TENANT per resource/action approvate, seed system_permission e test backend mirati validati senza enforcement runtime o granularita per singola entita Master Data. |
| 2.03 | 2026-05-10 | TASK-051 completato come analisi dominio User/Role/Permission: verificati migration, entity, repository, API/DTO governance-security, auth/JWT e test esistenti; documentata gap analysis rispetto a TASK-049 e backlog tecnico minimale verso TASK-052..TASK-055 senza modifiche runtime. |
| 2.02 | 2026-05-10 | TASK-050 completato come governance backend agent integration: approvata skill repository-local minima `spring-backend-developer`, aggiornati `skills-lock.json`, `backend/AGENTS.md`, prompt governance e report QA, senza modifiche backend/frontend applicative. |
| 2.01 | 2026-05-10 | Inserito nuovo TASK-050 "Configure Spring AI skill and backend agent integration" come task documentale/TODO per skill Spring/backend; rinumerato il blocco corrente Super Admin / permessi a TASK-051..TASK-055 e slittati di +1 i task successivi del backlog attivo, senza modifiche applicative. |
| 2.00 | 2026-05-09 | TASK-048.14 completato come pianificazione documentale del bulk editor stile spreadsheet: definiti use case iniziali, esclusioni del primo rilascio, vincoli i18n/accessibilita/responsive/performance, relazione con `DataTableComponent` e raccomandazione di componente futuro dedicato senza modifiche Angular/backend. |
| 1.98 | 2026-05-09 | TASK-048.12 completato: rifinita la CRUD modal/form Master Data con `Chiudi` rimosso dal footer, action bar allineata a destra, spacing piu coerenti e checkbox `Attivo` stilizzata localmente; build/test frontend OK, nessuna modifica backend/API. |
| 1.97 | 2026-05-09 | Backlog TASK-048 aggiornato dopo TASK-048.11: inseriti TASK-048.12 "CRUD modal and form visual refinement" e TASK-048.13 "Header/topbar visual alignment to TEMPLATE-09"; bulk editor, form controls e typography slittati a TASK-048.14, TASK-048.15 e TASK-048.16 senza modifiche applicative. |
| 1.96 | 2026-05-09 | TASK-048.11 alignment polish: active state parent/submenu distanziati dal bordo destro e search box ricentrata verticalmente nella propria sezione; build/test frontend OK. |
| 1.95 | 2026-05-09 | TASK-048.11 refinement pass su densita e scrolling sidebar: rimosso overflow laterale, aggiunto scroll verticale interno stabile, compattati header/search/menu item e alleggerito l'active submenu, con build/test frontend nuovamente OK. |
| 1.94 | 2026-05-09 | TASK-048.11 rifinito ulteriormente: submenu, contrasti, densita, active state e scrollbar della sidebar sono stati resi piu puliti e leggibili mantenendo invariati routing/i18n/ricerca/collapse; build/test frontend rieseguiti con esito OK. |
| 1.93 | 2026-05-09 | TASK-048.11 completato: sidebar esistente riallineata visivamente a TEMPLATE-08 con patch mirata su componente Angular esistente, active/branch-active piu chiari, ricerca su superficie dark, nessuna modifica backend/API/header e build/test frontend OK. |
| 1.92 | 2026-05-09 | TASK-048.10 completato come shell navigation visual review documentale: TEMPLATE-08 e TEMPLATE-09 valutati senza modifiche Angular/backend/API; inserito TASK-048.11 "Sidebar visual alignment to TEMPLATE-08" come task dedicato futuro e rinumerati i successivi TASK-048.x fino a TASK-048.14. |
| 1.92 | 2026-05-10 | TASK-049 completato come strategia documentale Super Admin/RBAC tenant-aware: formalizzati `PLATFORM_SUPER_ADMIN`, `TENANT_ADMIN`, ruoli seed/custom, CRUD Global/Tenant Master Data, default deny cross-tenant, backend authoritative e frontend visibility solo UX; aggiunta DEC-030 e nessuna modifica codice/runtime. |
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

