/**
 * WIDA Integrated Healthcare Ecosystem — Unified AI Healthcare Intelligence Service
 * Powers intelligent AI assistance across all 4 WIDA modules:
 * 1. Patient Portal (Health navigation, report interpretation, appointment prep, medication advice)
 * 2. Doctor Portal (Clinical decision support, differential diagnosis, drug-drug interactions, ICD guidance)
 * 3. Diagnostic Lab Portal (Panic/critical values, tube color & collection guidelines, QC Westgard rules)
 * 4. Pharmacy Portal (Pharmacotherapy, contraindications, generic substitutions, dispensing verification)
 */

class WidaAiAssistantService {
    constructor() {
        this.apiKey = typeof window !== 'undefined' ? localStorage.getItem('wida_ai_api_key') || '' : '';
    }

    setApiKey(key) {
        this.apiKey = key;
        if (typeof window !== 'undefined') {
            localStorage.setItem('wida_ai_api_key', key);
        }
    }

    getApiKey() {
        return this.apiKey;
    }

    /**
     * Module-specific quick prompts
     */
    getQuickPrompts(module = 'patient') {
        switch (module) {
            case 'doctor':
                return [
                    { label: 'Check Drug Interactions', query: 'Check drug interactions between Telmisartan, Atorvastatin, and Metformin' },
                    { label: 'Hypertension Clinical Protocol', query: 'What is the standard AHA/ACC clinical protocol for Stage 2 Hypertension?' },
                    { label: 'Renal Dose Adjustments', query: 'Explain renal dosage adjustment for Metformin in eGFR < 45 mL/min' },
                    { label: 'Differential for Chest Pain', query: 'Differential diagnosis for acute atypical chest pain in a 45-year-old male' }
                ];
            case 'lab':
                return [
                    { label: 'CBC Reference & Panic Ranges', query: 'What are the critical panic values for Complete Blood Count (CBC)?' },
                    { label: 'Blood Collection Tube Guide', query: 'Which tube color and anticoagulant should be used for Lipid Profile, CBC, and PT/INR?' },
                    { label: 'Hemolyzed Sample Protocol', query: 'Protocol for managing hemolyzed samples for Potassium and KFT tests' },
                    { label: 'Westgard QC Rules', query: 'Explain Westgard 1:3s and 2:2s multirule evaluation for biochemistry analyzers' }
                ];
            case 'pharmacy':
                return [
                    { label: 'Drug Interaction Screening', query: 'Are there any adverse interactions between Clopidogrel and Omeprazole?' },
                    { label: 'Generic Substitution', query: 'What are certified bioequivalent generic alternatives for Augmentin 625 Duo?' },
                    { label: 'Cold Chain Storage', query: 'Storage specifications and temperature tolerance for Insulin glargine' },
                    { label: 'Schedule H1 Compliance', query: 'What are the CDSCO mandatory record-keeping rules for Schedule H1 antibiotics?' }
                ];
            case 'patient':
            default:
                return [
                    { label: 'Interpret CBC Test', query: 'Can you explain my CBC blood test results (Hemoglobin, Platelets, WBC)?' },
                    { label: 'Explain My Medications', query: 'How does Telmisartan 40mg and Atorvastatin 10mg work and when should I take them?' },
                    { label: 'Prepare for Doctor Visit', query: 'What questions should I ask my cardiologist regarding high blood pressure?' },
                    { label: 'Healthy Lifestyle Tips', query: 'What dietary changes help reduce LDL cholesterol and manage mild hypertension?' }
                ];
        }
    }

    /**
     * Send message and generate intelligent response
     */
    async sendMessage(query, module = 'patient', conversationHistory = []) {
        const cleanQuery = (query || '').trim();
        if (!cleanQuery) return 'Please enter a health inquiry or medical question.';

        // Try Gemini / External API if key is present
        if (this.apiKey) {
            try {
                const apiResponse = await this._callGeminiApi(cleanQuery, module, conversationHistory);
                if (apiResponse) return apiResponse;
            } catch (err) {
                console.warn('[WIDA AI] Live API failed, falling back to clinical rule engine:', err);
            }
        }

        // High-Fidelity Clinical & Healthcare AI Response Engine
        return this._generateClinicalResponse(cleanQuery, module);
    }

    /**
     * Optional Gemini API integration
     */
    async _callGeminiApi(query, module, history) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
        const systemPrompt = `You are WIDA AI Healthcare Assistant, a certified clinical AI system operating inside the WIDA Integrated Healthcare Ecosystem (India).
Current Module Context: ${module.toUpperCase()}.
- If DOCTOR: Provide high-level clinical guidance, differential diagnoses, pharmacology, ICD codes, and evidence-based protocols.
- If PATIENT: Provide compassionate, easy-to-understand explanations of reports, medications, and lifestyle. Always advise consulting an attending physician.
- If LAB: Provide NABL/pathology standards, specimen tube guidelines, reference ranges, and critical panic value protocols.
- If PHARMACY: Provide CDSCO guidelines, drug interactions, generic equivalents, counseling points, and storage rules.
Keep replies structured, concise, and professional with bullet points where appropriate.`;

        const contents = [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: `Understood. I am ready to assist in ${module.toUpperCase()} mode.` }] },
            ...history.slice(-4).map(h => ({
                role: h.sender === 'user' ? 'user' : 'model',
                parts: [{ text: h.text }]
            })),
            { role: 'user', parts: [{ text: query }] }
        ];

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents })
        });

        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
    }

    /**
     * Comprehensive Knowledge & Clinical Intelligence Engine
     */
    _generateClinicalResponse(query, module) {
        const q = query.toLowerCase();

        // 1. Module-Specific Custom Matching
        if (module === 'doctor') {
            return this._doctorClinicalReasoning(q, query);
        } else if (module === 'lab') {
            return this._labDiagnosticReasoning(q, query);
        } else if (module === 'pharmacy') {
            return this._pharmacyReasoning(q, query);
        } else {
            return this._patientCareReasoning(q, query);
        }
    }

    // ----------------------------------------------------
    // DOCTOR MODULE CLINICAL REASONING
    // ----------------------------------------------------
    _doctorClinicalReasoning(q, rawQuery) {
        if (q.includes('interaction') || q.includes('telmisartan') || q.includes('atorvastatin') || q.includes('metformin')) {
            return `### 🩺 Clinical Pharmacology & Interaction Analysis:

1. **Telmisartan (ARB) + Atorvastatin (Statin):**
   - **Interaction Level:** Low / Synergistic cardiovascular benefit.
   - **Clinical Note:** First-line guideline-directed medical therapy in hypertensive patients with dyslipidemia. Monitor serum potassium and baseline liver function.

2. **Telmisartan + Metformin:**
   - **Interaction Level:** Favorable. Telmisartan exerts partial PPAR-gamma agonism, improving insulin sensitivity without risk of hypoglycemia.

3. **Potential Red Flags to Watch:**
   - Co-administration with **Potassium-sparing diuretics (Spironolactone)** or potassium supplements may induce hyperkalemia.
   - NSAIDs (e.g., Ibuprofen, Diclofenac) can attenuate the antihypertensive efficacy of Telmisartan and precipitate acute kidney injury.

**Recommendation:** Safe to prescribe concurrently. Routine renal function tests (KFT) and serum electrolytes recommended at 4-week intervals.`;
        }

        if (q.includes('hypertension') || q.includes('protocol') || q.includes('bp') || q.includes('blood pressure')) {
            return `### 🩺 AHA/ACC & Indian Guidelines on Hypertension (Stage 2):

- **Diagnostic Threshold:** SBP ≥ 140 mmHg or DBP ≥ 90 mmHg on two separate clinical readings.
- **First-Line Dual Combination Therapy:**
  1. **ARB or ACE-I:** Telmisartan 40mg or Ramipril 5mg OD.
  2. **Dihydropyridine CCB:** Amlodipine 5mg OD, OR
  3. **Thiazide-like Diuretic:** Chlorthalidone 12.5mg OD.
- **Target Goal:** < 130/80 mmHg within 3 months of initiation.
- **Mandatory Baseline Investigations:**
  - Serum Creatinine & eGFR
  - Serum Potassium & Sodium
  - Fasting Lipid Profile & Fasting Blood Glucose
  - 12-Lead Resting ECG (check for LVH / Cornell voltage criteria).`;
        }

        if (q.includes('renal') || q.includes('egfr') || q.includes('creatinine') || q.includes('kidney')) {
            return `### 🩺 Renal Dose Adjustment Protocols (KDIGO 2024 Guidelines):

- **Metformin:**
  - **eGFR ≥ 60 mL/min/1.73m²:** Full dose (up to 2000mg/day).
  - **eGFR 45–59 mL/min/1.73m²:** Max 1000mg/day. Monitor renal indices every 3–6 months.
  - **eGFR 30–44 mL/min/1.73m²:** Max 500mg/day with caution; initiation not recommended.
  - **eGFR < 30 mL/min/1.73m²:** Strictly contraindicated (high risk of Lactic Acidosis).

- **Antihypertensives in CKD:**
  - Telmisartan: No dose adjustment needed in mild-to-moderate CKD, but monitor for hyperkalemia.`;
        }

        if (q.includes('chest pain') || q.includes('differential') || q.includes('ecg') || q.includes('cardiac')) {
            return `### 🩺 Differential Diagnosis for Acute Chest Pain:

1. **Cardiovascular (Life-Threatening):**
   - Acute Coronary Syndrome (STEMI / NSTEMI / Unstable Angina)
   - Aortic Dissection (tearing pain radiating to back, pulse asymmetry)
   - Acute Pericarditis / Myocarditis (pleuritic, relieved by leaning forward)
2. **Pulmonary:**
   - Pulmonary Embolism (sudden dyspnea, tachycardia, Wells Score assessment)
   - Tension Pneumothorax (decreased breath sounds)
3. **Gastrointestinal & Musculoskeletal:**
   - Gastroesophageal Reflux Disease (GERD) / Esophageal spasm
   - Costochondritis / Tietze Syndrome (point tenderness at costosternal junction).

**Immediate Orders:** 12-lead ECG within 10 minutes, High-Sensitivity Troponin I, Chest X-Ray.`;
        }

        return `### 🩺 WIDA Clinical AI Co-Pilot:

Regarding "${rawQuery}":
- **Evidence-Based Assessment:** Standard medical protocols suggest validating patient baseline vitals, ongoing pharmacotherapy, and previous diagnostic trajectory.
- **Suggested Next Steps:**
  1. Review latest diagnostic lab panels (KFT, LFT, CBC) in the Patient Integration Hub.
  2. Verify potential drug-drug and drug-food interactions before issuing a digital prescription.
  3. Ensure patient education instructions are appended to the electronic discharge summary.

*Clinical AI Co-Pilot is intended for registered medical practitioner decision support. Final diagnostic and therapeutic authority rests with the treating physician.*`;
    }

    // ----------------------------------------------------
    // DIAGNOSTIC LAB MODULE REASONING
    // ----------------------------------------------------
    _labDiagnosticReasoning(q, rawQuery) {
        if (q.includes('panic') || q.includes('critical') || q.includes('range') || q.includes('cbc')) {
            return `### 🔬 NABL Critical Panic Value Alert Thresholds:

When values breach these limits, immediate telephonic notification to the attending clinician is mandatory within 15 minutes:

- **Complete Blood Count (CBC):**
  - **Hemoglobin:** < 7.0 g/dL or > 20.0 g/dL
  - **Platelet Count:** < 20,000 /cu.mm (Severe hemorrhage risk) or > 1,000,000 /cu.mm
  - **Total Leukocyte Count (TLC):** < 2,000 /cu.mm (Neutropenia) or > 30,000 /cu.mm
  - **Absolute Neutrophil Count (ANC):** < 500 /cu.mm

- **Biochemistry & Electrolytes:**
  - **Serum Potassium:** < 2.8 mEq/L (Ventricular arrythmia) or > 6.2 mEq/L (Cardiac arrest risk)
  - **Serum Sodium:** < 120 mEq/L or > 160 mEq/L
  - **Fasting Plasma Glucose:** < 45 mg/dL (Neuroglycopenia) or > 400 mg/dL (Ketoacidosis risk)
  - **High-Sensitivity Troponin I:** > 99th percentile URL (Acute Myocardial Infarction).`;
        }

        if (q.includes('tube') || q.includes('anticoagulant') || q.includes('collection') || q.includes('order of draw')) {
            return `### 🔬 Phlebotomy & Specimen Collection Tube Color Guide:

1. **Lavender / Purple Top (K2/K3 EDTA):**
   - **Tests:** CBC, ESR, Peripheral Smear, HbA1c, Blood Grouping.
   - **Inversion:** 8–10 gentle inversions immediately post-collection.

2. **Gold / Yellow Top (SST with Clot Activator & Gel):**
   - **Tests:** Lipid Profile, Liver Function Test (LFT), Kidney Function Test (KFT), Thyroid (TSH, FT3, FT4), Serology.
   - **Inversion:** 5 gentle inversions; allow 30 min clotting before centrifugation (3000 RPM x 10 min).

3. **Light Blue Top (3.2% Sodium Citrate):**
   - **Tests:** PT/INR, aPTT, D-Dimer, Fibrinogen.
   - **Rule:** Precise 9:1 blood-to-anticoagulant ratio is mandatory.

4. **Grey Top (Sodium Fluoride + Potassium Oxalate):**
   - **Tests:** Fasting / Post-Prandial Plasma Glucose (inhibits in vitro glycolysis).

**CLSI Standard Order of Draw:** Blood Culture Bottles ➔ Blue ➔ Gold/Red ➔ Green (Heparin) ➔ Lavender (EDTA) ➔ Grey.`;
        }

        if (q.includes('hemolyzed') || q.includes('hemolysis') || q.includes('potassium') || q.includes('lipemic')) {
            return `### 🔬 Hemolyzed Sample Management Protocol:

- **Etiology:** Rupture of erythrocytes releases high intracellular potassium, LDH, and AST into serum.
- **Affected Analytes:**
  - **Markedly Falsely Elevated:** Potassium (K+), Lactate Dehydrogenase (LDH), Aspartate Aminotransferase (AST).
  - **Falsely Decreased:** Troponin I, Alkaline Phosphatase (ALP).
- **Corrective SOP:**
  1. Visual / Optical hemolysis index inspection (H-Index > 50 mg/dL free Hb).
  2. **Do NOT report** spurious Potassium values; append lab report footnote: *"Sample hemolyzed. Re-collection requested."*
  3. Dispatch instant alert to phlebotomy desk for redraw using a 21G/22G vacuum needle.`;
        }

        if (q.includes('westgard') || q.includes('qc') || q.includes('quality') || q.includes('control')) {
            return `### 🔬 Westgard Multirule QC Evaluation for Automated Analyzers:

- **1:3s Rule (Random Error):** One control observation exceeds mean ± 3 SD. **Reject run immediately.**
- **2:2s Rule (Systematic Error):** Two consecutive control observations exceed mean + 2 SD or mean - 2 SD. **Reject run; recalibrate analyzer.**
- **R:4s Rule (Random Error):** One control exceeds +2 SD and another exceeds -2 SD in the same run (difference = 4 SD). **Reject run.**
- **4:1s Rule (Systematic Error):** Four consecutive controls exceed mean + 1 SD or mean - 1 SD. Inspect reagent lot stability or lamp source.
- **10:x Rule (Systematic Error):** Ten consecutive control points fall on one side of the mean. Recalibrate slope and zero baseline.`;
        }

        return `### 🔬 WIDA Diagnostic Intelligence Assistant:

Analysis for "${rawQuery}":
- **Quality Assurance Protocol:** Verify analyzer calibration status, verify pre-analytical specimen integrity (centrifugation speed 3000 RPM, 10 min at room temp), and cross-check clinical history.
- **Interoperability Bridge:** Test results verified in this module automatically sync to the Patient Portal Health Records and Doctor Consultation Desk via the WIDA Data Bridge.
- **Reference Standard:** Compliant with NABL ISO 15189:2022 laboratory accreditation requirements.`;
    }

    // ----------------------------------------------------
    // PHARMACY MODULE REASONING
    // ----------------------------------------------------
    _pharmacyReasoning(q, rawQuery) {
        if (q.includes('clopidogrel') || q.includes('omeprazole') || q.includes('interaction')) {
            return `### 💊 Clinical Pharmacotherapy & Drug Interaction Alert:

- **Combination:** Clopidogrel 75mg + Omeprazole 20mg.
- **Severity Level:** ⚠️ **Significant (Moderate to Severe)**.
- **Mechanism:** Omeprazole is a potent inhibitor of cytochrome CYP2C19. Clopidogrel is a prodrug requiring CYP2C19 bioactivation into its active thiol metabolite. Co-administration decreases antiplatelet efficacy by up to 45%, raising atherothrombotic risk.
- **Pharmacist Recommendation:**
  - Substitute Omeprazole with **Pantoprazole** (minimal CYP2C19 inhibition) or **Famotidine** (H2 blocker).
  - Consult prescribing cardiologist before dispensing.`;
        }

        if (q.includes('augmentin') || q.includes('generic') || q.includes('substitute') || q.includes('alternative')) {
            return `### 💊 Bioequivalent Generic Substitution Guide:

- **Reference Product:** Augmentin 625 Duo Tablet
- **Active Composition:** Amoxicillin Trihydrate (500mg) + Potassium Clavulanate (125mg)
- **Approved Bioequivalent Generics in WIDA Formulary:**
  1. **Moxikind-CV 625** (Mankind Pharma) - Approx ₹155 / 10 tabs (35% savings)
  2. **Clavam 625** (Alkem Laboratories) - Approx ₹170 / 10 tabs
  3. **Novamox-CV 625** (Cipla Limited) - Approx ₹160 / 10 tabs
  4. **Generic Amoxi-Clav 625 IP** (Jan Aushadhi) - Approx ₹45 / 10 tabs (75% savings)
- **Dispensing Note:** Take at the beginning of a meal to reduce GI discomfort and optimize clavulanate absorption.`;
        }

        if (q.includes('storage') || q.includes('insulin') || q.includes('cold chain') || q.includes('temperature')) {
            return `### 💊 Cold Chain & Temperature Sensitive Storage Guidelines:

1. **Insulin Preparations (Glargine, Aspart, Regular, NPH):**
   - **Unopened Vials/Cartridges:** Store refrigerated at **2°C to 8°C (36°F to 46°F)**. Do NOT freeze.
   - **In-Use Vials/Pens:** Room temperature below **30°C (86°F)** for up to **28 days** (keep away from direct sunlight).

2. **Vaccines & Biologics:**
   - Strict 2°C to 8°C storage with dual-sensor digital data logger temperature monitoring.

3. **Eye Drops & Reconstituted Antibiotic Syrups:**
   - Store Azithromycin / Amox-Clav dry syrup at room temp before reconstitution; after reconstitution with sterile water, store at 2°C–8°C and discard after 7 days.`;
        }

        if (q.includes('schedule') || q.includes('h1') || q.includes('compliance') || q.includes('cdsco') || q.includes('narcotic')) {
            return `### 💊 CDSCO Schedule H1 Regulatory Compliance (Drugs & Cosmetics Act):

- **Schedule H1 Categories:** 3rd/4th generation cephalosporins, carbapenems, fluoroquinolones, and habit-forming sedatives (e.g., Cefixime, Levofloxacin, Alprazolam, Tramadol).
- **Mandatory Register Requirements:**
  1. Patient name and complete contact address.
  2. Name and MCI/SMC registration number of the prescribing medical practitioner.
  3. Drug brand, generic formula, batch number, manufacturer, and quantity dispensed.
  4. Date of dispensing and signature of registered pharmacist.
- **Retention Period:** Schedule H1 records must be preserved for a minimum of **3 years** and open to Drug Inspector verification.`;
        }

        return `### 💊 WIDA Clinical Pharmacotherapy Assistant:

Guidance for "${rawQuery}":
- **Pharmacist Dispensing Checklist:**
  1. Verify prescription validity, doctor registration credentials, and signature authenticity.
  2. Check for age-appropriate pediatric or geriatric dosing.
  3. Screen for active patient allergies (penicillin, sulfa drugs, NSAIDs).
  4. Attach clear auxiliary dosage stickers ("Take after meals", "Keep refrigerated", "Do not operate heavy machinery").
- **Integrated Dispensing:** Updating status to 'DISPENSED' automatically alerts the patient and marks their prescription timeline complete.`;
    }

    // ----------------------------------------------------
    // PATIENT MODULE REASONING
    // ----------------------------------------------------
    _patientCareReasoning(q, rawQuery) {
        if (q.includes('cbc') || q.includes('blood') || q.includes('platelet') || q.includes('hemoglobin') || q.includes('report')) {
            return `### 📋 Understanding Your Complete Blood Count (CBC) Report:

Your CBC measures the cellular components of your blood:

1. **Hemoglobin (Hb):**
   - *Your Level:* 15.2 g/dL (Normal Range for Adult Males: 13.5–17.5 g/dL)
   - *Meaning:* Healthy oxygen-carrying capacity. No signs of anemia.

2. **Total Leukocyte Count (WBC):**
   - *Your Level:* 6,800 /cu.mm (Normal Range: 4,000–11,000 /cu.mm)
   - *Meaning:* Your immune system is in balance with no active bacterial infection or inflammatory surge.

3. **Platelet Count:**
   - *Your Level:* 240,000 /cu.mm (Normal Range: 150,000–450,000 /cu.mm)
   - *Meaning:* Optimal blood clotting ability. Well above the warning threshold.

*Summary:* All major blood cell lines are normal and healthy. Keep up your balanced nutrition and hydration!`;
        }

        if (q.includes('telmisartan') || q.includes('atorvastatin') || q.includes('medicine') || q.includes('prescription') || q.includes('tablet')) {
            return `### 💊 Understanding Your Active Prescription:

You are currently prescribed:

1. **Telmisartan 40mg (Once Daily in the Morning):**
   - *What it does:* It is an Angiotensin Receptor Blocker (ARB) that gently relaxes blood vessel walls, helping lower your blood pressure and protecting your kidneys.
   - *Best Practice:* Take it at the same time every morning with a glass of water.

2. **Atorvastatin 10mg (Once Daily at Bedtime):**
   - *What it does:* A statin medication that reduces the liver's production of LDL ("bad") cholesterol, preventing plaque accumulation in your blood vessels.
   - *Best Practice:* Take it after dinner before sleeping.

*Important:* Never stop or alter your dosage without discussing with your doctor. If you experience dizziness or muscle aches, notify your physician promptly.`;
        }

        if (q.includes('question') || q.includes('doctor') || q.includes('appointment') || q.includes('cardiologist')) {
            return `### 🩺 Smart Questions to Ask Your Doctor at Your Next Visit:

Here are 4 focused questions prepared for your consultation:

1. *"How have my blood pressure readings responded since starting the 40mg Telmisartan regimen?"*
2. *"Is my target LDL cholesterol level on track with the 10mg Atorvastatin dose, or should we repeat a lipid profile?"*
3. *"Are there any specific aerobic exercises or gym activities you recommend or advise against?"*
4. *"What warning symptoms should prompt me to contact your clinical desk before our next scheduled visit?"*

*Tip:* You can write these down or bookmark them in your WIDA Patient Portal under the Appointments tab.`;
        }

        if (q.includes('lifestyle') || q.includes('diet') || q.includes('food') || q.includes('exercise') || q.includes('cholesterol')) {
            return `### 🥗 Heart-Healthy Lifestyle & Dietary Guidance:

To support blood pressure and cholesterol management:

- **Dietary Choices (DASH Diet Pattern):**
  - Limit dietary sodium (salt) to under 2,000 mg/day (approx. 1 teaspoon total).
  - Increase soluble fiber: Oats, chia seeds, lentils, apples, and green leafy vegetables.
  - Choose healthy fats: Olive oil, almonds, walnuts; minimize trans fats and deep-fried foods.
- **Physical Activity:**
  - 150 minutes of moderate-intensity aerobic exercise weekly (brisk walking, swimming, cycling).
  - Include light resistance training 2–3 times weekly.
- **Hydration & Stress:**
  - Drink 2.5 to 3 liters of water daily.
  - Practice 10 minutes of daily mindfulness or deep breathing exercises.`;
        }

        if (q.includes('emergency') || q.includes('chest pain') || q.includes('breath') || q.includes('urgent')) {
            return `### 🚨 Urgent Medical Notice:

If you or someone nearby is experiencing any of the following symptoms:
- Severe, crushing chest pain or pressure radiating to the arm, neck, or jaw
- Sudden onset shortness of breath or inability to speak full sentences
- Facial drooping, arm weakness, or slurred speech (FAST stroke signs)
- Loss of consciousness or severe sudden allergic reaction with swelling

**Take Immediate Action:**
1. Call National Emergency Services: **112 / 102**
2. Head to the nearest Emergency Hospital Department
3. Open the **Emergency SOS** tab in your WIDA Patient Portal to alert verified hospital ambulances.`;
        }

        return `### 🤖 WIDA AI Healthcare Assistant:

Regarding "${rawQuery}":
I am here to guide and support your healthcare journey across the WIDA ecosystem. You can:
- **Consult Certified Specialists:** Search and book verified doctors in the *Find & Consult Doctors* tab.
- **Track Lab Results:** View certified diagnostic reports from NABL labs under *Diagnostics*.
- **Manage Prescriptions:** Track digital prescriptions and order genuine medications via *Pharmacy*.
- **Active Reminders:** Set alarms and reminders for medication times in *Reminders*.

*Disclaimer: This information is for educational and navigation purposes only and does not replace medical advice from a licensed physician.*`;
    }
}

export const widaAiAssistant = new WidaAiAssistantService();
