# Header

The FedEx purple masthead: brand mark on the left, dropdown navigation and utilities (Search, Sign In) on the right, all inside the site's 970px content grid. The header is **not authored on each page** — it loads its content from a shared navigation document.

## Where to author

Edit the document at **`/fragments/nav`**. A specific page can use a different navigation by setting a `nav` value in its Metadata table (e.g. `/de/fragments/nav` for a localized page, or `/drafts/fragments/nav` for a test page).

## Document structure

The nav document has **three sections separated by horizontal rules (`---`)**, in this exact order:

### Section 1 — Brand

A single link to the homepage. Add a logo image inside the link if one is available in the DAM; if the link has **no image (or the image fails to load), the header renders a Fed/Ex text wordmark automatically** — so a plain text link is a perfectly valid way to author this section:

> [FedEx](/)

### Section 2 — Navigation

One bulleted list. A top-level item **with a nested list becomes a dropdown**; a top-level item that is just a link navigates directly:

> - Shipping
>   - [Create a Shipment](/en-us/shipping/create.html)
>   - [Shipping Rates & Delivery Times](/en-us/online/rating.html)
>   - **[All Shipping Services](/en-us/shipping.html)**
> - Tracking
>   - [Advanced Shipment Tracking](/en-us/tracking/advanced.html)
>   - [Manage Your Delivery](/en-us/delivery-manager.html)
> - [Locations](/en-us/locations.html)
> - Support
>   - [Customer Support](/en-us/customer-support.html)

Authoring rules:

- A top-level item that has a nested list must **not** be a link itself (`Shipping`, not `[Shipping](…)`) — it becomes a toggle button, so a link would never be clickable.
- Make a dropdown link **bold** to render it as the FedEx-style call-to-action row (uppercase, blue, bold — like "ALL SHIPPING SERVICES" on fedex.com). Put it last in the list.
- Keep top-level items to **5 or fewer** and dropdowns to **8 links or fewer** — the bar does not wrap gracefully beyond that.

### Section 3 — Tools

Short utility links shown at the right edge of the bar:

> :search: [Search](/en-us/search.html)
>
> [Sign Up or Log In](/en-us/secure-login.html)

- One paragraph per tool.
- A tool with an **icon** (`:search:`) renders icon-only; its text becomes the accessible label.
- A link whose text contains *Sign In*, *Sign Up*, or *Log In* is tagged as the sign-in link. It renders as a plain white text link (fedex.com does not use a boxed button here).
- Keep tools to **3 or fewer**.

## Behavior (what the code does with this content)

The block JS rebuilds the fragment into its own markup — dropdown labels become real `<button>` elements with `aria-expanded`/`aria-controls`, so none of the global content styles leak into the header.

- **Desktop (≥ 900px):** 75px bar. Dropdowns open on hover (mouse) and on click/Enter/Space. The open item inverts to a white background with purple text and shows a 240px white panel with the fedex.com hard offset shadow. Escape, clicking outside, or tabbing out closes it.
- **Mobile (< 900px):** 60px bar with a hamburger on the right. The menu slides in from the right below the bar (465px wide, full-width on phones) as an accordion: an open item inverts to purple with white text and its links expand in place. Page scrolling locks while the drawer is open.
- Honors `prefers-reduced-motion` (no slide/rotate animations).
- A "Skip to main content" link is prepended for keyboard users and targets `#main-content` on `<main>`.

## Local development & test content

The CMS document at `/fragments/nav` is published, so the header works out of the box against the proxy. To exercise the **full FedEx navigation** (5 dropdowns, CTA rows, wordmark fallback) locally:

| File | Purpose |
|---|---|
| `drafts/fragments/nav.plain.html` | Full FedEx nav fixture, served at `/drafts/fragments/nav` |
| `drafts/header-test.html` | Test page whose `nav` metadata points at the fixture — open `http://localhost:3000/drafts/header-test` |

Start the dev server with `aem up --html-folder drafts` (already configured in `.claude/launch.json`).
