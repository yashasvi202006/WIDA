# WIDA Patient Module - Java Backend & SQLite Database

Enterprise backend service for the **WIDA Patient Module**, built **exclusively in pure Java (JDK 21)** with a native **SQLite relational database** connected via JDBC.

---

## 🌟 Key Features

1. **Pure Java Runtime**:
   - Zero reliance on Node.js or Python backend frameworks.
   - Built with Java 21's lightweight `com.sun.net.httpserver.HttpServer` and high-performance **Virtual Threads** (`Executors.newVirtualThreadPerTaskExecutor()`).

2. **Persistent Relational Database (SQLite via JDBC)**:
   - File-based SQL database: `patient.db`
   - Relational tables with indexes, primary keys, and relations:
     - `patient_profile`
     - `doctors`
     - `appointments`
     - `prescriptions`
     - `pharmacy_orders`
     - `diagnostic_tests`
     - `labs`
     - `lab_reports`
     - `lab_bookings`
     - `care_journey`
     - `wellness_metrics`
     - `wearable`
     - `emergency_requests`
     - `notifications`
     - `reminders`
     - `consent_permissions`
     - `medical_documents`
     - `government_schemes`
   - **Auto-Seeder**: Pre-populates realistic clinical records, doctors, prescriptions, and health metrics on first run.

3. **Full REST API Suite with CORS**:
   - Out-of-the-box support for browser cross-origin requests (`CORS`, pre-flight `OPTIONS`).
   - Seamlessly serves the React frontend on `http://localhost:5173` or any port.

---

## 🚀 Quick Start (Running the Java Backend)

### Method 1: Double-click or run `run.bat` (Windows)
```cmd
run.bat
```

### Method 2: PowerShell
```powershell
.\run.ps1
```

### Method 3: Standard Java Command Line
```cmd
javac -cp "lib/*" -d bin src\com\wida\patient\backend\config\*.java src\com\wida\patient\backend\util\*.java src\com\wida\patient\backend\model\*.java src\com\wida\patient\backend\db\*.java src\com\wida\patient\backend\controller\*.java src\com\wida\patient\backend\PatientBackendServer.java
java -cp "bin;lib/*" com.wida.patient.backend.PatientBackendServer
```

### Method 4: Maven (if installed)
```cmd
mvn clean compile exec:java
```

The server will start on:
👉 **`http://localhost:8080`**

---

## 📡 API Endpoints Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/system/health` | `GET` | Server and SQLite Database status check |
| `/api/system/reset-db` | `POST` | Resets SQLite database and re-seeds data |
| `/api/patient/auth/login` | `POST` | Patient login (Email, Phone or ABHA) |
| `/api/patient/auth/register` | `POST` | Register patient & assign ABHA ID |
| `/api/patient/auth/me` | `GET` | Get current session user |
| `/api/patient/profile` | `GET`, `PUT` | Retrieve or update patient clinical profile |
| `/api/patient/doctors` | `GET` | Search & filter doctors (Ayurveda, Allopathy, etc.) |
| `/api/patient/doctors/{id}` | `GET` | Get single doctor details |
| `/api/patient/appointments` | `GET`, `POST` | View and schedule appointments |
| `/api/patient/appointments/{id}/cancel` | `PATCH` | Cancel an appointment |
| `/api/patient/prescriptions` | `GET` | List active prescriptions |
| `/api/patient/prescriptions/{id}/order` | `POST` | Forward prescription to E-Pharmacy |
| `/api/patient/pharmacy/orders` | `GET` | List orders in processing / ready |
| `/api/patient/diagnostics/tests` | `GET` | Diagnostic test catalog |
| `/api/patient/diagnostics/labs` | `GET` | Empaneled diagnostic labs |
| `/api/patient/diagnostics/reports` | `GET` | Patient lab reports & biomarkers |
| `/api/patient/diagnostics/bookings` | `GET`, `POST` | Lab appointments |
| `/api/patient/care-journey` | `GET` | Chronological care journey steps |
| `/api/patient/wellness/metrics` | `GET` | Vital signs and wellness metrics |
| `/api/patient/wellness/wearable` | `GET` | Connected smartwatch/wearable metrics |
| `/api/patient/emergency/active` | `GET` | Active SOS emergency request |
| `/api/patient/emergency/sos` | `POST` | Trigger ambulance and hospital dispatch |
| `/api/patient/notifications` | `GET`, `POST`, `PATCH`, `DELETE` | Notification center |
| `/api/patient/reminders` | `GET`, `POST`, `PATCH`, `DELETE` | Medication and visit reminders |
| `/api/patient/privacy/consent` | `GET`, `PATCH` | Manage consent permissions |
| `/api/patient/vault/documents` | `GET`, `POST` | Medical vault document records |
| `/api/patient/schemes` | `GET` | Ayushman Bharat & ABHA benefits |
| `/api/patient/ai/chat` | `POST` | AI clinical triage assistant |

---

## 📂 Project Architecture

```
src/modules/patient/backend/
├── lib/                             # Embedded JAR dependencies (SQLite JDBC, Gson, SLF4J)
│   ├── sqlite-jdbc.jar
│   ├── gson.jar
│   ├── slf4j-api.jar
│   └── slf4j-simple.jar
├── patient.db                       # Native SQLite Relational Database file
├── pom.xml                          # Maven build definition
├── run.bat                          # One-click Windows runner
├── run.ps1                          # PowerShell runner
└── src/
    └── com/wida/patient/backend/
        ├── PatientBackendServer.java# Server entry point (Port 8080)
        ├── config/                  # Server and DB connection configs
        ├── db/                      # DatabaseManager & DatabaseSeeder
        ├── model/                   # Healthcare POJO data models
        ├── controller/              # HTTP REST controllers with CORS
        └── util/                    # JSON serialization utilities
```
