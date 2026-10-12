# WIDA — Integrated Digital Healthcare Ecosystem
### Next-Generation Connected Health Platform: Patient, Doctor, Diagnostic Laboratory & Pharmacy Modules

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Frontend-black?style=flat&logo=vercel&logoColor=white)](https://vercel.com)
[![Render Production](https://img.shields.io/badge/Render-Live%20Production%20API-46E3B7?style=flat&logo=render&logoColor=white)](https://wida.onrender.com)
[![Netlify Mirror](https://api.netlify.com/api/v1/badges/e8cfdf92-6298-4c90-95e2-2a2b72445e99/deploy-status)](https://wida-health.netlify.app)
[![Java 21 LTS](https://img.shields.io/badge/Backend-Java%2021%20LTS-ED8B00?style=flat&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot 3](https://img.shields.io/badge/Framework-Spring%20Boot%203-6DB33F?style=flat&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React 19](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Database](https://img.shields.io/badge/Database-SQLite%20Relational%20Engine-003B57?style=flat&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Standards](https://img.shields.io/badge/Standards-ABDM%20%7C%20HL7%20FHIR%20%7C%20NABL-0D9488?style=flat)](#10-academic-research-references--literature-citations)
[![Automated Tests](https://img.shields.io/badge/Verification-33%20Automated%20Tests%20Passed-10B981?style=flat)](#9-automated-verification-test-suite)

---

## 👥 Project Team & University Credentials

This project is developed as an academic capstone engineering initiative by the Department of Computer Science & Engineering / Artificial Intelligence & Data Science:

| Roll Number | Full Name | Module Ownership & Engineering Domain |
| :--- | :--- | :--- |
| **`24EARAD184`** | **Yashasvi Saini** | **Team Lead & Lead Architect** • Full-Stack Integration, Patient Module Core, Longitudinal EHR Vault & Cross-Module Data Bridge |
| **`24EARAD175`** | **Vanshika Tailor** | **Doctor Clinical Workspace Module Lead** • Doctor Portal UI, 3D Anatomical Diagnostics, MCI/NMC Verification, Level Progression & Ranking Engine |
| **`24EARAD173`** | **Vaishnavi Singh** | **Diagnostic Laboratory Module Lead** • NABL ISO 15189 LIMS Engine, Phlebotomy Specimen Accessioning, Dual-Pathologist Sign-off & Automated Billing |
| **`24EARAD189`** | **Yogita** | **Central Pharmacy Module Lead** • E-Prescription Ingestion Queue, Schedule H1 Compliance, Drug Inventory & Dispensation Audit Trail |
| **`24EARAD172`** | **Vaidik Nama** | **Emergency Ambulance Alert System & Cloud DevOps Lead** • 7-Stage Emergency SOS Protocol, Geolocation Dispatch, Vercel/Render Cloud CI/CD & C# Windows Launcher |

---

## 📑 Interactive Table of Contents

1. [Executive Summary & Vision](#1-executive-summary--vision)
2. [Live Cloud Deployments & Native Windows Desktop Launchers](#2-live-cloud-deployments--native-windows-desktop-launchers)
3. [Strict Role Isolation & 16-Demo-Account Matrix](#3-strict-role-isolation--16-demo-account-matrix)
4. [12-Week Development Plan & Work Breakdown Structure (WBS)](#4-12-week-development-plan--work-breakdown-structure-wbs)
5. [Unified Cross-Module Closed-Loop Workflow & Integration Architecture](#5-unified-cross-module-closed-loop-workflow--integration-architecture)
6. [Module-by-Module UML Diagrams & Technical Workflows](#6-module-by-module-uml-diagrams--technical-workflows)
   - [6.1 Patient Healthcare Module (`WIDA.health`)](#61-patient-healthcare-module-widahealth)
   - [6.2 Doctor Clinical Workspace (`WIDA.doc`)](#62-doctor-clinical-workspace-widadoc)
   - [6.3 Diagnostic Pathology Laboratory Module (`WIDA.lab`)](#63-diagnostic-pathology-laboratory-module-widalab)
   - [6.4 Central Pharmacy Module (`WIDA.pharmacy`)](#64-central-pharmacy-module-widapharmacy)
   - [6.5 Emergency Ambulance & Trauma Alert System (`WIDA.sos`)](#65-emergency-ambulance--trauma-alert-system-widasos)
7. [Module-by-Module Visual Screenshot Gallery](#7-module-by-module-visual-screenshot-gallery)
8. [Comprehensive Software Requirements Specification (SRS)](#8-comprehensive-software-requirements-specification-srs)
9. [Automated Verification Test Suite](#9-automated-verification-test-suite)
10. [Academic Research References & Literature Citations](#10-academic-research-references--literature-citations)
11. [Installation, Build & Local Execution Guide](#11-installation-build--local-execution-guide)

---

## 1. Executive Summary & Vision

### 1.1 The Clinical Fragmentation Problem
Traditional digital health applications operate as disconnected silos:
- Teleconsultation apps generate PDF prescriptions that patients must re-upload manually to pharmacies.
- Diagnostic laboratories operate standalone LIMS that produce paper or unlinked PDF reports unavailable to attending doctors in real-time.
- Pharmacies dispense medications with zero visibility into past clinical encounters or duplicate therapy hazards.
- Emergency services lack rapid access to the patient's critical health baseline (blood group, allergies, cardiac history).

### 1.2 The WIDA Solution
**WIDA** (Worldwide Integrated Digital Healthcare Architecture) closes this clinical loop. It implements an interconnected ecosystem where:
- A patient books an appointment and securely shares their **ABHA ID** and longitudinal medical history.
- An accredited doctor conducts the consultation with interactive **3D anatomical diagnostics**, issuing an encrypted electronic prescription and ordering specific lab tests.
- The diagnostic laboratory receives the test order instantly, accessions specimens adhering to **NABL ISO 15189:2022** tri-color tube protocols, conducts dual-sign verification, and publishes cryptographically locked reports directly to the patient's record.
- The accredited pharmacy dispenses medications verified against national Schedule H1 compliance guidelines with real-time stock deduction.
- Critical emergencies trigger a **7-stage SOS pipeline** transmitting essential vitals and geolocation to nearest response trauma units.

---

## 2. Live Cloud Deployments & Native Windows Desktop Launchers

WIDA is deployed across enterprise cloud infrastructures with continuous integration and multi-region redundancy, as well as packaged as a native desktop binary for offline evaluation:

| Target Platform | Hosting / Packaging | Live Endpoint / Artifact | Description |
| :--- | :--- | :--- | :--- |
| **Frontend Cloud** | **Vercel Edge Network** | [https://wida.vercel.app](https://wida.vercel.app) *(or Vercel Deploy URL)* | Continuous deployment from `develop` branch with ultra-low latency edge CDN routing. |
| **Backend & Full-Stack** | **Render Cloud Services** | [https://wida.onrender.com](https://wida.onrender.com) | Containerized production deployment running REST microservices and SQLite database persistence. |
| **Backup CDN Mirror** | **Netlify Edge CDN** | [https://wida-health.netlify.app](https://wida-health.netlify.app) | Real-time mirror with automated asset optimization and instant SSL certificates. |
| **Native Windows Executable** | **C# .NET Native App** | `WIDA_Launcher.exe` *(Project Root)* | One-click desktop executable that verifies port availability, boots background Java & REST backends, starts the Vite frontend, and automatically opens the browser. |
| **Windows Batch Shell** | **Automated Shell Script** | `START_WIDA_ECOSYSTEM.bat` | Terminal launcher with dependency health checks, colored status banners, and multi-service telemetry. |

---

## 3. Strict Role Isolation & 16-Demo-Account Matrix

To strictly enforce clinical data privacy and regulatory compliance, WIDA enforces **Zero-Trust Role-Based Access Control (RBAC)**:
- **Authentication Isolation**: An account registered in one portal (e.g., Patient) cannot authenticate into another (e.g., Doctor, Lab, or Pharmacy).
- **Credential Storage**: Accounts are segregated by role-scoped tokens and cryptographically salted hashes.

### The 16 Verified Demo Accounts (4 Per Module)
Every portal includes 4 pre-configured demo personas with 1-click autofill buttons:

#### 👤 Patient Portal (`/?portal=patient`) — ABDM ABHA Identities
| Demo # | Patient Name | Personal / Work Email | ABHA ID (ABDM) | Password | Clinical Persona & Profile |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Demo 1** | **Yashasvi Saini** | `patient@wida.health` | `91-4521-8902-3341` | `password123` | Age 24, Male, B+ • Active Care, Stage 1 Hypertension |
| **Demo 2** | **Ananya Sengupta** | `ananya.patient@wida.health` | `91-8820-1923-4512` | `password123` | Age 32, Female, O+ • Type 2 Diabetes & Routine Lab Screening |
| **Demo 3** | **Rahul Verma** | `rahul.patient@wida.health` | `91-7712-4091-6623` | `password123` | Age 42, Male, A+ • Post-Stent Arterial Follow-up & Lipid Panel |
| **Demo 4** | **Priya Deshmukh** | `priya.patient@wida.health` | `91-6304-5519-8834` | `password123` | Age 36, Female, AB+ • Mild Asthma & Allergen Profiling |

#### 🩺 Doctor Workspace (`/?portal=doctor`) — Medical Council Credentials
| Demo # | Doctor Name | Professional Email | MCI/NMC Reg Number | Password | Specialization & Clinical Center |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Demo 1** | **Dr. Aarav Sharma** | `dr.aarav@wida.health` | `MCI-2009-48291` | `Doctor@123` | Senior Cardiologist • Apex Heart & Vascular Institute (ID: 1) |
| **Demo 2** | **Dr. Ananya Verma** | `dr.ananya@wida.health` | `MCI-2012-39201` | `Doctor@123` | Orthopedic Surgeon • City Bone & Joint Clinic (ID: 2) |
| **Demo 3** | **Dr. Rohan Iyer** | `dr.rohan@wida.health` | `MCI-2015-66104` | `Doctor@123` | Consultant Neurologist • NeuroCare Brain Spine Center (ID: 3) |
| **Demo 4** | **Dr. Kavita Menon** | `dr.kavita@wida.health` | `MCI-2018-88319` | `Doctor@123` | Specialist Pediatrician • Blossom Children Hospital (ID: 4) |

#### 🔬 Diagnostic Laboratory (`/?portal=lab`) — NABL ISO 15189 Accreditation
| Demo # | Pathologist / Director | Accreditation Email | NABL License Number | Password | Diagnostic Facility & Scope |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Demo 1** | **Dr. Neha Kapoor** | `lab@wida.health` | `NABL-2024-MC-8821` | `Lab@123` | Metropolis Diagnostics • Biochemistry, Hematology & Serology |
| **Demo 2** | **Dr. Vikram Sethi** | `vikram.lab@wida.health` | `NABL-2023-MC-4192` | `Lab@123` | Lal PathLabs Regional Hub • Molecular Pathology & Flow Cytometry |
| **Demo 3** | **Dr. Sunita Rao** | `sunita.lab@wida.health` | `NABL-2022-MC-7703` | `Lab@123` | SRL Clinical Reference Lab • Clinical Microbiology & Immunoassays |
| **Demo 4** | **Dr. Rajesh Joshi** | `rajesh.lab@wida.health` | `NABL-2025-MC-1104` | `Lab@123` | Suburban Diagnostics Center • Endocrinology & Histopathology |

#### 💊 Central Pharmacy (`/?portal=pharmacy`) — State Drug Control Licensing
| Demo # | Pharmacist-in-Charge | Pharmacy Email | Drug License (DCA/FDA) | Password | Dispensation Center & Inventory Scope |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Demo 1** | **Rajesh Kumar** | `pharmacy@wida.health` | `DL-20B-184920` | `Pharmacy@123` | Apollo 24/7 MedStore • Schedule H & H1 Dispensation |
| **Demo 2** | **Meera Nair** | `meera.pharmacy@wida.health` | `DL-20B-991203` | `Pharmacy@123` | MedPlus Care Pharmacy • Chronic Care & Insulin Cold Chain |
| **Demo 3** | **Amitabh Sen** | `amitabh.pharmacy@wida.health` | `DL-21B-448102` | `Pharmacy@123` | Guardian Health Chemists • Critical Care & Oncological Drugs |
| **Demo 4** | **Pooja Chawla** | `pooja.pharmacy@wida.health` | `DL-20B-331908` | `Pharmacy@123` | Wellness Forever Retail • Pediatric & Alternative Remedies |

---

## 4. 12-Week Development Plan & Work Breakdown Structure (WBS)

Based on the project functional specifications, research analysis, and module requirements, the 12-week development lifecycle was executed systematically across all 5 team members. Every member had dedicated deliverables every single week:

### 12-Week Member Task Distribution Matrix

```
Weeks 1-3   : Inception, Standards Analysis, Architecture, Identity & Core Schemas
Weeks 4-6   : Module Deep-Dives (Doctor Workspace, Diagnostic LIMS, Central Pharmacy)
Weeks 7-9   : Closed-Loop Cross-Module Data Bridge, 3D Anatomy, LIMS Verification Gate
Weeks 10-12 : Emergency Ambulance SOS, Cloud Deployments, Security Audit & Academic Packaging
```

| Week # | Yashasvi Saini (`24EARAD184`) | Vanshika Tailor (`24EARAD175`) | Vaishnavi Singh (`24EARAD173`) | Yogita (`24EARAD189`) | Vaidik Nama (`24EARAD172`) |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **Week 1** | System architecture design, ABDM/HL7 FHIR feasibility study, master repo setup. | Medical practice survey, Doctor UI wireframing, MCI/NMC verification flow specs. | NABL ISO 15189 standards study, Pathology test workflow analysis, tube color logic. | Pharmacy dispensing regulations (Drugs & Cosmetics Act), Schedule H1 specs. | Cloud hosting research (Vercel, Render), CI/CD setup, emergency dispatch flow specs. |
| **Week 2** | Unified Auth Gateway design, cryptographic role-based token model, shared state bridge. | Doctor registration schema, qualification document upload models, doctor entity design. | Diagnostic test catalogue schema, specimen accessioning data model, LIMS DB tables. | Medicine catalogue inventory schema, batch number & expiry models, pharmacy DB tables. | Vercel frontend CI pipeline, Render backend container setup, initial network topology. |
| **Week 3** | Patient Portal foundation, ABHA ID creation & validation, personal health profile UI. | Doctor dashboard layout, weekly scheduling slots engine, calendar integration. | Specimen collection UI, barcode generator, phlebotomy tube classification (EDTA, SST, NaF). | Prescription intake queue UI, manual script review forms, stock level indicators. | Emergency SOS trigger button UI, browser geolocation API integration, mock dispatch socket. |
| **Week 4** | Longitudinal health record vault, medical conditions timeline, allergies & vitals tracking. | Doctor appointment queue UI, accept / reject / reschedule state handlers, SMS/email alerts. | Test package bundling (Full-body, Cardiac, Diabetic, Renal panels), booking creation engine. | Medicine stock management UI, low-stock threshold alerts, batch expiry tracking. | Emergency context packaging (blood group, allergies, emergency contacts extraction). |
| **Week 5** | Alternative medicine section (Ayurveda, Homeopathy, Unani), holistic health filters. | Clinical consultation encounter note builder, subjective/objective findings form. | Specimen quality check module, rejection reason tracking (hemolysis, clotting, lipemia). | Digital prescription ingestion pipeline, optical readability checks, doctor signature verification. | Real-time emergency vehicle tracking map view, ambulance ETA calculation algorithms. |
| **Week 6** | Personal hygiene advisory section, daily preventive care routine trackers. | 3D anatomical human model integration (Three.js/Canvas), organ layer selection. | Diagnostic report drafting interface, reference range comparison engine, abnormal flagging. | Schedule H1 drug dispensation register, patient Aadhaar/ID capture for antibiotics. | Hospital trauma center routing logic, nearest hospital availability matcher. |
| **Week 7** | Closed-loop cross-module data bridge: Patient appointment -> Doctor consultation sync. | Doctor e-Prescription builder: dosage, frequency, duration, auto-fill pharmacy sync. | Pathologist dual-sign authorization gate, digital signature stamp, publication lock. | Dispensing queue real-time sync with doctor prescriptions, stock decrement engine. | Emergency status tracking screen (Dispatched -> En Route -> Arrived -> Hospital Handover). |
| **Week 8** | Diagnostic report viewer for patients, interactive parameter gauge charts, trend analysis. | Doctor achievement & badge progression engine, profile completeness scoring logic. | Traceable versioned amendments module (addendum tracking without altering originals). | Billing & invoicing engine for dispensed medications, patient receipt generation. | End-to-end emergency simulation testing, false-positive alert cancellation guardrails. |
| **Week 9** | Pharmacy order tracking for patients, delivery status updates, recurring medicine reminders. | Doctor ranking algorithm based on verified patient interactions & ratings. | Lab automated billing engine, invoice generation, discount & tax calculations. | Prescription history audit trail, dispensation log export (CSV/PDF) for regulatory checks. | Vercel production frontend deployment, domain routing, edge caching configuration. |
| **Week 10** | Fitness watch / wearable device connectivity interface (heart rate, steps, sleep sync). | Doctor business proposal & clinic accreditation documentation upload section. | 33-test automated LIMS test suite creation (`labTestSuite.js`), boundary test cases. | Drug interaction warning engine (flagging duplicate or conflicting active ingredients). | Render backend API deployment, SSL setup, PostgreSQL/SQLite persistence persistence. |
| **Week 11** | Government healthcare schemes catalogue (Ayushman Bharat, PM-JAY, CGHS, State schemes). | Doctor portal responsive refinement, accessibility audits (WCAG 2.1 AA), clinical bug fixes. | Lab test suite execution (33/33 passed), cross-lab isolation verification, security scan. | Pharmacy end-to-end reconciliation tests, inventory balance audit, edge case handling. | Native Windows C# launcher (`WIDA_Launcher.exe`) and `START_WIDA_ECOSYSTEM.bat` development. |
| **Week 12** | End-to-end unified ecosystem testing, project presentation rehearsal, README documentation. | Final clinical workflow review, doctor evaluation demo dataset, academic paper draft. | Laboratory audit documentation, NABL compliance verification report generation. | Pharmacy compliance report, final capstone code cleanup, demo ID matrix verification. | Cloud health-check monitor setup, final Git repository cleanup, release tagging (`v1.0.0`). |

---

## 5. Unified Cross-Module Closed-Loop Workflow & Integration Architecture

The fundamental thesis of WIDA is that healthcare is a continuous journey, not an isolated set of transactional web pages. The diagram below illustrates how medical data transitions across the four modules and emergency system in a secure, closed-loop cycle:

```mermaid
sequenceDiagram
    autonumber
    actor Patient as Patient (WIDA.health)
    actor Doctor as Doctor (WIDA.doc)
    actor Lab as Diagnostic Lab (WIDA.lab)
    actor Pharmacy as Central Pharmacy (WIDA.pharmacy)
    actor SOS as Emergency Trauma (WIDA.sos)

    Note over Patient,Doctor: Step 1: Encounter Booking and Consent
    Patient->>Doctor: Books Appointment and Grants Temporary ABHA Consent
    Doctor->>Doctor: Accepts Appointment, Loads Patient History and 3D Anatomy

    Note over Doctor,Patient: Step 2: Clinical Consultation
    Doctor->>Doctor: Conducts Encounter, Records Clinical Remarks and Diagnosis
    Doctor->>Pharmacy: Transmits Cryptographically Signed E-Prescription
    Doctor->>Lab: Issues Diagnostic Lab Investigation Order
    Doctor->>Patient: Issues Digital Encounter Summary to Patient Health Vault

    Note over Lab,Patient: Step 3: Diagnostic Laboratory Fulfillment
    Lab->>Lab: Accessions Specimen with Barcode and Tri-Color Tube
    Lab->>Lab: Runs Analytical Diagnostics, Pathologist Signs and Verifies Report
    Lab-->>Patient: Publishes Cryptographically Locked Digital Diagnostic Report
    Lab-->>Doctor: Updates Patient EHR with Verified Lab Results

    Note over Pharmacy,Patient: Step 4: Central Pharmacy Dispensation
    Pharmacy->>Pharmacy: Ingests Prescription, Verifies Schedule H1 Compliance
    Pharmacy->>Pharmacy: Decrements Inventory, Packages Medication with Dosage Label
    Pharmacy-->>Patient: Dispenses Medication, Emits Dispensation Audit Receipt

    Note over Patient,SOS: Step 5: Critical Emergency SOS
    Patient->>SOS: Triggers 7-Stage Emergency Alert
    SOS->>SOS: Pulls Blood Group, Chronic Allergies and GPS Coordinates
    SOS->>Doctor: Notifies Nearest Trauma Center and Emergency Response Unit
```

### Detailed Integration Mechanics
1. **Unified State Bridge**: When a patient registers or schedules an appointment, an immutable clinical record is instantiated.
2. **Dynamic Order Routing**:
   - Diagnostic tests ordered by a doctor appear instantly in the laboratory queue with patient metadata, clinical indications, and priority status (Routine vs Urgent).
   - Prescriptions written in the Doctor Workspace populate the Central Pharmacy queue with drug generic names, dosages, durations, and Schedule H1 flags.
3. **Closed-Loop Vault Sync**: Once the lab verifies a report or the pharmacy dispenses medication, the status is pushed back to the Patient’s Longitudinal Health Record and the Doctor's Encounter History, preventing clinical blindspots.

---

## 6. Module-by-Module UML Diagrams & Technical Workflows

### 6.1 Patient Healthcare Module (`WIDA.health`)
**Owner**: Yashasvi Saini (`24EARAD184`)

The Patient Module serves as the patient's personal electronic health vault and primary access point for teleconsultations, laboratory bookings, medicine deliveries, and wellness tracking.

```mermaid
stateDiagram-v2
    [*] --> Unregistered
    Unregistered --> ABHA_Verification: Enter Aadhaar or Mobile
    ABHA_Verification --> Active_Profile: OTP Authenticated and Consent Approved
    
    state Active_Profile {
        [*] --> Dashboard
        Dashboard --> Find_Doctors: Search Specialty or City or AYUSH
        Find_Doctors --> Book_Slot: Select Date and Time Slot
        Book_Slot --> Appointment_Confirmed: Instant Slot Locking and Notification
        
        Dashboard --> Health_Records: View Longitudinal EHR Vault
        Health_Records --> View_Lab_Reports: Interactive Diagnostic Gauges
        Health_Records --> View_Prescriptions: Active Medications and Refill Requests
        
        Dashboard --> Wellness_Tracker: Sync Wearable and Daily Routine
        Dashboard --> Government_Schemes: Search PM-JAY and State Benefits
    }
    
    Active_Profile --> Emergency_Triggered: SOS Panic Button Pressed
```

#### What This Workflow Achieves:
- **ABDM ABHA Linkage**: Generates a standardized 14-digit ABHA ID, enabling interoperability across national healthcare databases.
- **AYUSH & Modern Medicine Integration**: Uniquely allows patients to toggle between Allopathic specialists and certified Ayurvedic/Homeopathic practitioners.
- **Sovereign Consent Control**: Patients retain explicit revocation rights over which practitioners can view their historical encounters.

---

### 6.2 Doctor Clinical Workspace (`WIDA.doc`)
**Owner**: Vanshika Tailor (`24EARAD175`)

The Doctor Module equips medical practitioners with an enterprise clinical cockpit for triage, electronic health record review, 3D anatomical mapping, e-prescribing, and professional growth tracking.

```mermaid
stateDiagram-v2
    [*] --> Doctor_Registration
    Doctor_Registration --> Credential_Review: Upload MCI or NMC Degree and License
    Credential_Review --> Verified_Practitioner: Verification Approved
    
    state Verified_Practitioner {
        [*] --> Clinical_Queue
        Clinical_Queue --> Appointment_Management: Accept or Reject or Reschedule
        Appointment_Management --> Active_Consultation: Patient Checks In
        
        state Active_Consultation {
            [*] --> Review_Patient_History
            Review_Patient_History --> Interactive_3D_Anatomy: Tag Pathologies and Organs
            Interactive_3D_Anatomy --> Clinical_Encounter_Notes: Record Symptoms and Vitals
            Clinical_Encounter_Notes --> E_Prescription_Builder: Select Formulations and Schedule
            E_Prescription_Builder --> Diagnostic_Order: Request Lab Diagnostic Test
            Diagnostic_Order --> Consultation_Complete: Push to Pharmacy and Lab
        }
        
        Clinical_Queue --> Practitioner_Profile: Update Clinic Hours and Fees
        Practitioner_Profile --> Achievements_Rankings: View Verified Patient Count and Badges
    }
```

#### What This Workflow Achieves:
- **Interactive 3D Anatomical Diagnostics**: Practitioners can rotate a Three.js 3D human body model, isolate skeletal, cardiovascular, or nervous layers, and pinpoint focal lesion sites.
- **Transparent Ranking & Progression Logic**: Doctors advance through professional achievement tiers (Tier 1: General Practitioner to Tier 5: Fellow/Consultant) based strictly on verified completed patient encounters and peer-reviewed credentials.
- **Schedule Rescheduling & Conflict Detection**: Automated calendar locks eliminate double-booking across hospital and teleconsultation hours.

---

### 6.3 Diagnostic Pathology Laboratory Module (`WIDA.lab`)
**Owner**: Vaishnavi Singh (`24EARAD173`)

The Laboratory Module implements a complete Laboratory Information Management System (LIMS) adhering strictly to **NABL ISO 15189:2022** guidelines for specimen integrity, quality control, and pathologist verification.

```mermaid
stateDiagram-v2
    [*] --> Lab_Registration
    Lab_Registration --> NABL_Verification: Upload Accreditation Certificate
    NABL_Verification --> Active_LIMS: Facility Approved
    
    state Active_LIMS {
        [*] --> Inbound_Test_Orders
        Inbound_Test_Orders --> Specimen_Accessioning: Assign 12-Digit Barcode and Tri-Color Tube
        
        state Specimen_Accessioning {
            [*] --> Tube_Selection
            Tube_Selection --> Lavender_EDTA: Hematology CBC and ESR
            Tube_Selection --> Gold_SST: Biochemistry and Serology
            Tube_Selection --> Grey_NaF: Blood Glucose and Lactate
        }
        
        Specimen_Accessioning --> Quality_Check: Inspect Specimen Volume and Quality
        Quality_Check --> Specimen_Rejected: Hemolyzed or Clotted or Insufficient
        Quality_Check --> Processing: Centrifugation and Automated Analyzer
        
        Processing --> Draft_Report: Enter Numerical Findings
        Draft_Report --> Verification_Gate: Pathologist Clinical Review
        Verification_Gate --> Report_Published: Locked and Digitally Stamped
        
        Report_Published --> Versioned_Amendment: Error Correction with Addendum
        Report_Published --> Automated_Billing: Invoicing and Receipt Generation
    }
```

#### What This Workflow Achieves:
- **Standardized Phlebotomy Color Coding**: Enforces NABL tube selection at accessioning:
  - *Lavender Top (K2-EDTA)*: Complete Blood Count (CBC), HbA1c, ESR.
  - *Gold Top (SST / Gel Separator)*: Lipid Profile, Liver Function Tests, Serum Creatinine.
  - *Grey Top (Sodium Fluoride / Potassium Oxalate)*: Fasting & Post-Prandial Plasma Glucose.
- **Pathologist Verification Gate**: Unverified reports cannot be viewed by patients. Once published, reports are cryptographically locked; corrections must be recorded as timestamped, versioned amendments.
- **Specimen Rejection Audit**: Rejections capture forensic reasons (e.g., in-vitro hemolysis, micro-clots, QNS - quantity not sufficient) protecting diagnostic accuracy.

---

### 6.4 Central Pharmacy Module (`WIDA.pharmacy`)
**Owner**: Yogita (`24EARAD189`)

The Pharmacy Module connects electronic prescriptions directly to physical or digital medicine fulfillment, preventing handwritten prescription errors and enforcing national drug regulations.

```mermaid
stateDiagram-v2
    [*] --> Pharmacy_Registration
    Pharmacy_Registration --> Drug_License_Verification: Validate State FDA or Form 20B 21B
    Drug_License_Verification --> Active_Dispensary: Licensed Dispensary
    
    state Active_Dispensary {
        [*] --> Incoming_Prescription_Queue
        Incoming_Prescription_Queue --> Prescription_Validation: Verify Doctor Reg and Patient ID
        
        state Prescription_Validation {
            [*] --> Schedule_H1_Check: Contains Antibiotics or Psychotropics
            Schedule_H1_Check --> Flag_Schedule_H1: Require Patient Aadhaar and Doctor ID Log
            Schedule_H1_Check --> Standard_Check: General Therapeutics
        }
        
        Prescription_Validation --> Inventory_Allocation: Match Batch Numbers and Expiry Dates
        Inventory_Allocation --> Out_of_Stock: Alternative Generic Suggestion
        Inventory_Allocation --> Packing_Dispensation: Decrement Physical Inventory
        
        Packing_Dispensation --> Dispense_Complete: Generate Tax Invoice and Dose Directions
        Dispense_Complete --> Patient_Record_Update: Mark Rx as Fulfilled in Health Vault
    }
```

#### What This Workflow Achieves:
- **Zero-Transcription Error**: Eliminates illegible handwriting errors by pulling validated structured prescriptions directly from the Doctor Workspace.
- **Schedule H1 Compliance**: Under the Drugs and Cosmetics Rules, Schedule H1 drugs (e.g., 3rd gen cephalosporins, carbapenems) require recording the doctor's registration, patient address, and quantity dispensed in an immutable register.
- **Real-Time Stock Decrement**: Dispensing a prescription automatically deducts batch units from inventory and triggers reorder alerts when stocks dip below buffer thresholds.

---

### 6.5 Emergency Ambulance & Trauma Alert System (`WIDA.sos`)
**Owner**: Vaidik Nama (`24EARAD172`)

The Emergency Alert Module is an ultra-reliable, low-friction lifeline engineered to connect patients with critical emergency medical services (EMS) within seconds.

```mermaid
sequenceDiagram
    autonumber
    actor Caller as Patient / Bystander
    participant Gateway as WIDA Emergency Switch
    participant Geocoder as GPS Geolocation Engine
    participant Fleet as Emergency Ambulance Fleet
    participant Trauma as Nearest Trauma Center ER

    Caller->>Gateway: Triggers Emergency SOS One-Tap Panic
    Gateway->>Geocoder: Requests Lat and Long Coordinates
    Geocoder-->>Gateway: Precise Coordinates Resolved (Lat 28.6139 N, Long 77.2090 E)
    Gateway->>Gateway: Extracts Patient Baseline (Blood Group B+, Allergies, Cardiac History)
    
    par Dual Dispatch Broadcast
        Gateway->>Fleet: Broadcasts Urgent Dispatch to Nearest Advanced Life Support Unit
        Fleet->>Gateway: Unit ALS-104 Acknowledges and En Route (ETA 6 mins)
    and Trauma Notification
        Gateway->>Trauma: Pre-alerts ER Trauma Desk with Incoming Patient Profile and ETA
    end
    
    Gateway-->>Caller: Displays Live Ambulance Radar Map and Paramedic Direct Line
    Fleet->>Trauma: Paramedic Arrival at Scene, En Route, and Hospital Handover
    Trauma->>Gateway: Closes Emergency Incident, Ingests Field Vitals into Patient EHR
```

#### The 7-Stage Emergency Protocol (From Specification PDF):
1. **Trigger**: 1-tap activation from any patient portal view or lock screen widget.
2. **Patient Context**: Prepares minimum necessary emergency context (blood type, baseline medications, critical allergies).
3. **Location**: Acquires high-precision browser/device GPS coordinates.
4. **Response Routing**: Identifies nearest available Advanced Life Support (ALS) or Basic Life Support (BLS) ambulances.
5. **Status Tracking**: Live telemetry shows dispatch status (`Dispatched` → `En Route` → `At Scene` → `Transporting` → `Arrived`).
6. **Hospital/Doctor Coordination**: Attending trauma physicians receive real-time pre-arrival vitals.
7. **Closure & Audit**: Generates an emergency incident report integrated into the patient’s longitudinal medical vault.

---

## 7. Module-by-Module Visual Screenshot Gallery

Every interface in WIDA is engineered with sleek medical-grade aesthetics, modern dark/light typography, intuitive accessibility, and real-time responsiveness. Below is the complete screenshot catalog of all 16 ecosystem surfaces:

### 7.1 Unified Authentication & Security Gateway
| Screenshot View | Description & Clinical Capabilities |
| :---: | :--- |
| ![Unified Auth Gateway](docs/screenshots/01_unified_auth_gateway.png) | **01: Unified Multi-Portal Authentication Gateway**<br/>The central access terminal providing role-specific entry doors for Patients, Doctors, Labs, and Pharmacies. Features 1-click autofill for the 16 demo personas. |
| ![Security Role Isolation](docs/screenshots/15_auth_security_role_isolation.png) | **02: Cryptographic Zero-Trust Role Isolation Gate**<br/>Demonstrates active prevention of cross-role authentication. Patient credentials attempting access to Doctor or Lab portals are rejected with clear security feedback. |

---

### 7.2 Patient Healthcare Portal (`WIDA.health`)
| Screenshot View | Description & Clinical Capabilities |
| :---: | :--- |
| ![Patient Portal Dashboard](docs/screenshots/02_patient_portal_dashboard.png) | **03: Patient Clinical Dashboard**<br/>Comprehensive home view showcasing active vital signs, upcoming specialist appointments, quick action links for home lab tests, and emergency SOS trigger. |
| ![Patient Find Doctors](docs/screenshots/08_patient_find_doctors.png) | **04: Certified Specialist Directory & Appointment Booking**<br/>Search and filter accredited doctors by specialty (Cardiology, Orthopedics, AYUSH), review clinical credentials, and lock appointment slots. |
| ![Patient Health Records](docs/screenshots/09_patient_health_records.png) | **05: Longitudinal Electronic Health Records (EHR) Vault**<br/>Chronological medical timeline archiving clinical encounters, past diagnoses, immunization records, and allergy profiles with ABDM compliance. |
| ![Patient Prescriptions](docs/screenshots/10_patient_prescriptions.png) | **06: Active Prescriptions & Pharmacy Order Tracking**<br/>Live view of digital prescriptions issued by attending doctors, with refill tracking, dosage schedules, and direct one-click pharmacy ordering. |

---

### 7.3 Doctor Clinical Workspace (`WIDA.doc`)
| Screenshot View | Description & Clinical Capabilities |
| :---: | :--- |
| ![Doctor Clinical Dashboard](docs/screenshots/03_doctor_clinical_dashboard.png) | **07: Clinical Dashboard with Interactive 3D Anatomy Model**<br/>Doctor workspace centerpiece featuring a fully rotatable 3D human body model for anatomical pathology tagging, daily appointment metrics, and patient volume graphs. |
| ![Doctor Appointments Queue](docs/screenshots/11_doctor_appointments_queue.png) | **08: Real-Time Patient Triage & Appointment Scheduler**<br/>Interactive queue for incoming appointment requests. Doctors can review patient clinical summaries, accept, reschedule, or triage urgent cases. |
| ![Doctor Teleconsultations](docs/screenshots/12_doctor_teleconsultations.png) | **09: Clinical Consultation & Case Encounter Console**<br/>Encounter documentation interface where doctors record subjective symptoms, objective vital signs, clinical impressions, and encounter notes. |
| ![Doctor Prescription Builder](docs/screenshots/13_doctor_prescription_builder.png) | **10: Intelligent Electronic Prescription (e-Rx) Builder**<br/>Structured medication ordering interface with dosage dropdowns, frequency schedules, duration selectors, food instructions, and automated pharmacy transmission. |
| ![Doctor Practitioner Profile](docs/screenshots/04_doctor_practitioner_profile.png) | **11: Practitioner Credential Vault & Licensing Profile**<br/>Verification console displaying Medical Council Registration (MCI/NMC), qualifications, consultation fees, clinic locations, and level progression badges. |

---

### 7.4 Diagnostic Pathology Laboratory Module (`WIDA.lab`)
| Screenshot View | Description & Clinical Capabilities |
| :---: | :--- |
| ![Diagnostic Lab Portal](docs/screenshots/05_diagnostic_laboratory_portal.png) | **12: NABL Accredited LIMS Accessioning Workspace**<br/>Pathology operations dashboard displaying specimen accessioning queues, phlebotomy tube color codes, centrifuge batches, and report sign-off queues. |
| ![Lab Test Catalogue](docs/screenshots/06_lab_test_catalogue.png) | **13: Diagnostic Test Catalogue & Comprehensive Health Checkup Packages**<br/>Management console for specific tests (Lipid, CBC, HbA1c, Thyroid) and full-body health screening packages with sample requirements and turnaround times. |

---

### 7.5 Central Pharmacy & AI Assistant Modules
| Screenshot View | Description & Clinical Capabilities |
| :---: | :--- |
| ![Central Pharmacy Dispensation](docs/screenshots/07_central_pharmacy_dispensation.png) | **14: Real-Time Prescription Dispensation & Inventory Desk**<br/>Pharmacy fulfillment terminal displaying live incoming e-prescriptions, Schedule H1 antibiotic warnings, stock allocation, and dispensation stamping. |
| ![Pharmacy Prescription Sync](docs/screenshots/16_pharmacy_prescription_sync.png) | **15: Live Cross-Module Prescription Sync Engine**<br/>Visual verification of instantaneous transmission of doctor-prescribed medications into the pharmacy fulfillment queue without manual data entry. |
| ![Universal AI Healthcare Assistant](docs/screenshots/14_universal_ai_healthcare_assistant.png) | **16: Universal 24/7 Clinical AI Assistant (`WIDA AI`)**<br/>Embedded multi-role intelligence agent assisting patients with symptom triage, doctors with diagnostic differential references, and pharmacists with drug interactions. |

---

## 8. Comprehensive Software Requirements Specification (SRS)

### 8.1 Functional Requirements Matrix (Traceable to PDF Specification)

| Req ID | Module / Area | Detailed Functional Requirement Specification | Priority | Status |
| :--- | :--- | :--- | :---: | :---: |
| **FR-01** | **Identity & Access** | Multi-role registration and login isolating Patient, Doctor, Lab, and Pharmacy credentials. | **High** | ✅ Implemented |
| **FR-02** | **Doctor Verification** | Secure upload and verification of MCI/NMC medical license, degree, and clinic credentials. | **High** | ✅ Implemented |
| **FR-03** | **Patient Profile & EHR** | Centralized patient health vault with ABHA ID, conditions, allergies, and care history. | **High** | ✅ Implemented |
| **FR-04** | **Doctor Scheduling** | Real-time doctor availability management with slot locking and accept/reject/reschedule controls. | **High** | ✅ Implemented |
| **FR-05** | **Authorized EHR Access** | Consent-driven medical history access granting attending physicians visibility into past records. | **High** | ✅ Implemented |
| **FR-06** | **Consultation Remarks** | Structured encounter documentation capturing symptoms, physical findings, and diagnoses. | **High** | ✅ Implemented |
| **FR-07** | **Doctor Achievements** | Multi-tier achievement progression and ranking based on verified patient interactions. | **Medium** | ✅ Implemented |
| **FR-08** | **Diagnostic Catalogue** | Comprehensive test catalogue supporting both individual tests and full-body health packages. | **High** | ✅ Implemented |
| **FR-09** | **Phlebotomy Accessioning**| Barcoded specimen accessioning with tri-color tube classification (Lavender, Gold, Grey). | **High** | ✅ Implemented |
| **FR-10** | **Authorized Digital Reports**| NABL-compliant pathologist dual-sign authorization with immutable report locking. | **High** | ✅ Implemented |
| **FR-11** | **Traceable Amendments** | Versioned amendment logs allowing report addenda without overwriting historical results. | **Medium** | ✅ Implemented |
| **FR-12** | **E-Prescription Workflow** | Real-time transmission of doctor electronic prescriptions into the central pharmacy queue. | **High** | ✅ Implemented |
| **FR-13** | **Schedule H1 Compliance** | Mandatory patient and practitioner logging for restricted antibiotics and psychotropic drugs. | **High** | ✅ Implemented |
| **FR-14** | **Personal Hygiene & Wellness**| Dedicated preventive care section covering hygiene guidelines and wearable fitness data sync. | **Medium** | ✅ Implemented |
| **FR-15** | **Government Healthcare** | National and state healthcare scheme directory (PM-JAY, CGHS) with eligibility guidelines. | **Medium** | ✅ Implemented |
| **FR-16** | **Emergency SOS Alert** | 7-stage emergency dispatch protocol transmitting GPS coordinates and baseline patient context. | **High** | ✅ Implemented |
| **FR-17** | **Alternative Medicine** | Dedicated support for AYUSH systems (Ayurveda, Homeopathy, Unani) within the specialist directory. | **Medium** | ✅ Implemented |
| **FR-18** | **Closed-Loop Data Loop** | Autonomous bi-directional synchronization connecting Doctor -> Lab -> Pharmacy -> Patient. | **High** | ✅ Implemented |

---

## 9. Automated Verification Test Suite

WIDA includes an automated verification test suite containing **33 rigorous unit and integration test assertions** covering security, database constraints, state machines, and cross-module synchronization:

```bash
node lab/tests/labTestSuite.js
```

### Test Suite Execution Output
```
================================================================================
          WIDA CLINICAL HEALTHCARE ECOSYSTEM — AUTOMATED VERIFICATION SUITE
================================================================================
[Suite 1: Authentication & Password Security]
  ✔ Passwords hashed with cryptographic salts                              [PASS]
  ✔ Inactive accounts cannot generate valid authorization tokens           [PASS]
  ✔ Cross-portal token exchange blocked by role verification gate          [PASS]
  ✔ Session invalidation operates reliably on logout                       [PASS]
  ✔ Rate limiting prevents automated brute-force attacks                   [PASS]

[Suite 2: Laboratory Registration & Verification]
  ✔ NABL accreditation format validation (NABL-YYYY-MC-XXXX)               [PASS]
  ✔ Unverified laboratories blocked from publishing patient reports        [PASS]

[Suite 3: Database Persistence & Relational Schema]
  ✔ Relational foreign key constraints enforced on test bookings           [PASS]
  ✔ Concurrent transactions maintain strict SQLite ACID guarantees         [PASS]

[Suite 4: Test Catalogue & Health Packages]
  ✔ Specific tests maintain verified biological reference ranges           [PASS]
  ✔ Comprehensive health packages dynamically expand into sub-tests        [PASS]
  ✔ Fasting requirement flags persist correctly across test orders         [PASS]

[Suite 5: Booking Creation & Accessioning]
  ✔ Unique 12-digit specimen accession barcode generated per sample        [PASS]
  ✔ Phlebotomy tube color correctly mapped (EDTA / SST / NaF)              [PASS]

[Suite 6: Booking State Transitions & Audit Trail]
  ✔ State machine strictly enforces: Pending -> Collected -> Received     [PASS]
  ✔ Processing -> Verified transitions log pathologist timestamp           [PASS]

[Suite 7: Specimen Quality Check & Rejection]
  ✔ Hemolyzed blood specimens rejected with mandatory reason code          [PASS]
  ✔ Specimen rejection automatically alerts attending physician            [PASS]

[Suite 8: RBAC Verification Authority Gate]
  ✔ Non-pathologist roles cannot trigger digital report sign-off           [PASS]
  ✔ Unauthorized report edits return HTTP 403 Forbidden                    [PASS]
  ✔ Dual-sign verification requires secondary consultant approval           [PASS]

[Suite 9: Report Verification & Publication Lock]
  ✔ Published reports cryptographically locked against in-place edits     [PASS]
  ✔ Digital verification stamp contains NABL registration number           [PASS]
  ✔ Published status immediately synchronizes to Patient Health Vault      [PASS]

[Suite 10: Traceable Versioned Amendments]
  ✔ Amended reports generate incremented version numbers (v2.0)            [PASS]
  ✔ Original test results preserved in immutable historical audit log      [PASS]

[Suite 11: Invoicing & Monetary Calculations]
  ✔ GST tax calculations compute accurately on diagnostic invoices         [PASS]
  ✔ Co-pay and government scheme subsidies deduct correctly               [PASS]
  ✔ Itemized breakdown matches lab catalogue rates                         [PASS]
  ✔ Zero-balance receipts generated on successful settlement               [PASS]

[Suite 12: Cross-Module Closed-Loop Isolation & Bridge]
  ✔ Doctor prescription ingestion into Pharmacy queue completes in < 50ms   [PASS]
  ✔ Doctor test orders appear in Lab accessioning queue without data loss  [PASS]
  ✔ Emergency SOS alert triggers telemetry packet dispatch in < 15ms       [PASS]
================================================================================
  TOTAL VERIFICATIONS: 33 PASSED | 0 FAILED | ALL HEALTHCARE SUITES HEALTHY
================================================================================
```

---

## 10. Academic Research References & Literature Citations

The architectural design, regulatory workflows, and clinical safeguards of WIDA are grounded in peer-reviewed medical informatics literature, national healthcare frameworks, and international diagnostic standards:

1. **National Health Authority (NHA), Ministry of Health and Family Welfare (MoHFW), Government of India.**  
   *Ayushman Bharat Digital Mission (ABDM): Sandbox Architecture and Health Data Management Policy.* (2020–2023).  
   🔗 [https://abdm.gov.in/publications](https://abdm.gov.in)  
   *Context*: Governs WIDA's implementation of 14-digit ABHA IDs, patient-centric consent managers, and longitudinal Electronic Health Record (EHR) federated querying.

2. **Health Level Seven International (HL7).**  
   *HL7 Fast Healthcare Interoperability Resources (FHIR®) Release 4 & Release 5.* ANSI Accredited Standard. (2019/2023).  
   🔗 [https://hl7.org/fhir/](https://hl7.org/fhir/)  
   *Context*: Provides the foundational REST schemas for WIDA clinical entities including `Patient`, `Practitioner`, `Encounter`, `Condition`, `DiagnosticReport`, and `MedicationRequest`.

3. **International Organization for Standardization (ISO) & National Accreditation Board for Testing and Calibration Laboratories (NABL).**  
   *ISO 15189:2022 — Medical laboratories: Requirements for quality and competence.* (Published Dec 2022); NABL 112 Specific Criteria.  
   🔗 [https://www.iso.org/standard/76677.html](https://www.iso.org/standard/76677.html) | [https://nabl-india.org/](https://nabl-india.org/)  
   *Context*: Direct basis for WIDA's diagnostic specimen accessioning, tube color classification protocols, pathologist dual-sign verification gate, and traceable versioned amendments.

4. **Bates, D. W., Leape, L. L., Cullen, D. J., et al.**  
   *Effect of computerized physician order entry and clinical decision support systems on medication safety: a review.*  
   *Journal of the American Medical Informatics Association (JAMIA)*, 8(4), 299–308 (2001).  
   🔗 [https://doi.org/10.1136/jamia.2001.0080299](https://doi.org/10.1136/jamia.2001.0080299)  
   *Context*: Guides WIDA's structured electronic prescription builder to eliminate adverse drug events (ADEs) caused by handwritten medication ambiguities.

5. **Poon, E. G., Keohane, C. A., Yoon, C. S., et al.**  
   *Effect of Bar-Code Technology on the Safety of Medication Administration and Specimen Tracking.*  
   *New England Journal of Medicine (NEJM)*, 362(18), 1698–1707 (2010).  
   🔗 [https://doi.org/10.1056/NEJMsa0907115](https://doi.org/10.1056/NEJMsa0907115)  
   *Context*: Establishes the scientific requirement for WIDA's 12-digit barcoded specimen accessioning and phlebotomy verification procedures.

6. **Ministry of Health and Family Welfare (MoHFW) & Board of Governors in supersession of Medical Council of India (MCI).**  
   *Telemedicine Practice Guidelines: Enabling Registered Medical Practitioners to Provide Healthcare Using Telemedicine.* (March 25, 2020).  
   🔗 [https://www.mohfw.gov.in/pdf/Telemedicine.pdf](https://www.mohfw.gov.in/pdf/Telemedicine.pdf)  
   *Context*: Informs the practitioner onboarding flow, verification against the National Medical Register, digital prescription templates, and teleconsultation boundaries.

7. **Koppel, R., Metlay, J. P., Cohen, A., et al.**  
   *Role of computerized physician order entry systems in facilitating medication errors.*  
   *JAMA: The Journal of the American Medical Association*, 293(10), 1197–1203 (2005).  
   🔗 [https://doi.org/10.1001/jama.293.10.1197](https://doi.org/10.1001/jama.293.10.1197)  
   *Context*: Highlighted failure modes in legacy clinical software, directly shaping WIDA's safety-first dosage selectors, allergy alerts, and prescription verification gates.

8. **World Health Organization (WHO).**  
   *WHO Guideline: Recommendations on Digital Interventions for Health System Strengthening.* Geneva: World Health Organization (2019).  
   🔗 [https://www.who.gov/publications/i/item/9789241550505](https://www.who.gov/publications/i/item/9789241550505)  
   *Context*: Principles for personal preventive wellness tracking, mobile emergency notifications, and national health scheme democratization.

---

## 11. Installation, Build & Local Execution Guide

### 11.1 Prerequisites
- **Java Development Kit (JDK)**: Version 21 LTS (Oracle OpenJDK or Microsoft Build of OpenJDK)
- **Node.js**: Version 20.x or 24.x LTS (with `npm`)
- **Git**: Version 2.x+
- **Operating System**: Windows 10/11, macOS, or Ubuntu Linux

### 11.2 Clone Repository & Install Dependencies
```bash
# Clone the official repository
git clone https://github.com/yashasvi202006/WIDA.git
cd WIDA

# Checkout the primary development branch
git checkout develop

# Install root dependencies
npm install
```

### 11.3 One-Click Automated Execution

#### Option A: Windows Native C# Executable (Recommended for Windows)
Double-click `WIDA_Launcher.exe` in the root folder.  
- Verifies system ports (5173, 8080, 8082).
- Boots the Java Patient Backend, Lab REST API, and Vite Frontend concurrently.
- Automatically launches your default web browser to `http://localhost:5173/?login=true`.

#### Option B: Windows Automated Batch Launcher
```cmd
START_WIDA_ECOSYSTEM.bat
```

#### Option C: Cross-Platform Manual Startup (macOS / Linux / Windows)
If running services manually in separate terminal tabs:

```bash
# Terminal 1 — Patient Java Backend (Port 8080)
cd src/modules/patient/backend
java -cp "bin;lib/*" com.wida.patient.backend.PatientBackendServer

# Terminal 2 — Diagnostic Laboratory REST API (Port 8082)
cd lab/backend
node server.js

# Terminal 3 — Unified Client Frontend (Port 5173)
npm run dev
```

Navigate to: `http://localhost:5173/?login=true`

### 11.4 Production Build Verification
To compile the production distribution bundle:
```bash
npm run build
```

---

<p align="center">
  <strong>WIDA — Worldwide Integrated Digital Healthcare Architecture</strong><br/>
  Final-Year Capstone Project • Academic Year 2025–2026<br/>
  Department of Computer Science & Engineering / Artificial Intelligence & Data Science<br/>
  Licensed under the MIT License.
</p>
