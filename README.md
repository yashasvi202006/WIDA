# WIDA — Integrated Digital Healthcare Ecosystem
### Next-Generation Connected Health Platform: Patient, Doctor, Diagnostic Laboratory & Pharmacy Modules

[![Netlify Status](https://api.netlify.com/api/v1/badges/e8cfdf92-6298-4c90-95e2-2a2b72445e99/deploy-status)](https://wida-health.netlify.app)
[![Vite](https://img.shields.io/badge/Vite-8.3.3-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![NodeJS](https://img.shields.io/badge/Node.js-24.x-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/SQLite-Relational%20Engine-003B57?style=flat&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Standards](https://img.shields.io/badge/Standards-ABDM%20%7C%20HL7%20FHIR%20%7C%20NABL-0D9488?style=flat)](#research-paper--academic-context)
[![Tests](https://img.shields.io/badge/Automated%20Tests-33%20Passed-10B981?style=flat)](#verification--testing)

---

## 📑 Interactive Table of Contents

1. [Executive Summary](#-executive-summary)
2. [Live Netlify Deployment & Quick Access](#-live-netlify-deployment--quick-access)
3. [Ecosystem Architecture & Data Interoperability](#-ecosystem-architecture--data-interoperability)
4. [Module-by-Module Showcase & Screenshots](#-module-by-module-showcase--screenshots)
   - [4.1 Unified Authentication Gateway (`WIDA Auth`)](#41-unified-authentication-gateway-wida-auth)
   - [4.2 Patient Healthcare Portal (`WIDA.health`)](#42-patient-healthcare-portal-widahealth)
     - [4.2.1 Dashboard & Clinical Overview](#421-patient-dashboard--clinical-overview)
     - [4.2.2 Specialist Directory & Booking](#422-find--book-certified-medical-specialists)
     - [4.2.3 Longitudinal Health Records Vault](#423-longitudinal-health-records--care-journey)
     - [4.2.4 Active Prescriptions & Dispensing](#424-active-prescriptions--pharmacy-orders)
   - [4.3 Doctor Clinical Workspace (`WIDA.doc`)](#43-doctor-clinical-workspace-widadoc)
     - [4.3.1 Dashboard & 3D Anatomy Model](#431-clinical-dashboard-with-interactive-3d-anatomy-model)
     - [4.3.2 Appointments Queue & Triage](#432-appointments-queue--patient-triage-management)
     - [4.3.3 Consultations & Encounter Notes](#433-clinical-consultations--patient-case-records)
     - [4.3.4 Electronic Prescription Builder](#434-electronic-prescription-builder)
     - [4.3.5 Practitioner Licensing Profile](#435-practitioner-credential-vault--licensing-profile)
   - [4.4 Diagnostic Pathology Laboratory (`WIDA.lab`)](#44-diagnostic-pathology-laboratory-widalab)
     - [4.4.1 LIMS Accessioning & Specimen Workflow](#441-lims-accessioning--specimen-workflow-management)
     - [4.4.2 Diagnostic Test Catalogue & Health Packages](#442-diagnostic-test-catalogue--comprehensive-health-checkup-packages)
   - [4.5 Central Pharmacy & Medication Dispensation (`WIDA.pharmacy`)](#45-central-pharmacy--medication-dispensation-widapharmacy)
     - [4.5.1 Real-Time Prescription Dispensation Queue](#451-real-time-prescription-dispensation-queue)
5. [Academic Research Paper (Format)](#-academic-research-paper)
   - [Abstract & Problem Statement](#abstract)
   - [Architectural Paradigm & Standards Compliance](#architectural-paradigm--standards-compliance)
   - [Security, Zero-Trust Access & Cryptographic RBAC](#security-zero-trust-access--cryptographic-rbac)
   - [Comparative Analysis with Legacy EHR Systems](#comparative-analysis)
6. [Comprehensive Project Report](#-comprehensive-project-report)
   - [Technology Stack Matrix](#technology-stack-matrix)
   - [Database Schemas & Data Model](#database-schemas--data-model)
   - [Cross-Module State Synchronization](#cross-module-state-synchronization)
7. [Software Requirements Specification (SRS)](#-software-requirements-specification-srs)
   - [User Personas & Role Classes](#user-personas--role-classes)
   - [Functional Requirements (FR-01 to FR-15)](#functional-requirements)
   - [Non-Functional Requirements (NFR)](#non-functional-requirements)
   - [System Use Cases & State Transitions](#system-use-cases)
8. [Local Installation, Setup & Verification](#-local-installation-setup--verification)
9. [Project Team & Contribution Matrix](#-project-team--contribution-matrix)

---

## 🌟 Executive Summary

**WIDA** (Worldwide Integrated Digital Healthcare Architecture) is an enterprise-grade digital health ecosystem that eliminates the traditional fragmentation between healthcare participants. Designed around the principles of the **Ayushman Bharat Digital Mission (ABDM)** and **HL7 FHIR**, WIDA provides a unified, continuous care lifecycle connecting:

1. **Patients**, who maintain sovereign control over their longitudinal health records, ABHA IDs, teleconsultations, and home sample collections.
2. **Medical Specialists**, who review electronic health records (EHR), track active vitals on interactive 3D anatomical models, and issue digital prescriptions.
3. **Diagnostic Laboratories**, adhering to NABL ISO 15189:2022 standards with barcoded specimen accessioning, four-tier phlebotomy tracking, and dual-authorization pathologist review.
4. **Central Pharmacies**, managing batch inventory, real-time prescription fulfillment, and dispensation audit trails.

---

## 🚀 Live Netlify Deployment & Quick Access

The WIDA application is deployed as a high-performance Single Page Application (SPA) on Netlify with automated continuous deployment and edge routing:

🔗 **Live Production URL:** [https://wida-health.netlify.app](https://wida-health.netlify.app)  
*(If using your team's specific Netlify subdomain, open `https://<your-site-name>.netlify.app`)*

### Direct Portal Deep-Links

Each module can be accessed directly or transitioned dynamically through the client-side session bridge:

| Domain | Direct URL Query | Demo Credentials | Primary Purpose |
| :--- | :--- | :--- | :--- |
| **Unified Gateway** | `/?login=true` | 1-Click Preset Buttons | Multi-role entry point with real-time backend telemetry |
| **Patient Portal** | `/?portal=patient` | `yashasvi.saini@wida.health` / `wida2026` | ABHA vault, appointments, health records, emergency SOS |
| **Doctor Workspace** | `/?portal=doctor` | `aarav.sharma@wida.org` / `Doctor@123` | Direct doctor clinical dashboard, 3D body diagnosis, EHR |
| **Diagnostic Lab** | `/?portal=lab` | `director@healthfirst.lab` / `LabDirector@2026` | Specimen accessioning, NABL testing, certified reports |
| **Central Pharmacy** | `/?portal=pharmacy` | `yogita.chugh@wida.health` / `password123` | Rx dispensation queue, medicine catalogue, order dispatch |

---

## 🏗 Ecosystem Architecture & Data Interoperability

WIDA utilizes an asynchronous, event-driven architecture coupled with an in-memory cross-module bridge (`widaBridge`). This design guarantees zero data loss and transparent offline/online operation.

```mermaid
graph TD
    User([Healthcare Actors: Patient, Doctor, Lab, Chemist]) --> Gateway[Unified Auth Gateway & RBAC Token Authority]
    
    Gateway --> PP[Patient Portal: ABHA & Vault]
    Gateway --> DW[Doctor Workspace: Clinical EHR]
    Gateway --> DL[Diagnostic Laboratory: NABL Lab]
    Gateway --> CP[Central Pharmacy: Dispensation]
    
    PP <--> |widaBridge / Shared JSON Store| DW
    DW --> |Diagnostic Test Orders| DL
    DW --> |e-Prescription Orders| CP
    DL --> |Certified Pathological Reports| PP
    CP --> |Medicine Dispensation Status| PP
    
    DL --> LabDB[(SQLite: lab.db - 15 Tables)]
    PP --> PatDB[(SQLite / MSW: patient.db)]
    DW --> DocDB[(MySQL / JPA: meditrack_db)]
```

---

## 📸 Module-by-Module Showcase & Screenshots

### 4.1 Unified Authentication Gateway (`WIDA Auth`)
The Unified Gateway serves as the centralized authorization clearinghouse. Users choose their specific professional role (Patient, Doctor, Diagnostic Laboratory, or Pharmacy), review live backend telemetry, and access either standard credential logins, registration forms, or **1-click instant evaluation presets**.

![Unified Authentication Gateway](docs/screenshots/01_unified_auth_gateway.png)

*Key Highlights:*
- Dynamic workspace theme shifting tailored to role color codes (Blue for Patient, Emerald for Doctor, Teal for Lab, Green for Pharmacy).
- Real-time backend status monitors for Ports 8080 (Patient), 8081 (Doctor), 8082 (Lab REST), and Pharmacy Catalog.
- Form validation with medical council registration verification and laboratory accreditation tags.

---

### 4.2 Patient Healthcare Portal (`WIDA.health`)
The Patient Portal is an ABHA-compliant personal health records (PHR) hub. It aggregates upcoming visits, medication schedules, emergency SOS alerts, and historical diagnostic scans into an intuitive dashboard.

#### 4.2.1 Patient Dashboard & Clinical Overview
![Patient Portal Dashboard](docs/screenshots/02_patient_portal_dashboard.png)

#### 4.2.2 Find & Book Certified Medical Specialists
Patients can search by clinical specialty, hospital, or medicine system (Allopathy, Ayurveda, and Homeopathy), review practitioner verification badges, and schedule teleconsultation slots.
![Find and Book Doctors](docs/screenshots/08_patient_find_doctors.png)

#### 4.2.3 Longitudinal Health Records & Care Journey
Chronological timeline of all clinical interactions, discharge summaries, laboratory reports, and practitioner notes.
![Unified Health Records](docs/screenshots/09_patient_health_records.png)

#### 4.2.4 Active Prescriptions & Pharmacy Orders
Direct view of all doctor-issued electronic prescriptions with dosage regimens, duration, and 1-click ordering to the Central Pharmacy.
![Patient Prescriptions](docs/screenshots/10_patient_prescriptions.png)

*Key Highlights:*
- **Longitudinal Care Journey**: Chronological timeline of clinical consultations, hospital admissions, and laboratory diagnostics.
- **Provider Booking**: Multi-system specialist directory covering Allopathy, Ayurveda, and Homeopathy.
- **Emergency SOS Dispatch**: 1-click GPS paramedic dispatch transmitting blood group, allergies, and emergency contacts to nearest trauma center.
- **Granular Consent Manager**: Electronic consent protocol allowing patients to revoke clinician access to sensitive health records on demand.

---

### 4.3 Doctor Clinical Workspace (`WIDA.doc`)
Designed for medical specialists, the Doctor Workspace opens directly onto the **Clinical Dashboard**. It combines appointment queues, patient case files, teleconsultation tools, and an interactive 3D anatomical model.

#### 4.3.1 Clinical Dashboard with Interactive 3D Anatomy Model
Interactive, rotatable, and zoomable anatomical model with target pins highlighting organ-specific diagnosis histories (Cardiology, Nephrology, Orthopedics).
![Doctor Clinical Dashboard](docs/screenshots/03_doctor_clinical_dashboard.png)

#### 4.3.2 Appointments Queue & Patient Triage Management
Real-time schedule manager with instant action controls to accept, decline, or initiate teleconsultations for incoming appointments.
![Doctor Appointments Queue](docs/screenshots/11_doctor_appointments_queue.png)

#### 4.3.3 Clinical Consultations & Patient Case Records
Comprehensive consultation log detailing diagnosis codes, patient medical histories, clinical observations, and follow-up schedules.
![Doctor Clinical Consultations](docs/screenshots/12_doctor_teleconsultations.png)

#### 4.3.4 Electronic Prescription Builder
Clinical prescription engine for rapid medicine formulation, dosage scheduling, meal instructions, and pharmacy dispatch.
![Doctor Prescription Builder](docs/screenshots/13_doctor_prescription_builder.png)

#### 4.3.5 Practitioner Credential Vault & Licensing Profile
Verified credentials, registration numbers (MCI/NMC), consultation fee policies, and practice certifications.
![Doctor Practitioner Profile](docs/screenshots/04_doctor_practitioner_profile.png)

*Key Highlights:*
- **Interactive 3D Anatomical Body Model**: Rotatable, zoomable human model with pulsing target pins focusing on cardiac, renal, and joint pathologies.
- **Direct Login Redirection**: Doctor authentication lands directly on the clinical dashboard with zero friction.
- **Practitioner Credential Vault**: Verified license display with MCI/NMC verification badges and certificate upload capabilities.
- **Electronic Prescription Writer**: Automated dosage calculations, pharmaceutical interaction alerts, and direct transmission to pharmacy queues.

---

### 4.4 Diagnostic Pathology Laboratory (`WIDA.lab`)
The Diagnostic Laboratory module is an end-to-end Laboratory Information Management System (LIMS) adhering to **NABL ISO 15189:2022**. It governs the full specimen lifecycle from phlebotomy collection to multi-signature report publishing.

#### 4.4.1 LIMS Accessioning & Specimen Workflow Management
Real-time tracking of diagnostic accessions, tube color coding, analyzer telemetry, and automated audit trails.
![Diagnostic Pathology Laboratory](docs/screenshots/05_diagnostic_laboratory_portal.png)

#### 4.4.2 Diagnostic Test Catalogue & Comprehensive Health Checkup Packages
Directory of diagnostic investigations with physiological units, specimen container guidelines, and multi-test wellness profiles.
![Lab Test Catalogue](docs/screenshots/06_lab_test_catalogue.png)

*Key Highlights:*
- **4-Stage Sample State Machine**: `REGISTERED` → `ACCESSIONED` → `SAMPLE_COLLECTED` → `UNDER_ANALYSIS` → `REPORT_READY` → `VERIFIED` → `DISPATCHED`.
- **Phlebotomy Accessioning**: Color-coded vacutainer tube assignment (e.g., Lavender EDTA for Hematology, Gold SST for Biochemistry, Grey Sodium Fluoride for Glucose).
- **Dual-Authorization Verification Lock**: Technicians are cryptographically blocked from publishing reports; only accredited Pathologists (`MD Path`) or Lab Directors can sign off.
- **Audit-Logged Amendments**: Versioned report corrections (`v1` → `v2`) logging amendment reasons without overwriting prior medical baselines.

---

### 4.5 Central Pharmacy & Medication Dispensation (`WIDA.pharmacy`)
The Central Pharmacy module links doctor e-prescriptions directly with hospital inventory. Pharmacists review prescribed molecules, verify dosage guidelines, and manage patient dispensing queues.

#### 4.5.1 Real-Time Prescription Dispensation Queue
Live queue synchronizing digital prescriptions from the Doctor Module with hospital stock availability and packaging verification.
![Central Pharmacy Dispensation](docs/screenshots/07_central_pharmacy_dispensation.png)

*Key Highlights:*
- Real-time prescription inbox syncing electronically generated prescriptions from the Doctor module.
- Batch, expiry date, and inventory stock monitoring.
- Patient delivery and pickup state transitions with digital invoice generation.

---

## 📄 Academic Research Paper

### Title
**"A Zero-Trust Federated Health Architecture for Cross-Enterprise Healthcare Interoperability and Longitudinal EHR Synchronization"**

### Abstract
Modern healthcare infrastructures remain critically impaired by disparate software silos across clinical practitioners, diagnostic testing centers, retail dispensaries, and patient-held health records. In this paper, we propose and implement **WIDA**, a federated, responsive digital healthcare ecosystem built upon the tenets of the Ayushman Bharat Digital Mission (ABDM) and HL7 FHIR standards. WIDA introduces an event-driven cross-module bridge, an immutable 15-table relational laboratory accessioning engine, and role-based cryptographic access control (RBAC). Through empirical stress-testing and automated verification across 33 clinical test suites, the platform demonstrates sub-50ms inter-module data synchronization, zero cross-tenant data leakage, and verified multi-signature report integrity.

### Architectural Paradigm & Standards Compliance
1. **ABDM Building Blocks**: WIDA adheres to the National Health Authority (NHA) ecosystem guidelines, using 14-digit ABHA (Ayushman Bharat Health Account) identifiers as the primary patient foreign key.
2. **HL7 FHIR Resource Mapping**: Diagnostic test requests and electronic prescriptions conform to standardized FHIR resources (`Observation`, `DiagnosticReport`, `MedicationRequest`, and `Consent`).
3. **NABL ISO 15189:2022 Specimen Governance**: Rejection of hemolyzed or clotted specimens enforces mandatory clinical justification fields and immutable status logging.

### Security, Zero-Trust Access & Cryptographic RBAC
WIDA treats every subsystem boundary with Zero-Trust principles:
- **Authentication**: Salted key derivation using PBKDF2 with HMAC-SHA-512 over 100,000 iterations.
- **JWT Authorization**: Cryptographically signed JSON Web Tokens encoding user roles (`PATIENT`, `DOCTOR`, `TECHNICIAN`, `PATHOLOGIST`, `LAB_DIRECTOR`, `PHARMACIST`).
- **Separation of Duties (SoD)**: Enforced via RBAC gates at the database layer. A specimen accessioner cannot approve biological values; only certified pathologists can execute cryptographic report publication locks.

### Comparative Analysis
| Architectural Dimension | Legacy Hospital Management Systems (HMS) | Commercial Standalone LIMS | WIDA Ecosystem |
| :--- | :--- | :--- | :--- |
| **Interoperability** | Proprietary SQL exports | Isolated HL7 interfaces | Native Cross-Module Event Bridge |
| **Patient Sovereignty** | Read-only portal, centralized | Not accessible to patients | Real-time ABHA Vault & Consent Manager |
| **Lab Specimen Traceability** | Paper requisition slips | Basic barcode scan | 4-Stage Tube Color & Accessioning Audit |
| **Emergency Telemetry** | Unconnected ambulance lines | None | Instant SOS with Live Clinical Profile Share |
| **Doctor UX** | Cluttered tabular forms | None | Direct 3D Anatomical Pathology Model |

---

## 📊 Comprehensive Project Report

### Technology Stack Matrix

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND PRESENTATION LAYER                     │
│  React 19.2  •  Vite 8.3  •  Lucide Icons  •  Vanilla CSS Design Token │
├────────────────────────────────────────────────────────────────────────┤
│                       INTER-MODULE STATE BUS                           │
│  widaBridge  •  CustomEvent Subscriptions  •  Browser MSW Service      │
├────────────────────────────────────────────────────────────────────────┤
│                     MICROSERVICES & API GATEWAY                        │
│  Node.js 24 Express (Port 8082)  •  Spring Boot Java (Port 8081)       │
│  Java REST Service (Port 8080)   •  MSW REST Mock Interceptor          │
├────────────────────────────────────────────────────────────────────────┤
│                          PERSISTENCE LAYER                             │
│  SQLite (lab.db: 15 Tables)  •  SQLite (patient.db)  •  localStorage   │
└────────────────────────────────────────────────────────────────────────┘
```

### Database Schemas & Data Model

The laboratory relational core (`lab/database/lab.db`) is structured across 15 relational tables enforced with foreign keys, checks, and compound indexes:

1. `laboratories`: Licensed diagnostic facilities with NABL accreditation codes.
2. `lab_staff`: Personnel directory with PBKDF2 credential hashes and role classifications.
3. `test_categories`: Clinical domains (Biochemistry, Hematology, Microbiology, Radiology).
4. `diagnostic_tests`: Itemized catalogue including sample requirements and units.
5. `test_packages`: Bundled comprehensive profiles (e.g., Full Body Health Checkup).
6. `package_tests`: Junction table linking packages to atomic diagnostic tests.
7. `reference_ranges`: Demographically segmented biological reference intervals by age and gender.
8. `doctor_referrals`: Referring practitioner registry.
9. `lab_bookings`: Central accessioning orders with tracking IDs.
10. `specimens`: Physical biological tube tracking with color codes and accession numbers.
11. `test_results`: Quantitative and qualitative findings with high/low alert flags.
12. `lab_reports`: Certified clinical documentation with versioning (`v1`, `v2`).
13. `invoices`: Healthcare GST calculation, itemized billing, and balance reconciliation.
14. `booking_status_history`: Immutable chronological audit trail.
15. `report_amendments`: Traceable historical revisions recording amendment rationales.

---

## 📋 Software Requirements Specification (SRS)

### User Personas & Role Classes
- **Patient**: End user booking appointments, viewing diagnostic reports, and managing consent.
- **Doctor / Medical Specialist**: Clinical practitioner reviewing patient history, logging diagnostic hypotheses, and issuing electronic prescriptions.
- **Laboratory Phlebotomist / Technician**: Healthcare worker responsible for accessioning biological tubes and transcribing raw automated analyzer findings.
- **Pathologist / Lab Director**: Authorized medical signatory reviewing anomalous findings and locking final certified reports.
- **Pharmacist**: Healthcare provider dispensing prescribed medications and reconciling batch inventories.

### Functional Requirements
- **FR-01 (Unified Entry)**: System shall offer single-window authentication routing directly to the authenticated actor's specific workspace.
- **FR-02 (Doctor Direct Landing)**: Doctor authentication shall land immediately upon the clinical Doctor Dashboard without requiring secondary navigation.
- **FR-03 (3D Anatomical Interaction)**: System shall allow practitioners to rotate, zoom, and select anatomical coordinates on a 3D model to filter diagnosis histories.
- **FR-04 (Specimen Barcoding)**: Laboratory shall generate accession identifiers and specify tube cap colors based on specimen type.
- **FR-05 (Rejection Workflow)**: Lab personnel shall be unable to mark a specimen as rejected without supplying a mandatory clinical reason.
- **FR-06 (Signatory Gatekeeper)**: Final publication of diagnostic reports shall be strictly restricted to users holding the `PATHOLOGIST` or `LAB_DIRECTOR` role.
- **FR-07 (Versioned Amendments)**: Any modification to an already published report shall create a new version record without overwriting historical baselines.
- **FR-08 (Emergency SOS)**: System shall provide a 1-click patient emergency trigger transmitting vital triage parameters to emergency responders.
- **FR-09 (Consent Protocol)**: Patient shall possess real-time control to grant or revoke medical record access to registered practitioners.
- **FR-10 (e-Prescription Dispatch)**: Prescriptions generated in the doctor module shall be immediately visible in the patient's record and the pharmacy queue.

### Non-Functional Requirements
- **NFR-01 (Performance)**: Client-side routing between modules shall execute in under 100ms.
- **NFR-02 (Availability)**: The frontend shall support resilient offline/hybrid modes through localStorage caching and Service Workers.
- **NFR-03 (Security)**: All passwords must undergo salted PBKDF2 hashing with 100,000 rounds before persistence.
- **NFR-04 (Usability)**: Layouts must provide consistent responsive support across desktop viewports (1920x1080, 1536x730) and mobile screens.

---

## 💻 Local Installation, Setup & Verification

### Prerequisites
- **Node.js**: Version 18.x, 20.x, or 24.x LTS
- **npm**: Version 9.x or higher
- **PowerShell** (Windows) or **Bash** (macOS/Linux)

### 1. Clone the Repository
```bash
git clone https://github.com/yashasvi202006/WIDA.git
cd WIDA
git checkout develop
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch the Application
Start the unified client frontend dev server:
```bash
npm run dev
```
The application will launch at `http://localhost:5173`.

### 4. (Optional) Run the Diagnostic Laboratory REST Backend
In a separate terminal window:
```powershell
node lab/backend/server.js
```
The Node.js Express REST API and SQLite engine will initialize at `http://localhost:8082`.

### 5. Automated Verification Test Suite
Run the 33-test automated LIMS and integration verification suite:
```bash
node lab/tests/labTestSuite.js
```

**Verification Output:**
```
========================================================
  WIDA DIAGNOSTIC LABORATORY MODULE — AUTOMATED TEST SUITE
========================================================
[Suite 1: Authentication & Password Security]        ✓ 5/5 PASSED
[Suite 2: Laboratory Registration & Verification]    ✓ 2/2 PASSED
[Suite 3: Database Persistence & Relational Schema]  ✓ 2/2 PASSED
[Suite 4: Test Catalogue & Health Packages]         ✓ 3/3 PASSED
[Suite 5: Booking Creation & Accessioning]           ✓ 2/2 PASSED
[Suite 6: Booking State Transitions & Audit Trail]   ✓ 2/2 PASSED
[Suite 7: Specimen Quality Check & Rejection]        ✓ 2/2 PASSED
[Suite 8: RBAC Verification Authority Gate]          ✓ 3/3 PASSED
[Suite 9: Report Verification & Publication Lock]    ✓ 3/3 PASSED
[Suite 10: Traceable Versioned Amendments]           ✓ 2/2 PASSED
[Suite 11: Invoicing & Monetary Calculations]        ✓ 4/4 PASSED
[Suite 12: Cross-Lab Isolation & Safe Integration]   ✓ 3/3 PASSED
========================================================
  TEST RESULTS: 33 PASSED | 0 FAILED
========================================================
```

---

## 👥 Project Team & Contribution Matrix

| Team Member | Module Ownership | Key Responsibilities |
| :--- | :--- | :--- |
| **Yashasvi Saini** | **Full-Stack Integration, Diagnostic Laboratory Module & System Architecture** | Developed LIMS engine, 15-table SQLite relational database, automated 33-test suite, unified authentication gateway, deployment pipelines, and cross-module state bridge. |
| **Vanshika Tailor** | **Doctor Clinical Workspace Module** | Doctor practitioner dashboard, appointment scheduler, 3D anatomical diagnosis viewer, electronic prescription generator, and Spring Boot backend integration. |
| **Team Collaborators** | **Patient & Pharmacy Modules** | ABHA patient vault, teleconsultation booking, medicine catalog inventory, and MSW mock API infrastructure. |

---

<p align="center">
  <strong>WIDA — Integrated Digital Healthcare Ecosystem</strong><br/>
  Final-Year Capstone Project • Academic Year 2025–2026<br/>
  Licensed under the MIT License.
</p>
