/* ==========================================================================
   SOLO CLINIC HIMS — MASTER LOGIC KERNEL
   v6.0.0 | ENTERPRISE "GOD MODE" ARCHITECTURE
   ==========================================================================
   
   PROJECT:        Solo Clinic HIMS (Health Information Management System)
   MODULE:         Main Application Controller (script.js)
   AUTHOR:         Gemini AI System Architect
   DATE:           December 25, 2025
   LICENSE:        Proprietary / Enterprise Edition
   DEPENDENCIES:   meds_all_combined.js (Global Drug Database)
   
   --------------------------------------------------------------------------
   SYSTEM ARCHITECTURE OVERVIEW:
   --------------------------------------------------------------------------
   This application utilizes a Singleton Design Pattern ('App') wrapped in 
   an IIFE (Immediately Invoked Function Expression) to prevent global 
   namespace pollution. It implements a "Model-View-Controller" (MVC) 
   pattern within a single file for portability.
   
   KEY SUBSYSTEMS:
   1.  KNOWLEDGE_BASE: Static ontology of medical protocols for AI.
   2.  STATE_MANAGER: Reactive data store for Patients, Visits, and Settings.
   3.  DOM_REGISTRY: Cached references to all HTML elements (performance).
   4.  EVENT_BUS: Centralized event delegation and binding.
   5.  RX_ENGINE: Advanced prescription logic with allergy safety checks.
   6.  AI_CORE: Heuristic-based clinical decision support system.
   7.  RENDER_ENGINE: Dynamic DOM manipulation and Print generation.
   
   --------------------------------------------------------------------------
   TABLE OF CONTENTS
   --------------------------------------------------------------------------
   1.0  GLOBAL CONFIGURATION & CONSTANTS
   2.0  MEDICAL KNOWLEDGE BASE (AI ONTOLOGY - CARDIOLOGY & GENERAL)
   3.0  SYSTEM UTILITIES & LOGGER
   4.0  CORE CONTROLLER & STATE
   5.0  INITIALIZATION & BOOTSTRAPPING
   6.0  DOM CACHING LAYER
   7.0  EVENT ORCHESTRATION
   8.0  PATIENT MANAGEMENT MODULE
   9.0  CLINICAL ENCOUNTER MODULE
   10.0 PRESCRIPTION (RX) COCKPIT ENGINE
   11.0 ARTIFICIAL INTELLIGENCE (CDSS)
   12.0 DOCUMENT GENERATION (HIGH-FIDELITY PRINT)
   13.0 MOBILE CONTROLLER (RESPONSIVE LOGIC)
   ========================================================================== */

(function () {
    "use strict";

    /* ==========================================================================
       1.0 GLOBAL CONFIGURATION & CONSTANTS
       ========================================================================== */
    
    /**
     * System-wide configuration constants.
     * These control the behavior of the UI, Storage, and Logic.
     */
    const CONFIG = {
        APP_NAME: "Solo Clinic HIMS",
        VERSION: "6.0.0-Enterprise",
        BUILD: "2025.12.25.RC1",
        
        STORAGE_KEYS: {
            PATIENTS: "hims_db_patients_v2",
            VISITS: "hims_db_visits_v2",
            SETTINGS: "hims_config_settings_v2",
            THEME: "hims_ui_theme_pref"
        },
        
        UI: {
            TOAST_DURATION: 3000,
            AI_THINK_TIME: 1200, // Ms to simulate AI processing
            SEARCH_DEBOUNCE: 150,
            ANIMATION_SPEED: 300
        },
        
        DEFAULTS: {
            CLINIC_NAME: "Solo Clinic",
            DOCTOR_NAME: "Dr. Yusuf Abbas",
            ADDRESS: "Department of Cardiology\nCity Heart Institute, Medical District",
            FOOTER: "Emergency Contact: 108 | Get well soon."
        },

        // Regex patterns for validation
        REGEX: {
            PHONE: /^[0-9]{10}$/,
            AGE: /^[0-9]{1,3}$/
        }
    };


    /* ==========================================================================
       2.0 MEDICAL KNOWLEDGE BASE (AI ONTOLOGY)
       ==========================================================================
       This is the "Brain" of the application. It contains structured data
       mappings between Diagnosis Keywords and Clinical Protocols.
       
       Focused on CARDIOLOGY (User's specialty) + General Medicine.
       ========================================================================== */
    
    const MEDICAL_KNOWLEDGE_BASE = {
        
        // =======================
        // CARDIOLOGY PROTOCOLS
        // =======================

        "PROTO-CVS-001": {
            condition: "Essential Hypertension (Stage 1)",
            category: "Cardiology",
            keywords: ["htn", "hypertension", "bp", "high bp", "pressure", "essential hypertension"],
            rx: [
                { drug: "Tab. Telmisartan 40mg", dose: "1 Tab", freq: "OD (M)", dur: "30 Days", remarks: "Morning, before food" },
                { drug: "Tab. Amlodipine 5mg", dose: "1 Tab", freq: "OD (N)", dur: "30 Days", remarks: "Night" }
            ],
            advice: "Salt restriction (<5g/day). 30 mins aerobic exercise daily. Monthly BP Charting. Avoid stress.",
            investigations: "Lipid Profile, Serum Creatinine, ECG, Urine Routine."
        },

        "PROTO-CVS-002": {
            condition: "Essential Hypertension (Stage 2 / Uncontrolled)",
            category: "Cardiology",
            keywords: ["severe htn", "uncontrolled bp", "stage 2 hypertension"],
            rx: [
                { drug: "Tab. Telmisartan 80mg", dose: "1 Tab", freq: "OD (M)", dur: "30 Days", remarks: "Morning" },
                { drug: "Tab. Chlorthalidone 12.5mg", dose: "1 Tab", freq: "OD (M)", dur: "30 Days", remarks: "With Telmisartan" },
                { drug: "Tab. Amlodipine 10mg", dose: "1 Tab", freq: "OD (N)", dur: "30 Days", remarks: "Night" }
            ],
            advice: "Strict salt restriction. Review in 1 week. DASH Diet recommended.",
            investigations: "Echo, Renal Doppler (if resistant), Fundoscopy."
        },

        "PROTO-CVS-003": {
            condition: "Stable Angina Pectoris",
            category: "Cardiology",
            keywords: ["angina", "chest pain", "ischemia", "cad", "coronary"],
            rx: [
                { drug: "Tab. Aspirin 75mg", dose: "1 Tab", freq: "OD", dur: "30 Days", remarks: "After lunch" },
                { drug: "Tab. Atorvastatin 40mg", dose: "1 Tab", freq: "HS", dur: "30 Days", remarks: "Night" },
                { drug: "Tab. Metoprolol Succinate 25mg", dose: "1 Tab", freq: "OD", dur: "30 Days", remarks: "Morning" },
                { drug: "Tab. Isosorbide Mononitrate 30mg", dose: "1 Tab", freq: "OD", dur: "30 Days", remarks: "Slow Release" },
                { drug: "Tab. Sorbitrate 5mg", dose: "1 Tab", freq: "SOS", dur: "10 Days", remarks: "Sublingual for chest pain" }
            ],
            advice: "Avoid exertion. Stop smoking immediately. Low fat diet. Carry Sorbitrate always.",
            investigations: "TMT (Treadmill Test), 2D Echo, Lipid Profile."
        },

        "PROTO-CVS-004": {
            condition: "Congestive Heart Failure (HFrEF)",
            category: "Cardiology",
            keywords: ["heart failure", "chf", "failure", "edema", "breathlessness", "lvf"],
            rx: [
                { drug: "Tab. Sacubitril 49mg + Valsartan 51mg", dose: "1 Tab", freq: "BD", dur: "30 Days", remarks: "ARNI" },
                { drug: "Tab. Furosemide 40mg", dose: "1 Tab", freq: "OD/BD", dur: "30 Days", remarks: "Diuretic (Monitor Urine)" },
                { drug: "Tab. Spironolactone 25mg", dose: "1 Tab", freq: "OD", dur: "30 Days", remarks: "Aldosterone Antagonist" },
                { drug: "Tab. Dapagliflozin 10mg", dose: "1 Tab", freq: "OD", dur: "30 Days", remarks: "SGLT2 Inhibitor" }
            ],
            advice: "Fluid restriction (1.5L/day). Daily weight monitoring. Salt < 2g/day. Propped up position for sleep.",
            investigations: "Serum Electrolytes (K+), Creatinine, Pro-BNP."
        },

        "PROTO-CVS-005": {
            condition: "Atrial Fibrillation (Rate Control)",
            category: "Cardiology",
            keywords: ["af", "atrial fibrillation", "palpitation", "irregular pulse", "arrhythmia"],
            rx: [
                { drug: "Tab. Diltiazem 60mg", dose: "1 Tab", freq: "TDS", dur: "30 Days", remarks: "Rate Control" },
                { drug: "Tab. Apixaban 5mg", dose: "1 Tab", freq: "BD", dur: "30 Days", remarks: "Anticoagulant (NOAC)" },
                { drug: "Tab. Atorvastatin 20mg", dose: "1 Tab", freq: "HS", dur: "30 Days", remarks: "Lipid lowering" }
            ],
            advice: "Watch for bleeding gums/black stools. Regular pulse check.",
            investigations: "INR (if on Warfarin), ECG, Holter Monitoring."
        },

        "PROTO-CVS-006": {
            condition: "Dyslipidemia / Hypercholesterolemia",
            category: "Cardiology",
            keywords: ["lipid", "cholesterol", "ldl", "triglycerides", "high fat", "dyslipidemia"],
            rx: [
                { drug: "Tab. Rosuvastatin 10mg", dose: "1 Tab", freq: "HS", dur: "60 Days", remarks: "High intensity statin" },
                { drug: "Cap. Fenofibrate 145mg", dose: "1 Cap", freq: "OD", dur: "60 Days", remarks: "If TG > 500" }
            ],
            advice: "Stop oil/ghee completely. Increase fiber intake. Daily 45 min walk.",
            investigations: "Lipid Profile after 2 months, LFT."
        },

        // =======================
        // RESPIRATORY PROTOCOLS
        // =======================

        "PROTO-RESP-001": {
            condition: "Acute Viral Rhinitis (Common Cold)",
            category: "Respiratory",
            keywords: ["cold", "coryza", "runny nose", "sneezing", "nasal block", "flu"],
            rx: [
                { drug: "Tab. Levocetirizine 5mg", dose: "1 Tab", freq: "HS", dur: "5 Days", remarks: "Anti-allergic" },
                { drug: "Tab. Paracetamol 500mg", dose: "1 Tab", freq: "SOS", dur: "3 Days", remarks: "For Fever/Pain" },
                { drug: "Nasal Drops Xylometazoline", dose: "2 Drops", freq: "TDS", dur: "5 Days", remarks: "Into both nostrils" }
            ],
            advice: "Steam inhalation twice daily. Warm saline gargles. Hydration.",
            investigations: "None."
        },

        "PROTO-RESP-002": {
            condition: "Acute Bronchitis / LRTI",
            category: "Respiratory",
            keywords: ["cough", "sputum", "chest congestion", "bronchitis", "lrti"],
            rx: [
                { drug: "Cap. Amoxicillin 500mg + Clavulanic Acid 125mg", dose: "1 Cap", freq: "BD", dur: "5 Days", remarks: "Antibiotic" },
                { drug: "Syr. Ambroxol + Guaiphenesin", dose: "10ml", freq: "TDS", dur: "5 Days", remarks: "Expectorant" },
                { drug: "Tab. Acebrophylline 100mg", dose: "1 Tab", freq: "BD", dur: "5 Days", remarks: "Bronchodilator" }
            ],
            advice: "Avoid cold water/drinks. Chest physiotherapy (steam). Review if breathless.",
            investigations: "CXR PA View, CBC."
        },

        "PROTO-RESP-003": {
            condition: "Bronchial Asthma (Acute Exacerbation)",
            category: "Respiratory",
            keywords: ["asthma", "wheeze", "breathless", "asthmatic", "copd"],
            rx: [
                { drug: "Inhaler Formoterol + Budesonide", dose: "2 Puffs", freq: "BD", dur: "Continuous", remarks: "Rotacaps/Inhaler" },
                { drug: "Tab. Prednisolone 10mg", dose: "1 Tab", freq: "OD", dur: "5 Days", remarks: "Steroid (Taper)" },
                { drug: "Tab. Montelukast 10mg", dose: "1 Tab", freq: "HS", dur: "10 Days", remarks: "Maintenance" }
            ],
            advice: "Learn inhaler technique. Avoid allergens (dust/pollen).",
            investigations: "PFT (Spirometry)."
        },

        // =======================
        // GASTROINTESTINAL PROTOCOLS
        // =======================

        "PROTO-GI-001": {
            condition: "Acute Gastritis / GERD",
            category: "Gastro",
            keywords: ["gastritis", "acidity", "heartburn", "gerd", "burning", "stomach pain", "acid"],
            rx: [
                { drug: "Cap. Pantoprazole 40mg + Domperidone 30mg", dose: "1 Cap", freq: "OD (BBF)", dur: "7 Days", remarks: "Empty Stomach" },
                { drug: "Syr. Sucralfate Suspension", dose: "10ml", freq: "TDS", dur: "5 Days", remarks: "Before meals" },
                { drug: "Tab. Dicyclomine", dose: "1 Tab", freq: "SOS", dur: "2 Days", remarks: "For spasmodic pain" }
            ],
            advice: "Avoid spicy/oily food. Small frequent meals. Dinner 2 hours before sleep.",
            investigations: "USG Abdomen (if recurrent)."
        },

        "PROTO-GI-002": {
            condition: "Acute Gastroenteritis (Infective Diarrhea)",
            category: "Gastro",
            keywords: ["diarrhea", "loose motion", "dysentery", "vomiting", "stomach upset"],
            rx: [
                { drug: "Tab. Ofloxacin 200mg + Ornidazole 500mg", dose: "1 Tab", freq: "BD", dur: "5 Days", remarks: "Antibiotic" },
                { drug: "Cap. Racecadotril 100mg", dose: "1 Cap", freq: "TDS", dur: "3 Days", remarks: "Anti-secretory" },
                { drug: "Sachet Probiotic (Saccharomyces)", dose: "1 Sachet", freq: "BD", dur: "5 Days", remarks: "Mix in water" },
                { drug: "ORS Powder", dose: "As needed", freq: "Freq", dur: "3 Days", remarks: "Rehydration is Key" }
            ],
            advice: "Strict fluid intake (ORS/Coconut water). Bland diet (Curd rice, Toast). No milk.",
            investigations: "Stool Routine."
        },

        // =======================
        // ENDOCRINE PROTOCOLS
        // =======================

        "PROTO-ENDO-001": {
            condition: "Type 2 Diabetes Mellitus",
            category: "Endocrine",
            keywords: ["diabetes", "sugar", "dm", "t2dm", "high sugar", "glucose"],
            rx: [
                { drug: "Tab. Metformin 500mg (SR)", dose: "1 Tab", freq: "BD", dur: "30 Days", remarks: "After food" },
                { drug: "Tab. Glimepiride 1mg", dose: "1 Tab", freq: "OD", dur: "30 Days", remarks: "Before breakfast" }
            ],
            advice: "Diabetic Diet (No direct sugar, sweets). Foot care. Regular exercise.",
            investigations: "HbA1c, FBS, PPBS, Lipid Profile."
        },

        "PROTO-ENDO-002": {
            condition: "Hypothyroidism",
            category: "Endocrine",
            keywords: ["thyroid", "hypothyroid", "tsh", "weight gain"],
            rx: [
                { drug: "Tab. Thyroxine Sodium 50mcg", dose: "1 Tab", freq: "OD (BBF)", dur: "30 Days", remarks: "Early morning empty stomach" }
            ],
            advice: "Take medicine on empty stomach. Avoid cabbage/cauliflower.",
            investigations: "T3, T4, TSH."
        },

        // =======================
        // GENERAL / PAIN PROTOCOLS
        // =======================

        "PROTO-GEN-001": {
            condition: "Viral Pyrexia (Fever)",
            category: "General",
            keywords: ["fever", "pyrexia", "temp", "chills", "viral", "temperature"],
            rx: [
                { drug: "Tab. Paracetamol 650mg", dose: "1 Tab", freq: "TDS", dur: "3 Days", remarks: "For Fever" },
                { drug: "Tab. Pantoprazole 40mg", dose: "1 Tab", freq: "OD", dur: "3 Days", remarks: "Gastric protection" },
                { drug: "Cap. Vitamin C + Zinc", dose: "1 Cap", freq: "OD", dur: "10 Days", remarks: "Immunity" }
            ],
            advice: "Complete bed rest. Plenty of oral fluids. Tepid sponging if >101°F.",
            investigations: "CBC, MP/Widal (if > 5 days)."
        },

        "PROTO-GEN-002": {
            condition: "General Myalgia / Body Ache",
            category: "General",
            keywords: ["body pain", "ache", "myalgia", "weakness", "tired", "pain"],
            rx: [
                { drug: "Tab. Aceclofenac 100mg + Paracetamol 325mg", dose: "1 Tab", freq: "BD", dur: "3 Days", remarks: "After food" },
                { drug: "Cap. B-Complex + Vit C", dose: "1 Cap", freq: "OD", dur: "15 Days", remarks: "Supplement" }
            ],
            advice: "Hot water bath. Rest. Hydration.",
            investigations: "None."
        },

        "PROTO-GEN-003": {
            condition: "Migraine Headache",
            category: "General",
            keywords: ["migraine", "headache", "throbbing", "head pain", "hemi-cranial"],
            rx: [
                { drug: "Tab. Naproxen 250mg", dose: "1 Tab", freq: "SOS", dur: "3 Days", remarks: "Pain" },
                { drug: "Tab. Rizatriptan 5mg", dose: "1 Tab", freq: "SOS", dur: "1 Day", remarks: "At onset of headache" },
                { drug: "Tab. Flunarizine 10mg", dose: "1 Tab", freq: "HS", dur: "10 Days", remarks: "Prophylaxis" }
            ],
            advice: "Avoid triggers (bright light, noise, cheese, chocolate). Sleep in dark room.",
            investigations: "None (Clinical Dx)."
        },

        // =======================
        // DEFAULT FALLBACK
        // =======================
        "DEFAULT": {
            condition: "General Symptomatic Treatment",
            category: "General",
            keywords: [],
            rx: [
                { drug: "Tab. Multivitamin", dose: "1 Tab", freq: "OD", dur: "5 Days", remarks: "Supportive" },
                { drug: "Tab. Paracetamol 500mg", dose: "1 Tab", freq: "SOS", dur: "3 Days", remarks: "For Pain/Fever" }
            ],
            advice: "Follow general hygiene. Review if symptoms persist.",
            investigations: "Routine Blood Work."
        }
    };


    /* ==========================================================================
       3.0 SYSTEM UTILITIES & LOGGER
       ========================================================================== */

    /**
     * Central logging utility for debugging and tracking system events.
     * Uses styled console output for readability.
     */
    const Logger = {
        info: (msg) => console.log(`%c[INFO] ${msg}`, "color:#3b82f6; font-weight:bold; background:#eff6ff; padding:2px 5px; border-radius:3px;"),
        warn: (msg) => console.warn(`%c[WARN] ${msg}`, "color:#d97706; font-weight:bold; background:#fffbeb; padding:2px 5px; border-radius:3px;"),
        error: (msg, err) => console.error(`%c[ERR] ${msg}`, "color:#dc2626; font-weight:bold; background:#fef2f2; padding:2px 5px; border-radius:3px;", err),
        success: (msg) => console.log(`%c[OK] ${msg}`, "color:#059669; font-weight:bold; background:#ecfdf5; padding:2px 5px; border-radius:3px;")
    };

    /**
     * General utility functions for ID generation, formatting, and calculation.
     */
    const Utils = {
        /**
         * Generates a unique ID with a prefix.
         * Format: PREFIX-TIMESTAMP-RANDOM
         */
        generateId: (prefix = "ID") => {
            return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
        },
        
        /**
         * Formats an ISO date string to a readable format (e.g., "Dec 25, 2025").
         */
        formatDate: (dateStr) => {
            if (!dateStr) return "--";
            return new Date(dateStr).toLocaleDateString(undefined, { 
                year: 'numeric', month: 'short', day: 'numeric' 
            });
        },

        /**
         * Calculates BMI and returns value + status.
         */
        calculateBMI: (weightKg, heightCm) => {
            if (!weightKg || !heightCm) return null;
            const hM = heightCm / 100;
            const bmi = weightKg / (hM * hM);
            let status = "Normal";
            if (bmi < 18.5) status = "Underweight";
            else if (bmi >= 25 && bmi < 29.9) status = "Overweight";
            else if (bmi >= 30) status = "Obese";
            return { value: bmi.toFixed(1), status: status };
        },

        /**
         * Escapes HTML characters to prevent XSS in print templates.
         */
        escapeHtml: (str) => {
            if (!str) return "";
            return String(str)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;")
                .replace(/\n/g, "<br>");
        },

        /**
         * Simulates network latency for UI feedback.
         */
        delay: (ms) => new Promise(resolve => setTimeout(resolve, ms))
    };


    /* ==========================================================================
       4.0 CORE CONTROLLER & STATE
       ========================================================================== */

    /**
     * The Singleton Application Controller.
     */
    const App = {
        
        // --- 4.1 Application State Store ---
        state: {
            // Configuration Settings (User Preferences)
            clinic: { ...CONFIG.DEFAULTS },
            
            // Database (Arrays of Objects)
            patients: [],
            visits: [],
            
            // Runtime Session Context
            currentPatient: null,
            currentVisit: null,
            
            // Rx Engine Specific State
            rxList: [],
            editingRxId: null, // ID of medicine currently being edited
            
            // UI & Feature Flags
            isRecording: false,
            activeDictationInput: null,
            recognitionObject: null,
            isDarkMode: false,
            
            // History Stack for Undo/Redo (Potential Feature)
            historyStack: []
        },

        // --- 4.2 DOM Cache Container ---
        // Populated dynamically on init to avoid global variable pollution
        dom: {},


        /* ==========================================================================
           5.0 INITIALIZATION & BOOTSTRAPPING
           ========================================================================== */

        /**
         * Main Entry Point.
         * Orchestrates the startup sequence.
         */
        init() {
            Logger.info("Kernel Boot Sequence Initiated...");
            
            try {
                // 1. Hydrate DOM Cache
                this.cacheDom();
                
                // 2. Load Persisted Data from LocalStorage
                this.loadData();
                this.loadTheme();

                // 3. Initialize Subsystems
                this.initDictation();
                this.initClock();
                this.initTabs();
                this.initShortcuts();

                // 4. Bind User Interactions
                this.bindEvents();

                // 5. Initial Rendering
                this.renderClinicBranding();
                this.loadPatientContext(null); // Ensure clean slate on boot

                // 6. Set Default Date to Today
                if(this.dom.visitDate) {
                    this.dom.visitDate.valueAsDate = new Date();
                }

                // 7. Initialize Mobile Logic
                MobileApp.init();

                Logger.success(`System Online. Build: ${CONFIG.BUILD}`);
                this.showToast("System Ready. Welcome, Doctor.", "success");

            } catch (error) {
                Logger.error("Kernel Panic: Boot Failed", error);
                alert("Critical System Error during boot. Please check console for stack trace.");
            }
        },


        /* ==========================================================================
           6.0 DOM CACHING LAYER
           ========================================================================== */

        /**
         * Maps HTML IDs to Javascript properties.
         * Using a centralized cache improves performance by reducing DOM lookups.
         */
        cacheDom() {
            // Helper to get element by ID with validation
            const get = (id) => {
                const el = document.getElementById(id);
                if (!el) {
                    // Suppress warning for optional elements to keep console clean
                    // Logger.warn(`Missing DOM Element: #${id}`); 
                }
                return el;
            };

            this.dom = {
                // --- Top Bar & Navigation ---
                clinicNameDisplay: get("clinicNameDisplay"),
                doctorNameDisplay: get("doctorNameDisplay"),
                globalSearch: get("globalPatientSearch"),
                searchResults: get("patientSearchResults"),
                liveTime: get("liveTime"),
                liveDate: get("liveDate"),
                themeToggleBtn: get("themeToggleBtn"),
                
                // --- Global Action Buttons ---
                newPatientBtn: get("newPatientBtn"),
                saveVisitBtn: get("saveVisitBtn"),
                printBtn: get("printBtn"),
                settingsBtn: get("clinicSettingsBtn"),
                shortcutsBtn: get("shortcutsBtn"),

                // --- Patient Header Context ---
                contextStrip: get("currentPatientHeader"),
                headerAvatar: get("headerAvatar"),
                headerName: get("headerName"),
                headerUhid: get("headerUhid"),
                headerAgeSex: get("headerAgeSex"),
                headerPhone: get("headerPhone"),
                visitStatus: get("visitStatus"),
                calcBtn: get("calcBtn"),
                openHistoryBtn: get("openHistoryBtn"),

                // --- Clinical Panels (Left - Vitals) ---
                vitalBP: get("vitalBP"),
                vitalPulse: get("vitalPulse"),
                vitalTemp: get("vitalTemp"),
                vitalSpO2: get("vitalSpO2"),
                vitalWeight: get("vitalWeight"),
                vitalHeight: get("vitalHeight"),
                snapshotAllergies: get("snapshotAllergies"),
                snapshotChronic: get("snapshotChronic"),

                // --- Center Workspace (Tabs & Inputs) ---
                visitDate: get("visitDate"),
                tabButtons: document.querySelectorAll(".tab-btn"),
                tabContents: document.querySelectorAll(".tab-content"),
                
                // Text Areas (Smart Inputs)
                coText: get("coText"),
                examText: get("examText"),
                dxText: get("dxText"),
                adviceText: get("adviceText"),
                investText: get("investText"),

                // --- Rx Engine (Cockpit) Elements ---
                rxDrugName: get("rxDrugName"),
                drugSuggestions: get("drugSuggestions"),
                rxDose: get("rxDose"),
                rxFrequency: get("rxFrequency"),
                rxDuration: get("rxDuration"),
                rxRemarks: get("rxRemarks"),
                addRxBtn: get("addRxBtn"),
                addRxBtnText: get("addRxBtnText"),
                editingIndicator: get("editingIndicator"),
                rxTableBody: get("rxTableBody"),
                rxEmptyState: get("rxEmptyState"),
                rxSafetyBanner: get("rxSafetyBanner"),
                rxAllergyText: get("rxAllergyText"),
                dismissAllergyBtn: get("dismissAllergyBtn"),
                
                // --- AI & Decision Support ---
                aiSuggestBtn: get("aiSuggestBtn"),
                aiLoading: get("aiLoading"),

                // --- Modals ---
                // New Patient Modal
                newPatientModal: get("newPatientModal"),
                closeNewPatientBtn: get("closeNewPatientBtn"),
                saveNewPatientBtn: get("saveNewPatientBtn"),
                regName: get("regName"),
                regPhone: get("regPhone"),
                regAge: get("regAge"),
                regSex: get("regSex"),
                regAllergies: get("regAllergies"),
                regChronic: get("regChronic"),

                // Settings Modal
                settingsModal: get("settingsModal"),
                closeSettingsBtn: get("closeSettingsBtn"),
                saveSettingsBtn: get("saveSettingsBtn"),
                settingClinicName: get("settingClinicName"),
                settingDoctorName: get("settingDoctorName"),
                settingClinicAddress: get("settingClinicAddress"),
                settingFooterNote: get("settingFooterNote"),

                // Shortcuts Modal
                shortcutsModal: get("shortcutsModal"),
                closeShortcutsBtn: get("closeShortcutsBtn"),

                // History Drawer
                historyDrawer: get("historyDrawer"),
                closeHistoryBtn: get("closeHistoryBtn"),
                historyList: get("historyList"),

                // --- Print Preview Fields (Mapped) ---
                // These are used to update the right sidebar preview in real-time
                previewVitals: get("previewVitals"),
                previewVitalsRow: get("previewVitalsRow"),
                previewCO: get("previewCO"),
                previewExam: get("previewExam"),
                previewDx: get("previewDx"),
                previewAdvice: get("previewAdvice"),
                previewInvest: get("previewInvest"),
                previewRxTable: get("previewRxTable"),
                
                // Header fields in Preview
                previewClinicName: get("previewClinicName"),
                previewDoctorName: get("previewDoctorName"),
                previewClinicAddress: get("previewClinicAddress"),
                previewFooterNote: get("previewFooterNote"),
                previewDatePrint: get("previewDatePrint"),
                previewPatientName: get("previewPatientName"),
                previewPatientAgeSex: get("previewPatientAgeSex"),
                previewPatientId: get("previewPatientId")
            };
        },


        /* ==========================================================================
           7.0 EVENT ORCHESTRATION
           ========================================================================== */

        /**
         * Binds all event listeners to DOM elements.
         * Separating logic from HTML (onclick) makes the code cleaner and easier to debug.
         */
        bindEvents() {
            const d = this.dom;

            // --- 7.1 Global Actions ---
            if(d.themeToggleBtn) d.themeToggleBtn.onclick = () => this.toggleTheme();
            if(d.shortcutsBtn) d.shortcutsBtn.onclick = () => this.toggleModal('shortcuts', true);
            if(d.globalSearch) {
                d.globalSearch.addEventListener('input', (e) => this.handlePatientSearch(e.target.value));
                d.globalSearch.addEventListener('focus', (e) => this.handlePatientSearch(e.target.value));
            }
            
            // Close search dropdown on outside click
            document.addEventListener('click', (e) => {
                if (d.globalSearch && d.searchResults && 
                    !d.globalSearch.contains(e.target) && !d.searchResults.contains(e.target)) {
                    d.searchResults.setAttribute("aria-hidden", "true");
                }
            });

            // --- 7.2 Patient & Context ---
            if(d.newPatientBtn) d.newPatientBtn.onclick = () => this.toggleModal('newPatient', true);
            if(d.saveNewPatientBtn) d.saveNewPatientBtn.onclick = () => this.registerNewPatient();
            if(d.closeNewPatientBtn) d.closeNewPatientBtn.onclick = () => this.toggleModal('newPatient', false);
            
            if(d.calcBtn) d.calcBtn.onclick = () => this.handleBMICalculation();
            if(d.openHistoryBtn) d.openHistoryBtn.onclick = () => this.toggleHistory(true);
            if(d.closeHistoryBtn) d.closeHistoryBtn.onclick = () => this.toggleHistory(false);

            // --- 7.3 Clinical & Rx Interactions ---
            if(d.addRxBtn) d.addRxBtn.onclick = () => this.addRxItem();
            if(d.rxDrugName) d.rxDrugName.addEventListener('input', (e) => this.handleDrugSearch(e.target.value));
            if(d.aiSuggestBtn) d.aiSuggestBtn.onclick = () => this.triggerAI();
            if(d.dismissAllergyBtn) d.dismissAllergyBtn.onclick = () => d.rxSafetyBanner.classList.remove('is-visible');

            // Advanced Rx Navigation (Enter Key Strategy)
            if(d.rxDrugName) {
                d.rxDrugName.addEventListener('keydown', (e) => {
                    if(e.key === "Enter") d.rxDose.focus();
                    if(e.key === "Escape") d.drugSuggestions.setAttribute("aria-hidden", "true");
                });
                d.rxDose.addEventListener('keydown', (e) => { if(e.key === "Enter") d.rxFrequency.focus(); });
                d.rxFrequency.addEventListener('keydown', (e) => { if(e.key === "Enter") d.rxDuration.focus(); });
                d.rxDuration.addEventListener('keydown', (e) => { if(e.key === "Enter") d.rxRemarks.focus(); });
                d.rxRemarks.addEventListener('keydown', (e) => { if(e.key === "Enter") this.addRxItem(); });
            }

            // --- 7.4 Document Actions ---
            if(d.saveVisitBtn) d.saveVisitBtn.onclick = () => this.saveVisit();
            if(d.printBtn) d.printBtn.onclick = () => this.generatePrintDocument();

            // --- 7.5 Settings ---
            if(d.settingsBtn) d.settingsBtn.onclick = () => this.openSettings();
            if(d.saveSettingsBtn) d.saveSettingsBtn.onclick = () => this.saveSettings();
            if(d.closeSettingsBtn) d.closeSettingsBtn.onclick = () => this.toggleModal('settings', false);
            if(d.closeShortcutsBtn) d.closeShortcutsBtn.onclick = () => this.toggleModal('shortcuts', false);

            // --- 7.6 Real-time Preview Binding ---
            // Bind input events to all clinical fields for immediate preview updates
            const inputsToWatch = [
                d.coText, d.examText, d.dxText, d.adviceText, d.investText, d.visitDate,
                d.vitalBP, d.vitalPulse, d.vitalTemp, d.vitalSpO2, d.vitalWeight
            ];
            inputsToWatch.forEach(el => {
                if(el) el.addEventListener('input', () => this.updatePreview());
            });
        },

        initShortcuts() {
            document.addEventListener('keydown', (e) => {
                // Ctrl/Cmd + S = Save
                if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                    e.preventDefault();
                    this.saveVisit();
                }
                // Ctrl/Cmd + P = Print
                if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
                    e.preventDefault();
                    this.generatePrintDocument();
                }
                // Alt + N = New Patient
                if(e.altKey && e.key.toLowerCase() === 'n') {
                    e.preventDefault();
                    this.toggleModal('newPatient', true);
                    if(this.dom.regName) setTimeout(() => this.dom.regName.focus(), 100);
                }
                // Alt + S = Search
                if(e.altKey && e.key.toLowerCase() === 's') {
                    e.preventDefault();
                    if(this.dom.globalSearch) this.dom.globalSearch.focus();
                }
                // Esc = Close Modals
                if(e.key === 'Escape') {
                    this.toggleModal('newPatient', false);
                    this.toggleModal('settings', false);
                    this.toggleModal('shortcuts', false);
                    this.toggleHistory(false);
                    if(this.dom.drugSuggestions) this.dom.drugSuggestions.setAttribute('aria-hidden', 'true');
                    if(this.dom.searchResults) this.dom.searchResults.setAttribute('aria-hidden', 'true');
                    this.cancelRxEdit();
                }
            });
        },

        initTabs() {
            this.dom.tabButtons.forEach(btn => {
                btn.onclick = () => {
                    // Remove active from all
                    this.dom.tabButtons.forEach(b => b.classList.remove('active'));
                    this.dom.tabContents.forEach(c => c.classList.remove('active'));
                    
                    // Activate target
                    btn.classList.add('active');
                    const targetId = btn.getAttribute('data-tab');
                    const targetContent = document.getElementById(targetId);
                    if(targetContent) targetContent.classList.add('active');
                };
            });
        },

        initClock() {
            const tick = () => {
                const now = new Date();
                if(this.dom.liveTime) this.dom.liveTime.textContent = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
                if(this.dom.liveDate) this.dom.liveDate.textContent = now.toLocaleDateString([], {weekday:'short', month:'short', day:'numeric'});
            };
            tick();
            setInterval(tick, 1000);
        },


        /* ==========================================================================
           8.0 PATIENT MANAGEMENT MODULE
           ========================================================================== */

        loadData() {
            try {
                // Load from LocalStorage
                const rawPatients = localStorage.getItem(CONFIG.STORAGE_KEYS.PATIENTS);
                const rawVisits = localStorage.getItem(CONFIG.STORAGE_KEYS.VISITS);
                const rawSettings = localStorage.getItem(CONFIG.STORAGE_KEYS.SETTINGS);

                this.state.patients = rawPatients ? JSON.parse(rawPatients) : [];
                this.state.visits = rawVisits ? JSON.parse(rawVisits) : [];
                if(rawSettings) this.state.clinic = JSON.parse(rawSettings);

                Logger.info(`Data Loaded: ${this.state.patients.length} patients, ${this.state.visits.length} visits.`);
            } catch (e) {
                Logger.error("Data Load Failed", e);
                this.showToast("Database Error: Could not load records", "error");
            }
        },

        persistData() {
            try {
                localStorage.setItem(CONFIG.STORAGE_KEYS.PATIENTS, JSON.stringify(this.state.patients));
                localStorage.setItem(CONFIG.STORAGE_KEYS.VISITS, JSON.stringify(this.state.visits));
                localStorage.setItem(CONFIG.STORAGE_KEYS.SETTINGS, JSON.stringify(this.state.clinic));
            } catch (e) {
                Logger.error("Persist Failed", e);
                this.showToast("Critical: Failed to save data!", "error");
            }
        },

        registerNewPatient() {
            const d = this.dom;
            const name = d.regName.value.trim();
            const phone = d.regPhone.value.trim();

            if (!name) {
                this.showToast("Patient Name is required", "warning");
                return d.regName.focus();
            }

            const newPatient = {
                id: Utils.generateId("P"),
                name: name,
                phone: phone,
                age: d.regAge.value || "--",
                sex: d.regSex.value,
                allergies: d.regAllergies.value,
                chronic: d.regChronic.value,
                registeredAt: new Date().toISOString()
            };

            this.state.patients.push(newPatient);
            this.persistData();

            // Cleanup form
            d.regName.value = ""; d.regPhone.value = ""; d.regAge.value = "";
            d.regAllergies.value = ""; d.regChronic.value = "";
            
            this.toggleModal('newPatient', false);
            this.loadPatientContext(newPatient);
            this.showToast("Patient Registered Successfully", "success");
        },

        handlePatientSearch(query) {
            const box = this.dom.searchResults;
            if (!query || query.length < 1) {
                box.setAttribute("aria-hidden", "true");
                return;
            }

            const q = query.toLowerCase();
            const matches = this.state.patients.filter(p => 
                p.name.toLowerCase().includes(q) || 
                p.phone.includes(q) ||
                p.id.toLowerCase().includes(q)
            ).slice(0, 10); // Limit results

            box.innerHTML = "";
            if (matches.length === 0) {
                box.innerHTML = `<div class="search-result-item" style="color:#94a3b8; cursor:default;">No matches found.</div>`;
            } else {
                matches.forEach(p => {
                    const div = document.createElement("div");
                    div.className = "search-result-item";
                    div.innerHTML = `
                        <div style="display:flex; flex-direction:column;">
                            <span style="font-weight:600; color:var(--text-main);">${Utils.escapeHtml(p.name)}</span>
                            <span style="font-size:11px; color:var(--text-muted);">ID: ${p.id}</span>
                        </div>
                        <div style="font-size:12px; color:var(--text-secondary);">
                            ${p.phone}
                        </div>
                    `;
                    div.onclick = () => {
                        this.loadPatientContext(p);
                        this.dom.globalSearch.value = "";
                        box.setAttribute("aria-hidden", "true");
                    };
                    box.appendChild(div);
                });
            }
            box.setAttribute("aria-hidden", "false");
        },

        loadPatientContext(patient) {
            this.state.currentPatient = patient;
            const d = this.dom;

            if (!patient) {
                // Reset to "No Patient" state
                if(d.contextStrip) d.contextStrip.classList.add('is-hidden');
                this.resetClinicalForms();
                this.updatePreview();
                return;
            }

            // Populate Header Context Strip
            if(d.contextStrip) d.contextStrip.classList.remove('is-hidden');
            if(d.headerName) d.headerName.textContent = patient.name;
            if(d.headerUhid) d.headerUhid.textContent = `UHID: ${patient.id}`;
            if(d.headerAgeSex) d.headerAgeSex.textContent = `${patient.age} Y / ${patient.sex}`;
            if(d.headerPhone) d.headerPhone.textContent = patient.phone;
            if(d.headerAvatar) d.headerAvatar.textContent = patient.name.charAt(0).toUpperCase();

            // Populate Snapshots
            if(d.snapshotAllergies) d.snapshotAllergies.value = patient.allergies || "";
            if(d.snapshotChronic) d.snapshotChronic.value = patient.chronic || "";

            // Allergy Alert Logic (The Red Banner)
            if(patient.allergies && patient.allergies.trim() !== "") {
                if(d.rxSafetyBanner) {
                    d.rxSafetyBanner.classList.add('is-visible');
                    if(d.rxAllergyText) d.rxAllergyText.textContent = patient.allergies;
                }
            } else {
                if(d.rxSafetyBanner) d.rxSafetyBanner.classList.remove('is-visible');
            }

            // Start New Visit Context
            this.initializeNewVisit();
            this.showToast(`Loaded context for ${patient.name}`, "info");
        },


        /* ==========================================================================
           9.0 CLINICAL ENCOUNTER MODULE
           ========================================================================== */

        initializeNewVisit() {
            this.resetClinicalForms();
            
            // Create Draft Visit Object
            this.state.currentVisit = {
                id: Utils.generateId("V"),
                patientId: this.state.currentPatient.id,
                date: new Date().toISOString(),
                status: "draft",
                notes: {},
                vitals: {},
                rx: []
            };

            // Set Date Picker to Today
            if(this.dom.visitDate) this.dom.visitDate.valueAsDate = new Date();
            
            // Update Status Badge
            if(this.dom.visitStatus) {
                this.dom.visitStatus.textContent = "Draft";
                this.dom.visitStatus.className = "status-badge draft";
            }

            this.state.rxList = [];
            this.renderRxTable();
            this.updatePreview();
        },

        resetClinicalForms() {
            const d = this.dom;
            // Clear text areas
            [d.coText, d.examText, d.dxText, d.adviceText, d.investText].forEach(el => { if(el) el.value = ""; });
            // Clear Vitals
            [d.vitalBP, d.vitalPulse, d.vitalTemp, d.vitalSpO2, d.vitalWeight, d.vitalHeight].forEach(el => { if(el) el.value = ""; });
            // Clear Rx Input
            this.clearRxInput();
        },

        saveVisit() {
            if (!this.state.currentPatient) {
                this.showToast("No active patient context!", "error");
                return;
            }

            const d = this.dom;
            const visit = this.state.currentVisit;

            // 1. Gather Data from Inputs
            visit.date = d.visitDate.value || new Date().toISOString();
            visit.notes = {
                co: d.coText.value,
                exam: d.examText.value,
                dx: d.dxText.value,
                advice: d.adviceText.value,
                invest: d.investText.value
            };
            visit.vitals = {
                bp: d.vitalBP.value,
                pulse: d.vitalPulse.value,
                temp: d.vitalTemp.value,
                spo2: d.vitalSpO2.value,
                weight: d.vitalWeight.value,
                height: d.vitalHeight.value
            };
            visit.rx = [...this.state.rxList]; // Copy current Rx list
            visit.status = "saved";

            // 2. Update Persistent Patient Info (if changed in snapshot)
            this.state.currentPatient.allergies = d.snapshotAllergies.value;
            this.state.currentPatient.chronic = d.snapshotChronic.value;

            // 3. Commit to Store
            // Remove existing version of this visit if it exists (update scenario)
            this.state.visits = this.state.visits.filter(v => v.id !== visit.id);
            this.state.visits.push(visit);
            
            this.persistData();

            // 4. UI Feedback
            if(d.visitStatus) {
                d.visitStatus.textContent = "Saved";
                d.visitStatus.className = "status-badge success";
            }
            this.showToast("Visit saved to database.", "success");
        },

        handleBMICalculation() {
            const d = this.dom;
            const weight = parseFloat(d.vitalWeight.value);
            const height = parseFloat(d.vitalHeight.value);

            if (isNaN(weight) || isNaN(height)) {
                this.showToast("Please enter Weight (kg) and Height (cm)", "warning");
                return;
            }

            const result = Utils.calculateBMI(weight, height);
            if (result) {
                const msg = `BMI: ${result.value} (${result.status})`;
                this.showToast(msg, "info");
                
                // Smart Feature: Auto-append to Advice if not exists
                if (!d.adviceText.value.includes("BMI:")) {
                    d.adviceText.value += (d.adviceText.value ? "\n\n" : "") + `[Calculated] ${msg}`;
                    this.updatePreview();
                }
            }
        },

        toggleHistory(show) {
            const drawer = this.dom.historyDrawer;
            if(!drawer) return;
            
            drawer.setAttribute("aria-hidden", !show);
            
            if (show) {
                this.renderHistory();
            }
        },

        renderHistory() {
            const list = this.dom.historyList;
            if(!list) return;
            
            list.innerHTML = "";
            
            if(!this.state.currentPatient) {
                list.innerHTML = `<div style="padding:20px; color:var(--text-muted); text-align:center;">No patient selected</div>`;
                return;
            }

            const history = this.state.visits
                .filter(v => v.patientId === this.state.currentPatient.id)
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            if (history.length === 0) {
                list.innerHTML = `<div style="padding:20px; color:var(--text-muted); text-align:center;">No previous visits found.</div>`;
                return;
            }

            history.forEach(visit => {
                const card = document.createElement("div");
                card.className = "history-card";
                card.innerHTML = `
                    <div class="card-date">
                        <span>${Utils.formatDate(visit.date)}</span>
                        <span class="status-badge success">Saved</span>
                    </div>
                    <div class="card-co">
                        <strong>Dx:</strong> ${Utils.escapeHtml(visit.notes.dx || "--")}
                    </div>
                    <div class="card-co" style="margin-top:4px; font-style:italic; color:var(--text-secondary);">
                        ${Utils.escapeHtml(visit.notes.co || "No complaints recorded")}
                    </div>
                `;
                // Load history item on click
                card.onclick = () => {
                    if(confirm("Load this historical data into current view? (Unsaved changes will be lost)")) {
                        this.loadVisitIntoView(visit);
                        this.toggleHistory(false);
                    }
                };
                list.appendChild(card);
            });
        },

        loadVisitIntoView(visit) {
            const d = this.dom;
            
            // Map data back to inputs
            d.visitDate.value = visit.date.split('T')[0];
            d.coText.value = visit.notes.co || "";
            d.examText.value = visit.notes.exam || "";
            d.dxText.value = visit.notes.dx || "";
            d.adviceText.value = visit.notes.advice || "";
            d.investText.value = visit.notes.invest || "";
            
            if(visit.vitals) {
                d.vitalBP.value = visit.vitals.bp || "";
                d.vitalPulse.value = visit.vitals.pulse || "";
                d.vitalTemp.value = visit.vitals.temp || "";
                d.vitalSpO2.value = visit.vitals.spo2 || "";
                d.vitalWeight.value = visit.vitals.weight || "";
                d.vitalHeight.value = visit.vitals.height || "";
            }

            this.state.rxList = JSON.parse(JSON.stringify(visit.rx || []));
            this.renderRxTable();
            this.updatePreview();
            
            if(d.visitStatus) {
                d.visitStatus.textContent = "History Mode";
                d.visitStatus.className = "status-badge draft";
            }
            this.showToast("Historical Visit Loaded", "info");
        },


        /* ==========================================================================
           10.0 PRESCRIPTION (RX) COCKPIT ENGINE
           ========================================================================== */

        handleDrugSearch(query) {
            const box = this.dom.drugSuggestions;
            
            // Check if global meds list is available
            if (typeof window.meds_10000_cleaned === 'undefined') {
                console.warn("Meds DB not loaded.");
                return;
            }

            if (!query || query.length < 2) {
                box.setAttribute("aria-hidden", "true");
                return;
            }

            // High-performance filter
            const q = query.toLowerCase();
            const matches = window.meds_10000_cleaned.filter(item => 
                item.name.toLowerCase().includes(q)
            ).slice(0, 15); // Show top 15 results

            box.innerHTML = "";
            matches.forEach(item => {
                const div = document.createElement("div");
                div.className = "search-result-item";
                div.textContent = item.name; 
                div.onclick = () => {
                    this.dom.rxDrugName.value = item.name;
                    this.dom.rxDose.focus(); // Auto-focus next field
                    box.setAttribute("aria-hidden", "true");
                };
                box.appendChild(div);
            });

            if(matches.length > 0) box.setAttribute("aria-hidden", "false");
            else box.setAttribute("aria-hidden", "true");
        },

        // Helper to set Form (Tab/Cap/etc) from Quick Chips
        setRxForm(formType) {
            const input = this.dom.rxDrugName;
            if(!input) return;
            
            // Check if value already starts with a form
            const current = input.value;
            const forms = ["Tab.", "Cap.", "Syr.", "Inj.", "Oint.", "Drops"];
            const hasForm = forms.some(f => current.startsWith(f));
            
            if(hasForm) {
                // Replace existing form
                const parts = current.split(" ");
                parts[0] = formType;
                input.value = parts.join(" ");
            } else {
                // Prepend
                input.value = formType + " " + current;
            }
            input.focus();
        },

        // Helper to set Duration from Quick Chips
        setRxDuration(dur) {
            if(this.dom.rxDuration) {
                this.dom.rxDuration.value = dur;
                // Optionally auto-focus remarks if duration is set
                if(this.dom.rxRemarks) this.dom.rxRemarks.focus();
            }
        },

        addRxItem() {
            const d = this.dom;
            const drugName = d.rxDrugName.value.trim();

            if (!drugName) {
                this.showToast("Please enter a medicine name", "warning");
                d.rxDrugName.focus();
                return;
            }

            // Create Object
            const rxItem = {
                id: this.state.editingRxId || Utils.generateId("RX"),
                drug: drugName,
                dose: d.rxDose.value || "",
                freq: d.rxFrequency.value || "",
                duration: d.rxDuration.value || "",
                remarks: d.rxRemarks.value || ""
            };

            // Edit or Add logic
            if (this.state.editingRxId) {
                const index = this.state.rxList.findIndex(item => item.id === this.state.editingRxId);
                if (index !== -1) {
                    this.state.rxList[index] = rxItem;
                    this.showToast("Medicine Updated", "success");
                }
                this.cancelRxEdit();
            } else {
                // Allergy Check (Simple keyword matching against patient history)
                const allergyStr = this.state.currentPatient?.allergies?.toLowerCase() || "";
                if (allergyStr && allergyStr.includes(drugName.split(" ")[0].toLowerCase())) {
                    if(!confirm(`WARNING: Patient has allergy '${allergyStr}'. \nAre you sure you want to prescribe ${drugName}?`)) {
                        return; // Abort
                    }
                }
                
                this.state.rxList.push(rxItem);
            }

            this.clearRxInput();
            this.renderRxTable();
            this.updatePreview();
            d.rxDrugName.focus(); // Ready for next entry
        },

        editRxItem(id) {
            const item = this.state.rxList.find(r => r.id === id);
            if (!item) return;

            const d = this.dom;
            d.rxDrugName.value = item.drug;
            d.rxDose.value = item.dose;
            d.rxFrequency.value = item.freq;
            d.rxDuration.value = item.duration;
            d.rxRemarks.value = item.remarks;

            this.state.editingRxId = id;
            
            // Visual cues for editing mode
            d.addRxBtnText.textContent = "Update";
            d.addRxBtn.classList.remove("btn-primary");
            d.addRxBtn.classList.add("btn-warning"); // Assuming warning style
            if(d.editingIndicator) d.editingIndicator.classList.remove("is-hidden");
            
            d.rxDrugName.focus();
        },

        deleteRxItem(id) {
            this.state.rxList = this.state.rxList.filter(r => r.id !== id);
            if (this.state.editingRxId === id) this.cancelRxEdit();
            this.renderRxTable();
            this.updatePreview();
        },

        cancelRxEdit() {
            this.state.editingRxId = null;
            this.clearRxInput();
            const d = this.dom;
            d.addRxBtnText.textContent = "Add Med";
            d.addRxBtn.classList.remove("btn-warning");
            d.addRxBtn.classList.add("btn-primary");
            if(d.editingIndicator) d.editingIndicator.classList.add("is-hidden");
        },

        clearRxInput() {
            const d = this.dom;
            d.rxDrugName.value = "";
            d.rxDose.value = "";
            d.rxFrequency.value = "";
            d.rxDuration.value = "";
            d.rxRemarks.value = "";
        },

        renderRxTable() {
            const tbody = this.dom.rxTableBody;
            if(!tbody) return;
            tbody.innerHTML = "";

            const list = this.state.rxList;
            
            // Handle Empty State
            if (this.dom.rxEmptyState) {
                this.dom.rxEmptyState.style.display = list.length === 0 ? "flex" : "none";
            }

            list.forEach((item, index) => {
                const tr = document.createElement("tr");
                
                // Determine Form Badge Class
                let formClass = "def";
                let drugDisplay = item.drug;
                if(item.drug.startsWith("Tab.")) { formClass = "tab"; drugDisplay = item.drug.replace("Tab. ", ""); }
                else if(item.drug.startsWith("Cap.")) { formClass = "cap"; drugDisplay = item.drug.replace("Cap. ", ""); }
                else if(item.drug.startsWith("Syr.")) { formClass = "syr"; drugDisplay = item.drug.replace("Syr. ", ""); }
                else if(item.drug.startsWith("Inj.")) { formClass = "inj"; drugDisplay = item.drug.replace("Inj. ", ""); }
                else if(item.drug.startsWith("Oint.")) { formClass = "def"; drugDisplay = item.drug.replace("Oint. ", ""); }
                else if(item.drug.startsWith("Drops")) { formClass = "def"; drugDisplay = item.drug.replace("Drops ", ""); }
                
                // Determine Frequency Icons (Sun/Moon) for "Cute" mode
                let freqIcons = item.freq;
                const f = item.freq.toUpperCase();
                // We append simple visual cues for common frequencies
                if(f.includes("BD")) freqIcons = "☀️ 🌙 (BD)";
                else if(f.includes("TDS")) freqIcons = "☀️ 🌤️ 🌙 (TDS)";
                else if(f.includes("OD")) freqIcons = "☀️ (OD)";
                else if(f.includes("QD")) freqIcons = "☀️ ☀️ 🌤️ 🌙 (QD)";
                else if(f.includes("HS")) freqIcons = "🌙 (HS)";
                else if(f.includes("SOS")) freqIcons = "⚠️ (SOS)";

                tr.innerHTML = `
                    <td style="color:#94a3b8; font-size:11px; text-align:center;">${index + 1}</td>
                    <td>
                        <div>
                            ${formClass !== 'def' ? `<span class="form-badge ${formClass}">${item.drug.split('.')[0]}</span>` : ''}
                            <span class="med-name">${Utils.escapeHtml(drugDisplay)}</span>
                        </div>
                        ${item.remarks ? `<div class="med-remarks">📝 ${Utils.escapeHtml(item.remarks)}</div>` : ''}
                    </td>
                    <td style="font-weight:600; color:#334155;">${Utils.escapeHtml(item.dose)}</td>
                    <td><span class="time-badge">${freqIcons}</span></td>
                    <td>${Utils.escapeHtml(item.duration)}</td>
                    <td>
                        <div style="display:flex; gap:4px; justify-content:flex-end;">
                            <button class="btn-row-action" onclick="App.editRxItem('${item.id}')" title="Edit">✏️</button>
                            <button class="btn-row-action delete" onclick="App.deleteRxItem('${item.id}')" title="Delete">🗑️</button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        },


        /* ==========================================================================
           11.0 ARTIFICIAL INTELLIGENCE (CDSS)
           ========================================================================== */

        triggerAI() {
            const dx = this.dom.dxText.value.toLowerCase();
            const btn = this.dom.aiSuggestBtn;
            const loader = this.dom.aiLoading;

            if (!dx) {
                this.showToast("Please enter a Diagnosis first for AI analysis.", "warning");
                this.dom.dxText.focus();
                return;
            }

            // UI Loading State
            btn.disabled = true;
            if(loader) loader.classList.remove("is-hidden");
            this.showToast("AI analyzing diagnosis...", "info");

            // Simulate Network/Processing Latency
            setTimeout(() => {
                let matchFound = false;
                
                // 1. Search Protocols in Knowledge Base
                for (const [key, proto] of Object.entries(MEDICAL_KNOWLEDGE_BASE)) {
                    if (proto.keywords.some(k => dx.includes(k))) {
                        this.applyProtocol(proto);
                        matchFound = true;
                        break;
                    }
                }

                // 2. Fallback
                if (!matchFound) {
                    this.applyProtocol(MEDICAL_KNOWLEDGE_BASE["DEFAULT"]);
                    this.showToast("No specific protocol matched. Loaded generic set.", "info");
                } else {
                    this.showToast("Protocol matched and applied.", "success");
                }

                // Reset UI
                btn.disabled = false;
                if(loader) loader.classList.add("is-hidden");

            }, CONFIG.UI.AI_THINK_TIME);
        },

        applyProtocol(proto) {
            // Append Advice
            const adviceField = this.dom.adviceText;
            if (adviceField.value.trim() === "") {
                adviceField.value = proto.advice;
            } else if (!adviceField.value.includes(proto.advice)) {
                adviceField.value += "\n" + proto.advice;
            }

            // Append Investigations (if available)
            if(proto.investigations) {
                const invField = this.dom.investText;
                if(invField.value.trim() === "") {
                    invField.value = proto.investigations;
                } else if(!invField.value.includes(proto.investigations)) {
                    invField.value += "\n" + proto.investigations;
                }
            }

            // Add Medicines
            proto.rx.forEach(med => {
                this.state.rxList.push({
                    id: Utils.generateId("AI-RX"),
                    drug: med.drug,
                    dose: med.dose,
                    freq: med.freq,
                    duration: med.dur,
                    remarks: med.remarks
                });
            });

            this.renderRxTable();
            this.updatePreview();
        },

        // Dictation Wrapper
        initDictation() {
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                this.state.recognitionObject = new SpeechRecognition();
                this.state.recognitionObject.continuous = false;
                this.state.recognitionObject.interimResults = false;
                
                this.state.recognitionObject.onresult = (event) => {
                    const text = event.results[0][0].transcript;
                    if(this.state.activeDictationInput) {
                        const el = document.getElementById(this.state.activeDictationInput);
                        if(el) {
                            el.value = (el.value ? el.value + " " : "") + text;
                            this.updatePreview();
                        }
                    }
                };

                this.state.recognitionObject.onend = () => {
                    this.state.isRecording = false;
                    document.querySelectorAll('.mic-btn').forEach(b => b.classList.remove('recording'));
                };
            }
        },

        toggleDictation(inputId, btn) {
            if(!this.state.recognitionObject) {
                this.showToast("Voice dictation not supported in this browser.", "error");
                return;
            }

            if(this.state.isRecording) {
                this.state.recognitionObject.stop();
            } else {
                this.state.activeDictationInput = inputId;
                this.state.recognitionObject.start();
                this.state.isRecording = true;
                btn.classList.add('recording');
                this.showToast("Listening...", "info");
            }
        },

        insertMacro(inputId, text) {
            const el = document.getElementById(inputId);
            if(el) {
                el.value = (el.value ? el.value + "\n" : "") + text;
                this.updatePreview();
            }
        },


        /* ==========================================================================
           12.0 DOCUMENT GENERATION (HIGH-FIDELITY PRINT)
           ========================================================================== */

        updatePreview() {
            const d = this.dom;
            const c = this.state.clinic;
            const p = this.state.currentPatient;

            // Header Info
            if(d.previewClinicName) d.previewClinicName.textContent = c.name;
            if(d.previewDoctorName) d.previewDoctorName.textContent = c.doctor;
            if(d.previewClinicAddress) d.previewClinicAddress.textContent = c.address;
            if(d.previewFooterNote) d.previewFooterNote.textContent = c.footerNote;
            
            // Patient Info
            if (p) {
                if(d.previewPatientName) d.previewPatientName.textContent = p.name;
                if(d.previewPatientAgeSex) d.previewPatientAgeSex.textContent = `${p.age}/${p.sex}`;
                if(d.previewPatientId) d.previewPatientId.textContent = p.id;
            }

            // Dates
            if(d.previewDatePrint) d.previewDatePrint.textContent = d.visitDate.value ? new Date(d.visitDate.value).toLocaleDateString() : '';

            // Vitals
            const vitalsArray = [];
            if(d.vitalBP.value) vitalsArray.push(`BP: <strong>${d.vitalBP.value}</strong>`);
            if(d.vitalPulse.value) vitalsArray.push(`Pulse: <strong>${d.vitalPulse.value}</strong>`);
            if(d.vitalTemp.value) vitalsArray.push(`Temp: <strong>${d.vitalTemp.value}</strong>`);
            if(d.vitalWeight.value) vitalsArray.push(`Wt: <strong>${d.vitalWeight.value} kg</strong>`);
            
            if(d.previewVitals) d.previewVitals.innerHTML = vitalsArray.join(" | ");
            if(d.previewVitalsRow) d.previewVitalsRow.style.display = vitalsArray.length ? 'block' : 'none';

            // Clinical Text
            if(d.previewCO) d.previewCO.innerText = d.coText.value;
            if(d.previewExam) d.previewExam.innerText = d.examText.value;
            if(d.previewDx) d.previewDx.innerText = d.dxText.value;
            if(d.previewAdvice) d.previewAdvice.innerText = d.adviceText.value;
            if(d.previewInvest) d.previewInvest.innerText = d.investText.value;

            // Rx Table Preview
            if(d.previewRxTable) {
                d.previewRxTable.innerHTML = "";
                this.state.rxList.forEach((item, i) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="col-type">${i+1}</td>
                        <td class="col-med">${item.drug}</td>
                        <td class="col-dose">${item.dose}</td>
                        <td class="col-freq">${item.freq}</td>
                        <td class="col-dur">${item.duration}</td>
                        <td class="col-remark">${item.remarks}</td>
                    `;
                    d.previewRxTable.appendChild(row);
                });
            }
        },

        generatePrintDocument() {
            // Ensure data is saved first
            this.saveVisit();

            // Clone print logic from preview but formatted specifically for A4
            // We use the 'printable-clone' div hidden in CSS but shown in @media print
            let printArea = document.querySelector('.printable-clone');
            if(!printArea) {
                printArea = document.createElement('div');
                printArea.className = 'printable-clone';
                document.body.appendChild(printArea);
            }

            const c = this.state.clinic;
            const p = this.state.currentPatient || { name: '--', age: '--', sex: '--', id: '--', phone: '--' };
            const d = this.dom;
            const rxList = this.state.rxList;
            const visitDate = new Date(d.visitDate.value).toLocaleDateString();

            // Generate HTML for Medicine Rows
            const rxRows = rxList.map((r, i) => `
                <tr>
                    <td style="padding:5px; border:1px solid #000; width:30px; text-align:center;">${i+1}</td>
                    <td style="padding:5px; border:1px solid #000; font-weight:bold;">${Utils.escapeHtml(r.drug)}</td>
                    <td style="padding:5px; border:1px solid #000;">${Utils.escapeHtml(r.dose)}</td>
                    <td style="padding:5px; border:1px solid #000;">${Utils.escapeHtml(r.freq)}</td>
                    <td style="padding:5px; border:1px solid #000;">${Utils.escapeHtml(r.duration)}</td>
                    <td style="padding:5px; border:1px solid #000; font-style:italic;">${Utils.escapeHtml(r.remarks)}</td>
                </tr>
            `).join('');

            // SVG Logo Placeholder
            const logoSvg = `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`;

            const htmlContent = `
                <div style="font-family: 'Inter', sans-serif; padding: 40px; color:#000; max-width: 210mm; margin: auto;">
                    
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid #1e3a8a; padding-bottom:15px; margin-bottom:20px;">
                        <div style="display:flex; align-items:center; gap:15px;">
                            <div style="border:1px solid #ddd; border-radius:8px; padding:5px;">${logoSvg}</div>
                            <div>
                                <h1 style="margin:0; font-size:26px; text-transform:uppercase; color:#1e3a8a;">${Utils.escapeHtml(c.name)}</h1>
                                <div style="font-size:12px; color:#555;">${Utils.escapeHtml(c.address)}</div>
                            </div>
                        </div>
                        <div style="text-align:right;">
                            <h2 style="margin:0; font-size:18px;">${Utils.escapeHtml(c.doctor)}</h2>
                            <div style="font-size:12px;">Cardiologist & General Physician</div>
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px; font-size:13px; margin-bottom:20px; padding:10px; background:#f8fafc; border:1px solid #ddd;">
                        <div><strong>Name:</strong> ${Utils.escapeHtml(p.name)}</div>
                        <div><strong>Age/Sex:</strong> ${Utils.escapeHtml(p.age + ' / ' + p.sex)}</div>
                        <div><strong>Visit ID:</strong> ${Utils.escapeHtml(p.id)}</div>
                        <div><strong>Date:</strong> ${visitDate}</div>
                        <div><strong>Phone:</strong> ${Utils.escapeHtml(p.phone)}</div>
                    </div>

                    <div style="font-size:14px; line-height:1.6;">
                        
                        ${d.vitalBP.value ? `
                        <div style="margin-bottom:15px; font-family:monospace; border:1px solid #000; padding:8px; display:inline-block; width:100%;">
                            <strong>VITALS:</strong> BP: ${d.vitalBP.value} | Pulse: ${d.vitalPulse.value} | Temp: ${d.vitalTemp.value} | SpO2: ${d.vitalSpO2.value}% | Wt: ${d.vitalWeight.value}
                        </div>
                        ` : ''}
                        
                        ${d.coText.value ? `<div style="margin-top:15px;"><strong>Chief Complaints:</strong><br>${Utils.escapeHtml(d.coText.value)}</div>` : ''}
                        
                        ${d.examText.value ? `<div style="margin-top:10px;"><strong>Examination:</strong><br>${Utils.escapeHtml(d.examText.value)}</div>` : ''}
                        
                        ${d.dxText.value ? `<div style="margin-top:10px;"><strong>Diagnosis:</strong><br><b>${Utils.escapeHtml(d.dxText.value)}</b></div>` : ''}
                    </div>

                    ${rxList.length > 0 ? `
                    <div style="margin-top:25px;">
                        <div style="font-size:32px; font-weight:bold; margin-bottom:5px; font-family:serif;">℞</div>
                        <table style="width:100%; border-collapse:collapse; font-size:13px;">
                            <thead style="background:#f1f5f9;">
                                <tr>
                                    <th style="border:1px solid #000; padding:6px; width:30px;">#</th>
                                    <th style="border:1px solid #000; padding:6px; text-align:left;">Medicine Name</th>
                                    <th style="border:1px solid #000; padding:6px;">Dose</th>
                                    <th style="border:1px solid #000; padding:6px;">Frequency</th>
                                    <th style="border:1px solid #000; padding:6px;">Duration</th>
                                    <th style="border:1px solid #000; padding:6px;">Instruction</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rxRows}
                            </tbody>
                        </table>
                    </div>
                    ` : ''}

                    <div style="margin-top:25px; font-size:14px; border:1px dashed #999; padding:15px; min-height:100px;">
                        ${d.adviceText.value ? `<div><strong>Advice / Follow-up:</strong><br>${Utils.escapeHtml(d.adviceText.value)}</div>` : ''}
                        ${d.investText.value ? `<div style="margin-top:15px;"><strong>Investigations Required:</strong><br>${Utils.escapeHtml(d.investText.value)}</div>` : ''}
                    </div>

                    <div style="margin-top:60px; display:flex; justify-content:space-between; align-items:flex-end;">
                        <div style="font-size:11px; color:#666; max-width:60%;">
                            <i>${Utils.escapeHtml(c.footerNote)}</i>
                        </div>
                        <div style="text-align:center;">
                            <div style="height:50px;"></div> <div style="border-top:1px solid #000; width:180px; padding-top:5px; font-weight:bold;">${Utils.escapeHtml(c.doctor)}</div>
                            <div style="font-size:10px;">(Signature)</div>
                        </div>
                    </div>
                </div>
            `;

            printArea.innerHTML = htmlContent;

            // Trigger Browser Print
            setTimeout(() => {
                window.print();
            }, 100);
        },

        // --- Settings & Utils ---
        openSettings() {
            const c = this.state.clinic;
            const d = this.dom;
            if(d.settingClinicName) d.settingClinicName.value = c.name;
            if(d.settingDoctorName) d.settingDoctorName.value = c.doctor;
            if(d.settingClinicAddress) d.settingClinicAddress.value = c.address;
            if(d.settingFooterNote) d.settingFooterNote.value = c.footerNote;
            this.toggleModal('settings', true);
        },

        saveSettings() {
            const d = this.dom;
            this.state.clinic = {
                name: d.settingClinicName.value,
                doctor: d.settingDoctorName.value,
                address: d.settingClinicAddress.value,
                footerNote: d.settingFooterNote.value
            };
            this.persistData();
            this.renderClinicBranding();
            this.toggleModal('settings', false);
            this.showToast("Settings Updated", "success");
        },

        renderClinicBranding() {
            if(this.dom.clinicNameDisplay) this.dom.clinicNameDisplay.textContent = this.state.clinic.name;
            if(this.dom.doctorNameDisplay) this.dom.doctorNameDisplay.textContent = this.state.clinic.doctor;
            this.updatePreview();
        },

        toggleModal(name, show) {
            const id = name + 'Modal';
            if(this.dom[id]) this.dom[id].setAttribute('aria-hidden', !show);
        },

        toggleTheme() {
            this.state.isDarkMode = !this.state.isDarkMode;
            if (this.state.isDarkMode) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
            // In a real app, save this preference
        },
        
        loadTheme() {
            // Optional: Load theme from local storage
        },

        showToast(message, type = "info") {
            const container = document.getElementById('toast-container') || (() => {
                const div = document.createElement('div');
                div.id = 'toast-container';
                div.style.cssText = "position:fixed; bottom:24px; right:24px; display:flex; flex-direction:column; gap:10px; z-index:10000;";
                document.body.appendChild(div);
                return div;
            })();

            const toast = document.createElement('div');
            const colors = {
                info: '#3b82f6',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444'
            };
            
            toast.style.cssText = `
                background: ${colors[type] || '#333'};
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                font-family: 'Inter', sans-serif;
                font-size: 13px;
                font-weight: 500;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
                display: flex; align-items: center; gap: 8px;
            `;
            
            let icon = "ℹ️";
            if(type === 'success') icon = "✅";
            if(type === 'warning') icon = "⚠️";
            if(type === 'error') icon = "❌";

            toast.innerHTML = `<span>${icon}</span> ${message}`;
            container.appendChild(toast);

            // Animate In
            requestAnimationFrame(() => {
                toast.style.opacity = "1";
                toast.style.transform = "translateY(0)";
            });

            // Animate Out
            setTimeout(() => {
                toast.style.opacity = "0";
                toast.style.transform = "translateY(20px)";
                setTimeout(() => toast.remove(), 300);
            }, CONFIG.UI.TOAST_DURATION);
        }
    };

    /* ==========================================================================
       13.0 MOBILE CONTROLLER (RESPONSIVE LOGIC)
       ========================================================================== */
    const MobileApp = {
        init() {
            // Run on load to set initial state if on mobile
            if (window.innerWidth <= 768) {
                this.switchView('editor');
            }
            
            // Listen for resize
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    // Reset inline styles if moving back to desktop
                    const pLeft = document.querySelector('.panel-left');
                    const pCenter = document.querySelector('.panel-center');
                    const pRight = document.querySelector('.panel-right');
                    
                    if(pLeft) { pLeft.style.display = ''; pLeft.classList.remove('mobile-active'); }
                    if(pCenter) { pCenter.style.display = ''; pCenter.classList.remove('mobile-active'); }
                    if(pRight) { pRight.style.display = ''; pRight.classList.remove('mobile-active'); }
                } else {
                    // Re-assert mobile view
                    const activePanel = document.querySelector('.panel.mobile-active');
                    if(!activePanel) this.switchView('editor');
                }
            });
        },

        switchView(viewName) {
            // 1. Get Panels
            const pLeft = document.querySelector('.panel-left');
            const pCenter = document.querySelector('.panel-center');
            const pRight = document.querySelector('.panel-right');
            const navBtns = document.querySelectorAll('.mob-nav-btn');

            // 2. Hide All
            [pLeft, pCenter, pRight].forEach(p => {
                if(p) p.classList.remove('mobile-active');
            });

            // 3. Show Active
            if (viewName === 'snapshot' && pLeft) pLeft.classList.add('mobile-active');
            if (viewName === 'editor' && pCenter) pCenter.classList.add('mobile-active');
            if (viewName === 'preview' && pRight) {
                pRight.classList.add('mobile-active');
                if(App && App.updatePreview) App.updatePreview(); // Trigger render
            }

            // 4. Update Nav Buttons
            navBtns.forEach((btn, index) => {
                btn.classList.remove('active');
                if (viewName === 'snapshot' && index === 0) btn.classList.add('active');
                if (viewName === 'editor' && index === 1) btn.classList.add('active');
                if (viewName === 'preview' && index === 2) btn.classList.add('active');
            });
        }
    };

    // Expose App to global scope for HTML event handlers (e.g., onclick="App.triggerAI()")
    window.App = App;
    window.SoloClinic = App; // Alias
    window.MobileApp = MobileApp; // Expose Mobile Controller

    // --- Boot the System ---
    document.addEventListener("DOMContentLoaded", () => {
        App.init();
    });

})();