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
| `--fedex-orange`       | `#ff6600` | CTAs, wordmark "Ex", skip-link, footer top border |
| `--fedex-orange-dark`  | `#e05504` | Orange hover state                     |
| `--background-color`   | `#ffffff` | Page background                        |
| `--light-color`        | `#f8f8f8` | Footer background, light sections      |
| `--dark-color`         | `#505050` | Secondary text                         |
| `--text-color`         | `#131313` | Primary body text                      |

---

## Header / Navigation

### Where to author

Edit the document at **`/fragments/nav`**.  
A page can load a different nav fragment by adding a `nav` row to its Metadata table (see [Page-level overrides](#page-level-overrides)).

### Document structure — three sections separated by `---`

#### Section 1 — Brand (logo / home link)

Write a single link to the homepage. With a logo image uploaded to the DAM:

```
[![FedEx logo](…dam image…)](/)
```

Or as a plain text link:

```
[FedEx](/)
```

> **Rule:** keep this section to exactly one paragraph / one link. If the link has **no image** (or the image fails to load), the header automatically renders a Fed/Ex text wordmark in brand colors — so the text-only form is always safe.

---

#### Section 2 — Navigation items

Write a single **bulleted list**. Top-level items with a nested list become **dropdowns** (like "Shipping"). Top-level items that are plain links navigate directly (like "Locations").

```
- Shipping
  - [Create a Shipment](/en-us/shipping/create.html)
  - [Shipping Rates & Delivery Times](/en-us/online/rating.html)
  - [Schedule & Manage Pickups](/en-us/shipping/schedule-manage-pickups.html)
  - **[All Shipping Services](/en-us/shipping.html)**
- Tracking
  - [Advanced Shipment Tracking](/en-us/tracking/advanced.html)
  - [Manage Your Delivery](/en-us/delivery-manager.html)
  - **[All Tracking Services](/en-us/tracking.html)**
- Design & Print
  - [Explore Print, Products & Design](/en-us/printing.html)
  - [Browse Services](/en-us/printing/services.html)
- [Locations](/en-us/locations.html)
- Support
  - [Customer Support](/en-us/customer-support.html)
  - [Small Business Center](/en-us/small-business.html)
```

> **Rules:**
> - Keep top-level items to **5 or fewer** — the bar does not wrap gracefully.
> - Keep dropdown sub-items to **8 or fewer**.
> - A top-level item that has a nested list must **not** have its own link (`- Shipping` not `- [Shipping](…)`) — it becomes a toggle **button**, so a link there would never navigate.
> - A **bold** dropdown link renders as the FedEx call-to-action row: uppercase, bold, blue (like "ALL SHIPPING SERVICES" on fedex.com). Put it last in its dropdown.

---

#### Section 3 — Tools (right-hand utilities)

Short links displayed at the right edge of the bar. Author them as a list; an item with a nested list becomes a dropdown (this is how the account menu works). An icon next to the text is optional — use the `:icon-name:` inline syntax.

```
- Sign Up or Log In
  - **[Sign Up / Log In](/en-us/secure-login.html)**
  - [My profile](/en-us/profile.html)
  - [View & pay bill](/en-us/billing.html)
  - [Open an account](/en-us/open-account.html) to save on shipping costs and more!
- :search: [Search](/en-us/search.html)
```

> **Rules:**
> - A tool with an icon renders **icon-only**; its link text becomes the accessible label (screen readers still announce "Search").
> - A link whose text contains **Sign In / Sign Up / Log In** is tagged as the sign-in tool. Like fedex.com, its dropdown shows a bold **Sign Up / Log In** CTA first, plain links after, and any non-link sentence as a light promotional note.
> - The account dropdown opens below the bar and closes on Escape or an outside click, like the main nav dropdowns.
> - Icons must be SVG files placed in the `/icons/` folder (e.g. `/icons/search.svg`).
> - Keep tools to **3 items or fewer**.
> - Plain paragraph links (no list) are still supported and render as before.

---

### How the Shipping dropdown works

1. Any Section 2 list item that contains a nested list is rebuilt as a real `<button aria-expanded="false" aria-controls="…">` plus a panel (`.nav-submenu`).
2. On **desktop (≥ 1024px)** the dropdown opens on hover (mouse) and on click / Enter / Space. The open trigger inverts to a white background with purple text; the panel is a 240px white card with the fedex.com offset shadow.
3. On **mobile (< 1024px)** the hamburger slides a drawer in from the right, below the 60px bar. Tapping an item expands it in place (accordion): the open trigger inverts to purple with white text. Page scrolling is locked while the drawer is open.
4. Pressing **Escape** closes open dropdowns first, then the drawer. Clicking outside the nav or moving focus out of it also closes dropdowns.

---

## Footer

### Where to author

Edit the document at **`/fragments/footer`**.  
A page can override it with a `footer` row in its Metadata table.

### Document structure — two sections separated by `---`

#### Section 1 — Link columns (`Columns` block, four cells)

Use a **Columns** block with exactly **four cells** in this order:

| # | Cell heading | What to put in it |
|---|---|---|
| 1 | `Our Company` | Two bulleted lists (5 links, then 4 links) |
| 2 | `More From FedEx` | One bulleted list |
| 3 | `Language` | Country link paragraph + language options list |
| 4 | `Follow FedEx` | Social platform links (text auto-replaced with icons) |

> The JS extracts the **Follow FedEx** column into a separate social strip above the legal bar. The **Language** column is transformed into a country-selector + language dropdown. The **Our Company** two-list layout renders as a 2-column sub-grid on desktop.

---

**Column 1 — Our Company** (two `<ul>` lists in one cell):

| Columns | | | |
|---|---|---|---|
| ## Our Company<br><br>- [About FedEx](https://www.fedex.com/en-us/about.html)<br>- [Our Portfolio](https://www.fedex.com/en-us/about/company-structure.html)<br>- [Investor Relations](https://investors.fedex.com/home/default.aspx)<br>- [Careers](https://careers.fedex.com/fedex/)<br>- [Transportation Contracting Opportunities](https://www.contracting.fedex.com/)<br><br>- [FedEx Blog](https://www.fedex.com/en-us/blog.html)<br>- [Corporate Responsibility](https://www.fedex.com/en-us/about/corporate-social-responsibility.html)<br>- [Newsroom](https://newsroom.fedex.com/)<br>- [Contact Us](https://www.fedex.com/en-us/customer-support.html) | ## More From FedEx<br><br>- [FedEx Compatible](https://www.fedex.com/en-us/compatible.html)<br>- [FedEx Developer Portal](https://developer.fedex.com/api/en-us/home.html)<br>- [FedEx Logistics](https://www.fedex.com/en-us/logistics.html) | ## Language<br><br>[United States](https://www.fedex.com/?location=home)<br><br>- [English](https://www.fedex.com/en-us/home.html)<br>- [Español](https://www.fedex.com/es-us/home.html) | ## Follow FedEx<br><br>- [Newsletter](https://www.fedex.com/en-us/email.html)<br>- [Facebook](https://www.facebook.com/FedEx/)<br>- [Twitter](https://twitter.com/fedex)<br>- [Instagram](https://www.instagram.com/fedex/)<br>- [LinkedIn](https://www.linkedin.com/company/fedex)<br>- [YouTube](https://www.youtube.com/user/fedex/custom?sub_confirmation=1)<br>- [Pinterest](https://www.pinterest.com/FedEx/) |

---

**Language column rules:**
- The **paragraph** must contain exactly one link — the country name (e.g. "United States"). The JS prepends a globe icon automatically.
- The **bulleted list** below it is the language dropdown options.
- To mark the active language, add `aria-current="true"` to its link in the rich-text editor. If none is marked, the first list item is selected.
- The heading must be exactly `Language`.

**Follow FedEx column rules:**
- The heading must be exactly `Follow FedEx` — the JS uses `/follow fedex/i` to locate and extract this column.
- Link text is matched to icon SVGs by keyword (case-insensitive). Supported keywords: `newsletter`, `email`, `facebook`, `twitter`, `instagram`, `linkedin`, `youtube`, `pinterest`.
- Do not rename the links to something unrecognisable — the icon mapping will fail silently and the link text will show instead.

**General column rules:**
- Use exactly **`## Heading`** (H2) for each column label.
- Column headings must not be renamed from the values the JS relies on (`Follow FedEx`, `Language`).
- On **mobile**, each column collapses into an accordion; H2 becomes the toggle button label.

---

#### Section 2 — Legal bar

A copyright paragraph followed by a bulleted list of policy links. Always the **last section** of the footer fragment.

```
© FedEx 1995–2026

- [Site Map](https://www.fedex.com/en-us/sitemap.html)
- [Terms of Use](https://www.fedex.com/en-us/terms-of-use.html)
- [Privacy & Security](https://www.fedex.com/en-us/trust-center.html)
- [Ad Choices](https://www.fedex.com/en-us/trust-center/privacy.html#section7)
```

> **Rules:**
> - Copyright must be a plain `<p>` (not a heading or list item). The JS adds `©` if missing.
> - Legal links render horizontally with `|` separators; keep to **4–6 items**.
> - Do **not** add a Columns block here — the CSS handles flex layout automatically.
> - This section always renders as a full-width purple bar.

---

## Page-level overrides

To load a different nav or footer fragment on a specific page, add a **Metadata** block to that page:

| Metadata | |
|---|---|
| nav | /de/fragments/nav |
| footer | /de/fragments/footer |

This is useful for localized pages, campaign landing pages, or microsites that need a simplified header. The same mechanism points test pages at draft fragments (e.g. `nav` → `/drafts/fragments/nav`).

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

## Dev fixtures & test content

The CMS documents at `/fragments/nav` and `/fragments/footer` are published — the header and footer work against the proxy with no fixtures. The `drafts/` folder holds test content that **is** deployed (useful for PR demo links):

| File | Path served | Purpose |
|---|---|---|
| `drafts/fragments/nav.plain.html` | `/drafts/fragments/nav` | Full FedEx nav (5 dropdowns, CTA rows, wordmark fallback) |
| `drafts/header-test.html` | `/drafts/header-test` | Page wired to the draft nav via its `nav` metadata |
| `drafts/home.plain.html` | `/drafts/home` | Sample homepage with all content blocks |

`footer.plain.html` at the repo root is a legacy local fixture excluded via `.hlxignore`; it can be deleted now that the CMS footer document is published.
