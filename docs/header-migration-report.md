# FedEx Header — EDS Migration Analysis Report

Live-site analysis of `https://www.fedex.com/en-us/home.html` performed 2026-07-14 with browser automation (chrome-devtools MCP). Compared against the existing EDS implementation in `blocks/header/`.

Canonical menu data: [header-nav-data.json](header-nav-data.json).

## 1. Menu hierarchy

```
FedEx logo (88×25, links to /)
├── Shipping ▾
│   ├── Create a Shipment            (desktop → ship-manager/login.html)
│   ├── Create a Shipment            (mobile/tablet → shippingplus/en-us/guest)
│   ├── Shipping Rates & Delivery Times
│   ├── Schedule & Manage Pickups
│   ├── Packing & Shipping Supplies
│   ├── International Shipping Guide
│   ├── Freight
│   ├── Manage a Return
│   └── ALL SHIPPING SERVICES        [blue CTA]
├── Tracking ▾
│   ├── [Tracking-ID form: label "Tracking ID" + input + orange TRACK button]
│   ├── Advanced Shipment Tracking
│   ├── Manage Your Delivery
│   └── ALL TRACKING SERVICES        [blue CTA]
├── Design & Print ▾
│   ├── Explore Print, Products & Design
│   ├── Browse Services
│   └── VISIT NEW MARKETPLACE        [blue CTA]
├── Locations ▾
│   ├── Drop Off a Package
│   └── FIND A LOCATION              [blue CTA]
├── Support ▾
│   ├── Small Business Center
│   ├── FedEx Service Guide
│   ├── Account Management Tools
│   ├── Frequently Asked Questions
│   ├── File a Claim
│   ├── Billing & Invoicing
│   └── CUSTOMER SUPPORT             [blue CTA]
├── Sign Up or Log In ▾ (avatar icon)
│   ├── SIGN UP / LOG IN             [blue CTA]
│   ├── My profile / Administrative tools / Email preferences
│   ├── Address book / View & pay bill / Reporting
│   └── promo: "Open an account to save on shipping costs…"
└── Search 🔍 (expands inline in the bar)
```

Every dropdown's **last link is a blue uppercase CTA** — including single-CTA menus (Locations "Find a Location" is `fxg-link--blue`). Our fixture models this with `<strong>`; content parity is confirmed except where noted in §5.

## 2. Live DOM structure (source site)

```
header.fxg-header.fxg-header--sticky          position:fixed, z-index:11000, h:75px
└── nav.fxg-nav                               background #4d148c
    └── div.fxg-wrapper                       width:970px, centered
        ├── a.fxg-header__logo_wrapper        125×75, img 88×25 (logo.png, alt "FedEx Logo")
        ├── div.fxg-dropdown.fxg-global-nav   5 × div.fxg-dropdown__item
        │   ├── a.fxg-link.fxg-dropdown-js    trigger (href="#", aria-label "Open X Menu")
        │   └── div.fxg-dropdown__sub-menu    absolute panel, w:240px, top:75px
        └── div.fdx-utilityWrap
            ├── #global-login-wrapper         sign-in dropdown (same __item pattern)
            ├── .fxg-user-options__search-btn magnifier icon (46×30)
            ├── #fxg-mobile-menu-btn          hamburger (hamburger--slider), <1024px only
            └── div.fxg-search                expanding search form + "Top Searched" panel
```

Open state = class `fxg-dropdown__item--open` on the item; the **item itself gets `background:#fff`** and the trigger text turns `#4d148c`. Trigger behavior: click toggles (also opens on hover on desktop). Analytics on every trigger: `data-analytics="hdr|tab|{n}|{label}"` + `FDX.DTM.pushLinkInfo(this)`.

## 3. Measured styling specification

| Token | Live value | Our block (`blocks/header/header.css`) | Status |
|---|---|---|---|
| Bar height desktop | 75px | 75px | ✅ |
| Bar height mobile | ~63px | 60px | ⚠️ minor |
| Bar background | `#4d148c` | `#4d148c` | ✅ |
| Header position | `fixed`, z-index 11000 | `fixed`, z-index 1100 | ✅ (relative order fine) |
| Content width | 970px fixed | `max-width: 970px` | ✅ (after uncommitted fix) |
| Font family | **FedExSans**, Arial | roboto (licensed substitute) | ⚠️ intentional |
| Trigger font | 14px / 400 white | 14px / 400 white | ✅ |
| Trigger padding | 31px 15px 30px | equivalent centering | ✅ |
| Open trigger (desktop) | white bg + `#4d148c` text | same | ✅ |
| Open trigger (mobile) | `#4d148c` bg + white text, weight 300 | same (weight 400) | ✅ |
| Submenu panel | 240px, white, absolute below bar | `min-width: 240px` | ✅ |
| Submenu link | 14px/400 `#333`, padding 19px 13px 18px | same | ✅ |
| Row divider | `1px solid rgb(182 182 182 / 50%)` | same | ✅ |
| CTA links | `#007ab7`, 700, uppercase, 14px | same | ✅ |
| FedEx orange (TRACK btn) | **`#ff6200`** (rgb 255,98,0) | header.css `#ff6200` / styles.css `#f60` | ⚠️ global token drift |
| Transitions | padding .25s; drawer .25s; buttons `.2s cubic-bezier(.23,1,.32,1)` | 0.2–0.25s ease | ✅ |
| Desktop breakpoint | **1024px** (`max-width:1023px` mobile) | **900px** | ⚠️ divergence |
| Mobile drawer | below bar, bg `#fafafa`, accordion items white | slides from right, `min(465px,100%)` | ⚠️ see note |

Tracking-form module (inside Tracking dropdown):
- Label "Tracking ID" — 14px / 700 / `#333`
- Input — 56px tall, font 20px/300, border `1px solid #8e8e8e`, no radius
- Button "TRACK" — `#ff6200` bg, white, 19px/700, letter-spacing 0.95px, uppercase, 56px tall, full width

Search (desktop): expands **inline inside the purple bar** (~782px wide), input 45px tall with **purple background and white text**, autofocus on open, placeholder "Search or Tracking Numbers", close X, "Top Searched" suggestion panel underneath.

Sign-in panel: 240px, right-aligned to its trigger, same row dividers; ends with a 16px/300 promo paragraph.

Note on the mobile drawer: at 500px viewport the live drawer renders **below the bar spanning full width** (bg `#fafafa`), pushing from the hamburger; items are white accordion rows. Our implementation slides a fixed drawer from the right — visually close, but background (`#fff` vs `#fafafa` behind items) and full-width behavior at phone size should be re-verified at true 375px (browser window minimum prevented exact 375px capture).

## 4. Interactive elements inventory

| Element | Type | Behavior |
|---|---|---|
| 5 nav triggers | `<a href="#">` | click + desktop hover toggle; `--open` class; aria-label "Open X Menu" |
| ~24 submenu links | `<a>` | plain navigation, several cross-domain (office.fedex.com, local.fedex.com) |
| Tracking form | `<input>` + `<button>` | submits tracking number to tracking app |
| Sign-in trigger | `<a id="fxg-dropdown-signIn">` | dropdown, same pattern as nav items |
| Search icon | `<a aria-label="Search">` | expands inline search, autofocus |
| Search close | `<a aria-label="Exit Search">` | collapses search |
| Hamburger | `<button aria-label="Hamburger Menu">` | `is-active` class animates slider icon; opens drawer |
| Smart banner / alert bars | web components (`fedex-smart-banner`, `fedex-alert-header`) | out of header-block scope; model as separate EDS section/fragment |

## 5. Gap analysis vs `blocks/header/` (action list)

Confirmed by live measurement, ordered by impact:

1. **Tracking-ID form missing** — the live Tracking dropdown leads with a form (spec §3). Our block renders links only. *Recommendation:* extend the nav fragment contract so a dropdown can carry a `tracking` module (or auto-block it in `header.js` when the Tracking item is detected), reusing the hero block's tracking-form styles.
2. **Search is a dead link** — live site has an expanding in-bar search with suggestions. Our `.is-search` class has no CSS/JS behavior and the icon is dropped by `buildUtility` (it only moves `<a>`s). Minimum viable parity: render the magnifier icon; full parity needs the expanding field.
3. **Account dropdown missing** — live "Sign Up or Log In" is a 7-link dropdown + promo text, using the same dropdown pattern as the 5 nav items. Our block renders a plain link. The fragment's utility section could reuse the same `<ul>`-with-children contract.
4. **Breakpoint divergence** — live switches at **1024px**, our block at 900px. Between 900–1023px we show desktop nav where FedEx shows hamburger. Change `DESKTOP_QUERY` in [header.js](../blocks/header/header.js) and the media query in [header.css](../blocks/header/header.css) to 1024px if strict parity is wanted.
5. **Orange token drift** — live orange is `#ff6200`. `styles/styles.css` has `--fedex-orange: #f60` (`#ff6600`); `header.css` hardcodes the correct `#ff6200`. Fix the global token and have header.css consume it.
6. **Logo** — live logo is `https://www.fedex.com/content/dam/fedex-com/logos/logo.png` (88×25, alt "FedEx Logo"). Our nav fragment at `/fragments/nav` has a broken image (`about:error`); the documented text-wordmark fallback is **not actually implemented** in header.js/css. Either implement the fallback or author a real (self-hosted, optimized) logo asset.
7. **Responsive link variants** — "Create a Shipment" has different URLs for desktop vs mobile/tablet (see JSON). Our contract has no per-viewport link mechanism; simplest parity is choosing the desktop URL only, or supporting a visibility marker in the fragment.
8. **Analytics hooks** — every live trigger/link pushes `data-analytics` values (`hdr|tab|n|label`). If martech parity is required, add data attributes during decoration (`scripts/delayed.js` loads martech).

Minor: mobile bar 60 vs ~63px; drawer background `#fafafa`; open mobile trigger weight 300 vs 400; `styles.css --nav-height: 64px` doesn't match either height (also flagged in the earlier repo audit).

## 6. EDS nav fragment markup (target contract)

The existing three-section contract in [drafts/fragments/nav.plain.html](../drafts/fragments/nav.plain.html) already matches the live hierarchy. To reach full parity, the utility section gains the account submenu (same nested-list pattern) and the Tracking item gains a form module. Proposed authored structure (plain.html):

```html
<div> <!-- section 1: brand -->
  <p><a href="/">FedEx</a></p> <!-- or picture + link once logo asset exists -->
</div>
<div> <!-- section 2: primary nav — unchanged, 5 items, last sub-link <strong> = CTA -->
  <ul>
    <li>Shipping
      <ul>
        <li><a href="...">Create a Shipment</a></li>
        ...
        <li><strong><a href="...">All Shipping Services</a></strong></li>
      </ul>
    </li>
    <li>Tracking ... </li> <!-- header.js auto-blocks the tracking form into this panel -->
    ...
  </ul>
</div>
<div> <!-- section 3: utility -->
  <ul>
    <li>Sign Up or Log In
      <ul>
        <li><strong><a href=".../secure-login/">Sign Up / Log In</a></strong></li>
        <li><a href="...">My profile</a></li>
        ...
      </ul>
    </li>
    <li><a href="/en-us/search.html">Search</a></li>
  </ul>
</div>
```

CSS variables needed (add to `styles/styles.css` `:root`, consume in block CSS):

```css
--fedex-purple: #4d148c;        /* exists */
--fedex-orange: #ff6200;        /* fix: currently #f60 */
--fedex-link-blue: #007ab7;     /* promote from header.css to global */
--header-height-desktop: 75px;  /* exists in block */
--header-height-mobile: 60px;   /* live measures ~63px */
--header-submenu-width: 240px;
--header-divider: rgb(182 182 182 / 50%);
```

JavaScript requirements (all already present in `header.js` except items 3–5): dropdown toggle with `aria-expanded`, Escape/outside-click/focusout closing, hamburger drawer, desktop hover-open — plus (3) tracking-form submit, (4) expanding search, (5) account dropdown in utility section.

## 7. Accessibility checklist

| Check | Live site | Our block |
|---|---|---|
| Triggers keyboard-operable | `<a href="#">` (suboptimal) | `<button>` ✅ (better than source) |
| `aria-expanded` on triggers | not used (class-based) | ✅ implemented |
| `aria-controls`/submenu ids | not used | ✅ implemented |
| Escape closes menus | yes | ✅ |
| aria-labels on icon controls | yes ("Search", "Hamburger Menu") | hamburger ✅ / search n/a (missing icon) |
| Focus trap / restore | partial | ✅ trigger refocus on Escape |
| Heading hierarchy in nav | n/a (no headings) | n/a |
| Contrast: white on `#4d148c` | 10.1:1 ✅ | same ✅ |
| Contrast: `#007ab7` CTA on white | 4.6:1 ✅ AA | same ✅ |
| Tracking input label | visible `<label>` "Tracking ID" | to implement with form |

Our EDS implementation is already **more accessible than the source site** (real buttons, aria-expanded state); keep that when porting the remaining features.

## 8. Evidence

Session capture files (scratchpad, not committed): `fedex-header-outer.json` (full 48KB header outerHTML), `fedex-menu-data.json` (raw extraction), `fedex-computed-styles.json`, plus 8 screenshots: desktop normal / Shipping open / Tracking open (form visible) / Sign-in open / Search expanded, and mobile normal / drawer open / Shipping accordion open.
