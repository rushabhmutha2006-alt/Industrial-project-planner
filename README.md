# Industrial Visit Planner

A modern full-stack web application designed for colleges, universities, faculty coordinators, and engineering students to discover suitable industries, plan curriculum-aligned visit schedules with Google Gemini AI, manage student registrations and quotas, calculate travel budgets, track administrative approvals, and coordinate fleet transportation.

---

## 🌟 Core Features

### 1. Multi-Role Access Control (RBAC)
- **Administrator (Dean / Principal):** Review and sanction visit proposals, audit departmental budgets, manage host industry listings, and download college-wide compliance reports.
- **Faculty Coordinator:** Design visit schedules, generate academic itineraries with Gemini AI, balance transportation budgets, track student capacity and waitlists, record spot attendance, and submit formal proposals.
- **Student Portal:** Browse open industrial visits, register with instant seat allocation, view waitlist position, inspect minute-by-minute itineraries, and view boarding passes.
- **Instant Role Switcher:** Segmented persona pills in the header allow testing as Faculty (`Prof. Rajesh Sharma`), Student (`Ananya Verma`), or Admin (`Dr. Arvind Kulkarni`) with one click.

### 2. AI-Powered Visit Planner (Google Gemini 3.8 Flash)
- Enter college name, department, semester, budget ceiling, preferred city, transit mode, and learning objectives.
- Synthesizes:
  - Recommended host organizations and accredited testbeds
  - Detailed time-slot itinerary from campus assembly to return
  - Curriculum learning outcomes mapped to syllabus units
  - Itemized financial estimates (transit, catering, passes, first-aid buffer)
  - Pre-visit and day-of-visit preparation checklists
  - Factory floor PPE protocols and safety standards
  - 10 targeted technical questions for industry engineers
  - Post-visit student dissertation report template & rubric
- **Save Directly to Active Visits:** Turn any AI proposal into a live departmental visit with one click.

### 3. Industry & Company Directory
- Searchable database of industries across Automotive & EV, IT & Cloud Computing, Robotics & Automation, Heavy Engineering, Semiconductor & Defense, and Biotechnology.
- Filters for sector, region/city, target engineering branch, and booking accessibility.
- Direct "Plan with AI" trigger to prefill parameters for any company.

### 4. Student Management & Spot Attendance
- Enforces batch capacities and automatic waitlist queues upon seat exhaustion.
- Dynamic attendance recording (`Present ✓` / `Absent ✕`).
- Batch student import via CSV parser and one-click CSV export.
- Print-ready formal attendance sheets.

### 5. Interactive Budget Calculator
- Live real-time calculations for transport hire, meals, lab passes, faculty DA, and contingency buffers.
- College institutional subsidy slider with automatic student payable breakdown.
- Estimated vs. actual post-tour expenditure audit reconciliation.

### 6. Administrative Approval Workflow
- Formal submission -> Dean review queue -> Approve or Reject with mandatory reasoning.
- Approved visits move to official company confirmation without premature locking.
- Full chronological audit log with reviewer timestamps.

### 7. Fleet & Calendar Logistics
- Interactive calendar highlighting scheduled tour dates by academic branch.
- Vehicle registration, driver phone contact, and pickup point student allocation.
- Simulated waypoint route preview.

### 8. Analytics & Reporting
- Department-wise visit distribution and monthly trend charts powered by Recharts.
- One-click CSV and print-optimized PDF dossiers for all visits, student registries, and financial audits.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Icons & Motion:** Lucide React, Motion
- **Analytics & Visualizations:** Recharts
- **Backend:** Express full-stack server mounted with Vite middleware
- **AI Integration:** `@google/genai` TypeScript SDK (`gemini-3.8-flash`)
- **Database Architecture:** Firebase Firestore Blueprint schema (`firebase-blueprint.json`) and role-hardened security rules (`firestore.rules`)
- **Local Persistence:** LocalStorage cache with seamless instant state hydration and demo reset capability

---

## 🚀 Running Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file based on `.env.example`:
   ```bash
   GEMINI_API_KEY="your_gemini_api_key"
   PORT=3000
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Production Build:**
   ```bash
   npm run build
   npm start
   ```

---

## 🔒 Security & Firestore Rules

The database structure in `firebase-blueprint.json` and security rules in `firestore.rules` enforce:
- Role verification using trusted documents (preventing client-side role spoofing).
- Students can only read visits and manage their own registrations.
- Only Faculty and Admins can create or modify visit schedules and budgets.
- Only Admins can approve or reject sanction requests.
- Immortality of key creation timestamps.
