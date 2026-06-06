# Lofty Furnishing Website Design Document

This document serves as the official written log detailing the structure, styling, layouts, and logic of the remade Lofty Furnishing website.

---

## 1. Directory Structure

The project root is structured as a static, vanilla web application designed for Cloudflare Pages hosting:

```
c:\Dev\LoftyWebsite/
│
├── index.html            # Landing / Homepage with Crew Application
├── shop.html             # Product Catalog
├── booking.html          # Interactive Calendar Selection & Details Form
├── success.html          # Post-Checkout Receipt Screen
├── about.html            # About/History page
├── faq.html              # FAQs & Step-by-Step Installation Guide
├── terms.html            # Terms & Conditions
├── privacy.html          # Privacy Policy
│
├── styles/
│   └── main.css          # Global Stylesheet (Variables, Reset, Layouts, Media Queries)
│
└── scripts/
    ├── main.js           # Homepage hiring form logic
    └── booking.js        # Interactive calendar rendering and order summary
```

---

## 2. Page Directory & Hierarchy

### A. Core Pages

| Filename | Purpose | Layout Details |
| :--- | :--- | :--- |
| `index.html` | Brand home, marketing, ambassador crew applications. | Large header logo, hero banner with clear call-to-actions, and interactive hiring grid form at the bottom. |
| `shop.html` | Loft bed listings & roommate bundle promotions. | Wide-banner card on top for Roommate Bundle, followed by a responsive grid of bed cards. |
| `booking.html` | Checkout, scheduling calendar, & student dorm details. | Split layout: Left column contains step-by-step forms (calendar picker, text inputs, Stripe button). Right column contains a sticky checkout summary. |
| `success.html` | Payment verification and receipt details display. | Reads mock checkout summary details from the browser's `localStorage` and presents a confirmation card. |

### B. Informational Pages
* **`about.html`:** Clean article layout detailing the business history, white-glove setup process, and sustainable cedar craft description.
* **`faq.html`:** Two sections: General support questions and the official 7-step move-in/installation walkthrough guide.
* **`terms.html` & `privacy.html`:** Structured legal texts (updated for 2025/2026 timelines) describing Penn State campus delivery rules and Stripe handling.

---

## 3. Styling & Color Design System

All elements use unified tokens defined in `styles/main.css`:

### CSS Variables:
* **Primary Fonts:** Headings use `Merriweather` (serif); Body copy uses `Inter` (sans-serif).
* **Colors (HSL-based):**
  * `var(--primary-navy)`: `hsl(210, 47%, 23%)` (Primary brand color)
  * `var(--accent-gold)`: `hsl(36, 60%, 55%)` (Accent highlight color for CTAs & prices)
  * `var(--bg-light)`: `hsl(210, 20%, 98%)` (Body background color)
* **Shadows:** Standardized elevations (`--shadow-sm`, `--shadow-md`, `--shadow-lg`) for card hover transitions.

### Media Query Breakpoints:
* **Desktop / Large Screens:** Multi-column flexbox and grid layouts. Product grids render in standard column lists.
* **Tablet / Small Desktop (`max-width: 992px`):** Product grid forced to a single column (`grid-template-columns: 1fr`) to display beds vertically.
* **Mobile (`max-width: 768px`):** Stacks header nav menu vertically, resizes hero font sizes, and adapts input forms to single-column blocks.

---

## 4. Product Catalog Specifications

* **All Individual Beds:** Priced at **$250.00**
  * *Espresso:* Hand-stained dark midnight walnut finish.
  * *English Chestnut:* Warm stained finish highlighting natural grains.
  * *Clean White:* Crisp modern white painted finish.
* **Roommate Bundle:** Priced at **$450.00** (Provides a bundle savings of $50 compared to two individual beds).
* **Out of Scope:** Natural Cedar has been retired from checkout/shop listings.
* **Placeholders:** Images are set to square aspect-ratio blocks (`aspect-ratio: 1`) on shop cards.

---

## 5. JavaScript Interactions

* **`scripts/main.js`:** Listens to the ambassador crew form, performs basic email and input validation, and displays a success notification block upon completion.
* **`scripts/booking.js`:**
  1. Parses URL queries (`?product=`) to identify the chosen bed style.
  2. Renders a grid calendar representing August 2026.
  3. Limits selectable dates to the move-in window: **August 15th to August 30th**.
  4. Queries slot availability (mocked, but easily extendable to Firebase) and disables full slots.
  5. Computes totals dynamically, updating the sticky sidebar receipt panel.
  6. Disables payment redirects until all mandatory dorm and contact inputs are complete.
