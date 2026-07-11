# FedEx EDS Author Guide

This guide shows content authors exactly how to structure pages, the header navigation, and the footer in **da.live** (Document Authoring). The JS decorators in `blocks/header/` and `blocks/footer/` read the structures described here.

---

## Table of Contents

1. [Brand colors & CSS variables](#brand-colors)
2. [Header / Navigation (`/nav`)](#header--navigation)
3. [Footer (`/footer`)](#footer)
4. [Page-level overrides](#page-level-overrides)
5. [Quick reference — da.live table syntax](#quick-reference--dalive-table-syntax)

---

## Brand colors

The following CSS custom properties are declared in `styles/styles.css` and used throughout every block:

| Variable               | Value     | Usage                                  |
| ---------------------- | --------- | -------------------------------------- |
| `--fedex-purple`       | `#4d148c` | Header background, primary interactive |
| `--fedex-purple-dark`  | `#330066` | Hover / focus ring on dark backgrounds |
| `--fedex-orange`       | `#ff6600` | CTAs, active-item underline, footer top border |
| `--fedex-orange-dark`  | `#e05504` | Orange hover state                     |
| `--background-color`   | `#ffffff` | Page background                        |
| `--light-color`        | `#f8f8f8` | Footer background, light sections      |
| `--dark-color`         | `#505050` | Secondary text                         |
| `--text-color`         | `#131313` | Primary body text                      |

---

## Header / Navigation

### Where to author

Edit the document at **`/nav`** (site root).  
A page can load a different nav fragment by adding a `nav` row to its Metadata table (see [Page-level overrides](#page-level-overrides)).

### Document structure — three sections separated by `---`

#### Section 1 — Brand (logo / home link)

Write a single **bold link**. The link text can be the site name or replaced by an image.

```
**[FedEx](/)**
```

Or with a logo image uploaded to the DAM:

```
[![FedEx logo](/icons/fedex-logo.svg) FedEx](/)
```

> **Rule:** keep this section to exactly one paragraph / one link. The JS strips the button class and renders it as the logo mark.

---

#### Section 2 — Navigation items

Write a single **bulleted list**. Top-level items with a nested list become **dropdowns** (like "Shipping"). Top-level items that are plain links navigate directly (like "Locations").

```
- Shipping
  - [Create a Shipment](/en-us/shipping/create.html)
  - [Calculate Shipping Rates](/en-us/online/rating.html)
  - [FedEx One Rate](/en-us/shipping/one-rate.html)
  - [Explore Shipping Services](/en-us/service-guide.html)
- Tracking
  - [Track a Shipment](/en-us/tracking.html)
  - [FedEx Delivery Manager](/en-us/delivery-manager.html)
  - [Advanced Shipment Tracking](/en-us/tracking/advanced.html)
- Design & Print
  - [Explore Printing Services](/en-us/printing.html)
  - [Posters & Signs](/en-us/printing/posters.html)
  - [Document Printing](/en-us/printing/documents.html)
- [Locations](/en-us/locations.html)
- Support
  - [Customer Support](/en-us/customer-support.html)
  - [Small Business Center](/en-us/small-business.html)
  - [Service Alerts](/en-us/service-alerts.html)
```

> **Rules:**
> - Keep top-level items to **5 or fewer** — the bar does not wrap gracefully.
> - Keep dropdown sub-items to **6 or fewer**.
> - A top-level item that has a nested list must **not** have its own link (`- Shipping` not `- [Shipping](…)`). The click handler opens the dropdown.

---

#### Section 3 — Tools (right-hand utilities)

Short links displayed in the top-right area of the header. An icon preceding the text is optional — use the `:icon-name:` inline syntax.

```
:icon-search: [Search](/en-us/search.html)
[Sign In](/en-us/secure-login.html)
```

> **Rules:**
> - The text **"Sign In"** (or "Log In") is automatically decorated as a ghost button by the JS.
> - Icons must be SVG files placed in the `/icons/` folder (e.g. `/icons/search.svg`).
> - Keep tools to **3 items or fewer**.

---

### How the Shipping dropdown works

1. Any Section 2 list item that contains a nested `<ul>` receives the `nav-drop` CSS class.
2. On **desktop** a click toggles `aria-expanded="true"` on that `<li>`, which CSS uses to show the dropdown panel with a slide-down animation.
3. On **mobile** all nav sections are hidden behind the hamburger menu; clicking a `nav-drop` item expands inline.
4. Pressing **Escape** collapses open dropdowns. Moving focus outside the nav also collapses them.

---

## Footer

### Where to author

Edit the document at **`/footer`** (site root).  
A page can override it with a `footer` row in its Metadata table.

### Document structure — two sections separated by `---`

#### Section 1 — Link columns

Use a **Columns** block. Each column cell contains a Heading 2 and a bulleted list of links.

**da.live table syntax:**

| Columns | | |
|---|---|---|
| ## Our Company<br>- [About FedEx](/en-us/about.html)<br>- [Careers](/en-us/careers.html)<br>- [Investor Relations](/en-us/investor-relations.html)<br>- [FedEx Newsroom](/en-us/newsroom.html)<br>- [Corporate Responsibility](/en-us/sustainability.html) | ## More From FedEx<br>- [FedEx Compatible](/en-us/compatible.html)<br>- [Developer Portal](/en-us/developer.html)<br>- [FedEx Logistics](/en-us/logistics.html)<br>- [FedEx Cross Border](/en-us/cross-border.html) | ## Follow FedEx<br>- [Facebook](https://www.facebook.com/FedEx)<br>- [X](https://x.com/FedEx)<br>- [Instagram](https://www.instagram.com/fedex)<br>- [LinkedIn](https://www.linkedin.com/company/fedex)<br>- [YouTube](https://www.youtube.com/fedex) |

> **Rules:**
> - Use exactly **`## Heading`** (H2) as the column label — the CSS renders it as small uppercase text.
> - Keep column count to **2–4**. The grid adjusts: 1 column on mobile → 2 on tablet → 3–4 on desktop.
> - On **mobile**, each column collapses into an accordion. The H2 text becomes the toggle button label.

---

#### Section 2 — Legal bar

A copyright paragraph followed by a bulleted list of policy links. Always the **last section** of the footer fragment.

```
© FedEx 1995–2026

- [Site Map](/en-us/site-map.html)
- [Terms of Use](/en-us/terms-of-use.html)
- [Privacy & Security](/en-us/privacy.html)
- [Ad Choices](/en-us/ad-choices.html)
```

> **Rules:**
> - Copyright must be in a `<p>` (plain paragraph, not a heading).
> - Legal links render horizontally; keep them to **4–6 items**.
> - Do **not** add a Columns block here — the CSS flexes the paragraph and list automatically.

---

## Page-level overrides

To load a different nav or footer fragment on a specific page, add a **Metadata** block to that page:

| Metadata | |
|---|---|
| nav | /de/nav |
| footer | /de/footer |

This is useful for localized pages, campaign landing pages, or microsites that need a simplified header.

---

## Quick reference — da.live table syntax

### Creating a block

In da.live, tables become blocks. The first cell of the header row is the **block name**:

| Header Block | |
|---|---|
| (row 1 data) | (row 2 data) |

The block name maps to the folder under `blocks/`. Block name variants like `Columns (3-up)` produce CSS classes `columns columns-3-up`.

### Horizontal rule (`---`)

Typing `---` on its own line in a da.live document creates a **section break**. The header and footer each rely on these breaks to separate their functional regions.

### Icons

Inline icons use the syntax `:icon-name:` — e.g. `:icon-search:` renders the file `/icons/search.svg`. Icons must be square SVGs committed to the `/icons/` folder.

---

## Dev-only fixtures

While CMS content is being built, local HTML fixtures serve the same paths:

| File | Path served |
|---|---|
| `nav.plain.html` | `/nav` |
| `footer.plain.html` | `/footer` |

These files are listed in `.hlxignore` and are **not** deployed. Delete them once the CMS documents are published and previewed.
