# IntelliCarrier — Project Progress

**Last Updated:** 2026-02-19
**Live URL:** https://intellicarrier-app.netlify.app
**GitHub:** https://github.com/sanjay-madala/IntelliCarrier (master branch)

---

## Modules Completed

| Module | Status | Files | Description |
|--------|--------|-------|-------------|
| **Shipments** | Done | 12 files | Full shipment lifecycle: create, edit, dispatch, view. Includes FO channel flow (Excel/PDF/TMS/Manual/Email/LINE), bulk draft-to-shipment, truck/employee search modals, stage swap, fleet suggest. 7 KPI tiles, 22 routes, 11 yards. |
| **Report-In** | Done | 7 files | Driver report-in after delivery: Vehicle Info, Stages (with miles validation), Expenses, Fuel, Parking, Review & Close. 5-status lifecycle (awaiting → in_progress → pending_review → completed/rejected). |
| **Cash Advance** | Done | 4 files | LiveTicker dashboard with Fuel, Parking, and Expense managers. |
| **Settlement & Billing** | Done | 8 files | Awaiting tab (auto-populated from Report-In approval), Sales Orders, Settlement Reports with detail view. LPG/NGV-specific columns. |
| **Freight Order** (archived) | Merged into Shipments | 6 files | Channel selection → Upload/Manual/TMS → Draft Review flow merged directly into Shipments "New Shipment" button. FO module files remain but are not routed. |

---

## Key Milestones

### 1. FO → Shipment Merge
- Eliminated standalone Freight Order screen
- "New Shipment" button opens FO channel modal (BU → Product → Channel)
- On confirmation, directly creates shipment with pre-populated data
- All 6 intake channels working: Excel Upload, PDF/OCR, TMS API, Email RPA, LINE Message, Manual Entry

### 2. LL Review Comments — Round 1
- 103 review comments mapped from `LL_comments.xlsx`
- Results: 82 YES, 12 PARTIAL (fixed), 6 NO (fixed), 3 N/A
- Key fixes: stages auto-populate from route master, dynamic stage builder, NGV/Fuel/SCA product-specific fields

### 3. LL Review Comments — Round 2
- Additional feedback from `LL_comments_2.xlsx` and `Freight_Order_LL.xlsx`
- Fixes: AA18 auto-populate, T35 truck type removal, T19 route search, manual entry for all products

### 4. Report-In Full Audit (Latest)
- Functional + data flow validated against SPEC_04_ReportIn.md and HTML reference spec
- 7 gaps identified and fixed:
  1. Driver/Driver ID fields made readonly per spec
  2. Miles config values corrected: 001→50km, 002→10km, 003→15%
  3. Rule 003 validation changed from absolute km to percentage calculation
  4. ConfigRow display values updated to match actual config
  5. Awaiting settlement rows now include: vehicleType, vehicleAge, custDoc, docDate, wbs, site
  6. soldTo/soldToName correctly maps to shipment customer (not stage destination)
  7. milesConfig in mockData updated to match HTML spec

### 5. Cross-Module Data Flow Verified
- Shipment → Report-In → Settlement pipeline working end-to-end
- Stage saves dispatch UPDATE_STAGE + UPDATE_TRUCK_MILES
- Report-In approval generates awaiting settlement rows with all required fields
- Live shipment lookup (not stale snapshots) ensures real-time data

### 6. Cross-Screen Duplication Check
- Confirmed Report-In and Shipment screens are visually distinct
- No duplicate screens found
- Minor shared patterns: search filter logic (7 lines), sticky footer layout, input class strings

---

## Architecture

- **Framework:** React 18 + Vite
- **State Management:** React Context + useReducer (AppContext)
- **i18n:** EN/TH via LanguageContext with translations.js
- **Styling:** Tailwind CSS with custom theme tokens
- **Navigation:** 4 visible tabs — Shipments, Report-In, Cash Advance, Settlement
- **Build:** Vite (79 modules, ~662KB)
- **Deploy:** Netlify (auto from dist/)

---

## Commit History

| Commit | Description |
|--------|-------------|
| `c9f098a` | Fix Report-In module: 7 audit gaps resolved against functional spec |
| `3691e5e` | Fix all NO and PARTIAL LL review items: 12 gaps resolved |
| `f3700a1` | Incorporate LL review comments from LL_comments_2.xlsx and Freight_Order_LL.xlsx |
| `2784a66` | Close shipment spec gaps: 7 KPI tiles, Truck Type field, 22 routes, 11 yards |
| `f50de84` | Support bulk draft-to-shipment creation for Excel Upload and TMS import |
| `f9996a7` | Enable LiveTicker + Cash Advance module (4th tab) |
| `009e1b5` | Add missing LPG/NGV settlement columns per spec §7.8 |
| `3a27ebc` | Close spec gaps: Order Summary, BU/Source filters, Container fields, Fuel compartments |
| `89105a1` | Fix remaining LL_comments gaps: AA18 auto-populate, T35 remove truckType, T19 route search |
| `ea9e1bf` | Add Manual entry channel to all Company + Product combinations |
| `08e3da7` | Auto-populate stages from route master when route is selected |
| `31ea36d` | Replace fixed 4-stage custom route with dynamic stage builder |
| `6888e98` | Fix variable shadowing and add safety check in ShipmentForm |
| `1e6e72b` | Fix blank screen when clicking shipment: move DRIVER_ROLES after form state |
| `f710069` | Fix LL_comments.xlsx feedback: stages, header, vehicle, drivers, NGV, fuel, SCA |

---

## Known Minor Items (Cosmetic, Non-Blocking)

- [ ] ReportIn action button says "Open" instead of "Report-In"
- [ ] ExpenseTab receipt checkbox is display-only (not editable toggle)
- [ ] CA status card shows receipt count instead of "Within/Over Budget" text
- [ ] Search filter logic duplicated between ReportInList and ShipmentList (could extract to shared utility)
- [ ] No auto-navigation to Settlement module after Report-In approval
- [ ] ReportIn status badge labels are hardcoded English (not using `t()` for i18n)
- [ ] No breadcrumb in ReportIn list view (spec shows: Home / Shipments / Report-In)
