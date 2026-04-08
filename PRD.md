# Product Requirements Document
## Thai Fuel Calc — Web Application

**Version:** 1.0  
**Date:** 2026-04-07  
**Status:** Draft

---

## 1. Overview

### 1.1 Product Summary
Thai Fuel Calc is a web application that helps drivers in Thailand check current fuel prices, estimate trip fuel costs, and track their fuel expenses over time.

### 1.2 Problem Statement
Drivers in Thailand face fluctuating fuel prices across multiple fuel types (gasohol, diesel, E85, etc.). Without a unified tool, users must manually look up prices and calculate trip costs using spreadsheets or mental math — leading to poor budget planning and uninformed fuel-type choices.

### 1.3 Goal
Provide a fast, simple, single-page web app that surfaces live Thai fuel prices and gives drivers an accurate cost estimate for any trip in seconds.

---

## 2. Target Users

| Persona | Description |
|---|---|
| Daily commuter | Wants to know which fuel is cheapest today |
| Road tripper | Planning a long-distance trip and needs a cost estimate upfront |
| Small fleet owner | Tracks multiple trips and monitors cumulative fuel spend |
| Cost-conscious driver | Compares fuel types to optimize vehicle running cost |

---

## 3. Scope

### 3.1 In Scope (v1.0)
- Display current Thai fuel prices (6 fuel types)
- Calculate fuel cost for a given trip (distance + vehicle efficiency)
- Add calculated trips to a session expense list
- View cumulative expense total and remove individual trips
- Contact/information page

### 3.2 Out of Scope (v1.0)
- User authentication / accounts
- Persistent storage (expenses are session-only, reset on page refresh)
- Real-time price feed integration (prices are mock/static)
- Map or route calculation
- Mobile native app
- Multi-language support (Thai language UI)

---

## 4. Features & Requirements

### 4.1 Dashboard — Fuel Price Display

**Purpose:** Show the latest prices for all 6 Thai fuel types at a glance.

| # | Requirement |
|---|---|
| F1.1 | Display all 6 fuel types: Gasohol 95 (E10), Gasohol 91, Gasohol E20, Gasohol E85, Diesel B7, Premium Diesel B7 |
| F1.2 | Show price in Thai Baht (฿) per litre for each fuel type |
| F1.3 | Highlight the cheapest fuel type with a "Cheapest" badge |
| F1.4 | Show last-updated timestamp and data source attribution |
| F1.5 | Provide a Refresh button to re-fetch prices from the API |
| F1.6 | Display skeleton loading state while data is being fetched |
| F1.7 | Display a user-friendly error state with retry option if the API is unreachable |
| F1.8 | Each fuel card must show: name, short description, color indicator, and price |

**Data source:** `GET /api/fuel-prices` (Express backend, currently mock data from PTT/EPPO Thailand)

---

### 4.2 Fuel Calculator — Trip Cost Estimator

**Purpose:** Allow users to calculate the fuel cost of a trip based on distance and vehicle fuel efficiency.

| # | Requirement |
|---|---|
| F2.1 | Input fields: Start Point (text, optional), Destination (text, optional), Distance (km, required), Fuel Type (dropdown, required), Fuel Efficiency (km/L, required) |
| F2.2 | Fuel type dropdown must be populated from live prices (same data as Dashboard) |
| F2.3 | Calculate button must be disabled until required fields are filled with valid positive numbers |
| F2.4 | Calculation formula: `litres = distance / efficiency`, `cost = litres × price per litre` |
| F2.5 | Result panel must show: distance, fuel efficiency, fuel type, litres used, price per litre, and total cost (฿ THB) |
| F2.6 | Result panel must reset when any input field changes |
| F2.7 | "Add to Expenses" button must only be enabled after a calculation result exists |
| F2.8 | On "Add to Expenses", show a success toast for 2.5 seconds |
| F2.9 | Auto-select the first available fuel type when prices load |

---

### 4.3 Total Expenses — Trip History

**Purpose:** Show all trips added from the calculator and their cumulative cost.

| # | Requirement |
|---|---|
| F3.1 | Display a grand total card showing the sum of all trip costs |
| F3.2 | Show trip count (e.g., "3 trips recorded") |
| F3.3 | List all trips in reverse-chronological order (newest first) |
| F3.4 | Each trip card must show: trip number, start point → destination, fuel type, distance (km), litres used, and total cost |
| F3.5 | Each trip must have a Remove button to delete it from the list |
| F3.6 | Provide a "Clear all" action to remove all trips at once |
| F3.7 | Show an empty state with instructions when no trips are recorded |
| F3.8 | Expense count must be visible in the navigation bar (badge) |

**Note:** Expenses are stored in React state only — they do not persist across page refreshes.

---

### 4.4 Contact Page

**Purpose:** Provide contact information and office hours for the Thai Fuel Calc team.

| # | Requirement |
|---|---|
| F4.1 | Display contact details: email, phone, LINE Official, and office address |
| F4.2 | Display a weekly office hours schedule |
| F4.3 | Show a location/map placeholder (Bangkok, Sukhumvit Road) |
| F4.4 | Show social media links: Facebook, Twitter/X, Instagram, YouTube |

---

## 5. Navigation

- Navigation is state-driven (no URL routing) via a persistent top navbar
- Four sections: Dashboard, Calculate Fuel, Total Expenses, Contact
- Active section is highlighted in the navbar
- Expense count badge appears on the Total Expenses nav item when trips exist

---

## 6. API

### Backend: Express.js on port 3001

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Health check — returns service status |
| `/api/fuel-prices` | GET | Returns 6 fuel types with id, name, shortName, price (THB/L), color (hex), description, lastUpdated, currency, unit, source |

Vite dev server proxies `/api/*` → `http://localhost:3001` so frontend uses relative paths.

---

## 7. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Dashboard prices must appear within 500ms on a local network |
| Responsiveness | All pages must be usable on screens ≥ 375px wide |
| Accessibility | Form fields must have associated labels; color is not the only indicator of fuel type |
| Browser support | Latest Chrome, Firefox, Safari, Edge |
| Deployment | Frontend deployable to Vercel via GitHub Actions CI/CD |

---

## 8. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, CSS Modules |
| Backend | Node.js, Express.js |
| Styling | CSS custom properties, Inter + Sarabun fonts |
| Dev tooling | Concurrently (run both services), GitHub Actions |
| Deployment | Vercel (frontend) |

---

## 9. Future Considerations (Post v1.0)

| Feature | Notes |
|---|---|
| Real price API | Integrate live PTT/EPPO price feed instead of mock data |
| Persistence | Save expenses to localStorage or a backend database |
| User accounts | Enable personal history and cross-device access |
| Route integration | Auto-fill distance from Google Maps / Longdo Map |
| Thai language UI | Add i18n support (English / Thai toggle) |
| Price history chart | Show price trends over time per fuel type |
| Vehicle profiles | Save vehicle fuel efficiency for repeat calculations |
| Export | Allow users to export expense history as CSV |

---

## 10. Fuel Types Reference

| ID | Name | Price (฿/L) | Description |
|---|---|---|---|
| gasohol95 | Gasohol 95 (E10) | 39.66 | Premium unleaded with 10% ethanol |
| gasohol91 | Gasohol 91 | 36.42 | Standard unleaded with ethanol blend |
| e20 | Gasohol E20 | 35.94 | High ethanol blend (20% ethanol) |
| e85 | Gasohol E85 | 22.94 | Flex fuel — 85% ethanol |
| diesel | Diesel B7 | 33.44 | Standard diesel with 7% biodiesel |
| premDiesel | Premium Diesel B7 | 40.14 | High-performance diesel with additives |

*Prices above are mock data based on PTT/EPPO Thailand as of v1.0.*
