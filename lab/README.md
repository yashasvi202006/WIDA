# WIDA Diagnostic Laboratory Module

Enterprise-grade, NABL-compliant **Diagnostic Laboratory & Pathology Management Module** for the **WIDA** (Integrated Digital Healthcare Ecosystem).

Built independently on branch `feature/lab` with **zero modifications to any pre-existing project file**.

---

## 🌟 1. Module Architecture & Technology Choices

During inspection of the WIDA repository, the following technology environment was discovered:
- **Frontend Stack**: React 19 (`19.2.8`), Vite (`8.3.3`), `lucide-react` icons, standard Vanilla CSS design system.
- **Backend Stack**: Node.js `24.18.0` with native `node:sqlite`, `node:crypto`, `node:http`, and Java 21 LTS (`src/modules/patient/backend/patient.db`).
- **Database Architecture**: SQLite relational database. Existing patient profiles and doctor records reside in `patient.db`.

To strictly satisfy the **Critical File-Protection Rules (Rule 2 & Rule 8)**:
- All lab code resides exclusively in the isolated top-level `lab/` directory.
- The lab module maintains its own persistent SQLite database in `lab/database/lab.db`.
- The lab module integrates with `patient.db` in **strict read-only mode** (`readOnly: true`) via `patientDbAdapter.js` to cross-reference verified patients and doctors without risk of schema corruption.

```
lab/
├── frontend/                     # Independent React 19 + Vite Frontend
│   ├── index.html                # Independent entry point
│   ├── main.jsx                  # React root mount
│   ├── App.jsx                   # Main workspace shell & router
│   ├── components/               # Sidebar, TopNav, StatCard, Modal, Toast, Print Modals
│   ├── pages/                    # 8 complete operational screens
│   ├── services/                 # REST API client
│   └── styles/lab.css            # SynthCare medical SaaS aesthetic
├── backend/                      # Zero-dependency Node.js 24 REST Server (Port 8082)
│   ├── server.js                 # HTTP REST router with CORS and error handling
│   ├── middleware/               # Bearer JWT verification & RBAC authorization
│   └── utils/                    # PBKDF2 SHA-512 password hasher & validator
├── database/                     # SQLite Engine & Seed Data
│   ├── schema.sql                # 15 relational tables with constraints & indexes
│   ├── db.js                     # Native node:sqlite database manager
│   ├── seed.js                   # Clinical seed dataset (tests, packages, staff, reports)
│   ├── lab.db                    # Persistent SQLite file
│   └── adapters/
│       └── patientDbAdapter.js   # Read-only bridge to src/.../patient.db
├── tests/
│   └── labTestSuite.js           # 33 automated tests (100% passing)
├── .env.example                  # Environment configuration template
├── vite.config.js                # Dedicated Vite configuration (Port 5176)
├── run.bat                       # 1-Click Windows Batch Runner
├── run.ps1                       # 1-Click PowerShell Runner
└── README.md                     # Comprehensive documentation
```

---

## 🚀 2. Quick Start & Execution

### Option A: 1-Click PowerShell Runner (Recommended)
```powershell
.\lab\run.ps1
```

### Option B: 1-Click Windows Batch Runner
```cmd
lab\run.bat
```

### Option C: Manual CLI Execution
```powershell
# 1. Initialize and seed SQLite database
node lab/database/seed.js

# 2. Start the Laboratory REST API server (Port 8082)
node lab/backend/server.js

# 3. In a separate terminal, start the Frontend (Port 5176)
npx vite --config lab/vite.config.js
```

**Access URLs:**
- **Laboratory Frontend Web App**: 👉 `http://127.0.0.1:5176`
- **Laboratory REST Backend API**: 👉 `http://127.0.0.1:8082`
- **Backend Health Check**: 👉 `http://127.0.0.1:8082/api/lab/health`

---

## 🔐 3. Authentication & Preset Demo Credentials

The login screen (`LabLogin.jsx`) provides **1-Click Demo Login Buttons** for all clinical roles:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Lab Director** | `director@healthfirst.lab` | `LabDirector@2026` | Full administrative control, catalogue, verification, staff management |
| **Consultant Pathologist** | `pathologist@healthfirst.lab` | `Pathologist@2026` | Verification signature authority, clinical review, report publication |
| **Medical Lab Technician** | `technician@healthfirst.lab` | `Tech@2026` | Sample accessioning, raw analyser value transcription (Blocked from publishing) |
| **Unverified Lab** | `pending@newlab.org` | `Pending@2026` | Shows `PENDING_VERIFICATION` security notice with 1-click review simulator |

*Passwords are hashed using standard **PBKDF2 with SHA-512, 100,000 iterations**, and a unique 16-byte cryptographically secure salt.*

---

## 🗄️ 4. Relational Database Schema (`lab/database/schema.sql`)

The module creates 15 normalized tables inside `lab/database/lab.db`:

1. `labs`: Laboratory profiles, NABL accreditations, CEA license numbers, verification status.
2. `lab_staff`: Diagnostic staff accounts, roles (`LAB_DIRECTOR`, `PATHOLOGIST`, `TECHNICIAN`, `PHLEBOTOMIST`).
3. `lab_verifications`: Audit log for accreditation submissions and review remarks.
4. `test_catalogue`: Individual diagnostic tests, category, specimen type, TAT, preparation instructions, pricing.
5. `test_packages`: Health packages (e.g. Executive Full-Body, Senior Citizen, Diabetic Care).
6. `package_tests`: Many-to-many relationship linking packages to component tests.
7. `test_bookings`: Patient diagnostic bookings, appointment slots, home vs lab collection, status.
8. `booking_status_history`: Chronological audit log of every booking status transition.
9. `samples`: Barcoded specimens (`SMP-EDTA-8821`), tube colors (Purple, Gold, Red), acceptance/rejection condition.
10. `diagnostic_reports`: Certified reports, clinical conclusions, review status (`DRAFT`, `PENDING_VERIFICATION`, `VERIFIED`, `PUBLISHED`).
11. `report_parameters`: Biomarker parameters, observed values, reference ranges, status flags (`NORMAL`, `ELEVATED`, `LOW`, `CRITICAL`).
12. `report_audit_log`: Traceable clinical event log recording who entered results and who verified them.
13. `invoices`: Itemized tax invoices and bills of supply.
14. `invoice_items`: Individual test line items, SAC codes, unit prices.
15. `abdm_consents`: Interoperability consent records for Ayushman Bharat Digital Mission (ABDM).

---

## 📡 5. REST API Reference (Port 8082)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/lab/health` | Public | System status and database health check |
| `POST` | `/api/lab/auth/login` | Public | Staff and Lab login; returns signed JWT session token |
| `POST` | `/api/lab/auth/register` | Public | Lab onboarding (placed in `PENDING_VERIFICATION`) |
| `POST` | `/api/lab/auth/verify-account` | Public | Testing simulator for accreditation approval |
| `GET` | `/api/lab/auth/me` | Bearer Token | Authenticated session profile and lab metadata |
| `GET` | `/api/lab/dashboard/summary` | Bearer Token | Live database metrics and statistics |
| `GET` | `/api/lab/catalogue` | Bearer Token | Filterable diagnostic test catalogue |
| `POST` | `/api/lab/catalogue` | Director/Pathologist | Add new diagnostic test |
| `PUT` | `/api/lab/catalogue/:id` | Director/Pathologist | Update test specifications and pricing |
| `DELETE` | `/api/lab/catalogue/:id` | Director | Archive catalogue test |
| `GET` | `/api/lab/packages` | Bearer Token | List health checkup packages with component tests |
| `GET` | `/api/lab/bookings` | Bearer Token | Filterable list of patient test orders |
| `POST` | `/api/lab/bookings` | Bearer Token | Register walk-in patient order & generate barcode |
| `PATCH` | `/api/lab/bookings/:id/status` | Bearer Token | Advance booking state machine with audit note |
| `GET` | `/api/lab/samples` | Bearer Token | Accessioned samples and analyzer worklists |
| `PATCH` | `/api/lab/samples/:id/status` | Bearer Token | Update processing stage (`IN_PROCESSING`, `RESULTS_ENTERED`) |
| `POST` | `/api/lab/samples/:id/reject` | Bearer Token | Reject sample (Hemolyzed, Clotted) & trigger redraw |
| `GET` | `/api/lab/reports` | Bearer Token | List diagnostic reports by verification status |
| `GET` | `/api/lab/reports/:id` | Bearer Token | Full report with parameters and audit log |
| `PUT` | `/api/lab/reports/:id/results` | Bearer Token | Enter observed values and clinical conclusions |
| `POST` | `/api/lab/reports/:id/verify` | Pathologist/Director | **Security Gate**: Digitally sign verified report |
| `POST` | `/api/lab/reports/:id/publish` | Pathologist/Director | **Security Gate**: Publish certified report to EHR |
| `POST` | `/api/lab/reports/:id/amend` | Pathologist/Director | Issue traceable versioned amendment (v2) |
| `GET` | `/api/lab/billing/invoices` | Bearer Token | Billing overview and financial receipts |
| `PATCH` | `/api/lab/billing/invoices/:id/payment`| Bearer Token | Record patient fee collection (UPI, Card, Cash) |
| `GET` | `/api/lab/integration/patient-records` | Bearer Token | Safe read-only bridge to `patient.db` patient profiles |
| `GET` | `/api/lab/integration/doctor-referrals` | Bearer Token | Safe read-only bridge to `patient.db` doctors |
| `GET` | `/api/lab/integration/abdm-export/:id` | Bearer Token | Export FHIR R4 DiagnosticReport JSON bundle |

---

## 🔬 6. Step-by-Step Clinical Demo Workflow

Follow this complete clinical workflow to test the application:

1. **Sign In**:
   - Navigate to `http://127.0.0.1:5176`.
   - Click **"🏢 Lab Director"** or **"🔬 Pathologist"** 1-click button and click **Sign In**.
2. **Dashboard Review**:
   - Inspect the 8 live metric cards (Total Bookings, Samples Received, Revenue, etc.).
   - Review the Urgent Reports Sign-off Queue.
3. **Register a Walk-in Patient**:
   - Click **"+ Patient Walk-in Intake"**.
   - Enter name (e.g. *Aarav Kapoor*), phone, age, and select tests (e.g. *CBC* and *Lipid Profile*).
   - Click **Confirm Intake**.
   - Notice that a unique booking reference (`BK-2026-XXXX`), barcoded specimen ID (`SMP-XXXXXX`), and pending invoice (`INV-2026-XXXX`) are created in SQLite!
4. **Accession and Process the Sample**:
   - Navigate to **Sample Processing** in the sidebar.
   - Click **Advance** on the new sample to transition it to `IN_PROCESSING`, then `ANALYSER_COMPLETE`.
5. **Enter Laboratory Results**:
   - Navigate to **Diagnostic Reports**.
   - Select report `REP-2026-303` (Priya Sharma) or the newly created order.
   - Click the pencil icon (**Edit**).
   - Enter observed values (e.g. `Sensitive TSH: 6.42 mIU/L`) and pathological impression.
   - Click **Submit for Pathologist Sign-off**.
6. **Enforce Role-Based Pathologist Verification**:
   - In the top navigation bar, use the **Role Switcher** to switch to **"Technician"**.
   - Notice that the **Verify** and **Publish** buttons are disabled or rejected on the backend.
   - Switch back to **"Consultant Pathologist"**.
   - Click **Verify** (signs the report with digital signature), then click **Publish**.
7. **Print Certified Report & Export FHIR**:
   - Click the printer icon to open the **Certified Diagnostic Report** modal.
   - Inspect the NABL logo, patient info bar, parameter reference intervals, pathologist signature block, and ABDM QR code.
   - Click **Print / Export PDF**.
8. **Collect Billing Payment**:
   - Navigate to **Billing & Invoices**.
   - Click **Collect** on a pending invoice, select payment mode (*UPI* or *Card*), and confirm.
   - Open the **Tax Invoice** view and print the receipt.
9. **Inspect ABDM Interoperability**:
   - Navigate to **Patient & Doctor Hub**.
   - Verify connected patient profiles (e.g. *Yashasvi Saini*, `pat-001`, ABHA `91-4521-8902-3341`) loaded safely from `patient.db`.
   - Click **View FHIR R4 DiagnosticReport JSON Bundle** to inspect the interoperable clinical schema.

---

## 🧪 7. Automated Test Suite Execution

Run the lab test suite:
```powershell
node lab/tests/labTestSuite.js
```
**Results:** `33 PASSED | 0 FAILED` covering:
- PBKDF2/SHA-512 password hashing and JWT token cryptographic validation.
- Unverified lab account restrictions.
- 15 relational tables and performance indexing.
- Test catalogue and package mapping.
- Booking and sample barcode linkage.
- Specimen rejection condition handling.
- Pathologist-only verification and publication security gates.
- Publication locks and traceable versioned amendments (`v2`).
- Decimal-safe monetary calculations.
- Cross-laboratory tenant isolation.
- Safe read-only patient integration with `patient.db`.

---

## 🔗 8. Future Router Integration Guide

To connect the lab module into a future unified WIDA router without modifying existing routes:
```jsx
// In src/App.jsx:
import { LabApp } from '../lab/frontend/App.jsx';

// In root module switch:
if (currentModule === 'lab') {
    return <LabApp />;
}
```
No modifications to `src/App.tsx`, `package.json`, or existing patient/doctor pages are required.
