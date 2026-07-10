# Header

The FedEx purple masthead with brand, dropdown navigation, and tools (search, sign in). The header is **not authored on each page** — it loads its content from a shared navigation document.

## Where to author

Edit the document at **`/nav`** (site root). A specific page can use a different navigation by setting a `nav` value in its Metadata table (e.g. `/de/nav` for a localized page).

## Document structure

The `/nav` document has **three sections separated by horizontal rules (`---`)**, in this exact order:

### Section 1 — Brand

A single bold link. Text or a logo image, linking to the homepage:

> **[FedEx](/)**

### Section 2 — Navigation

One bulleted list. A top-level item **with a nested list becomes a dropdown**; a top-level item that is just a link navigates directly:

> - Shipping
>   - [Create a Shipment](/en-us/shipping/create.html)
>   - [Calculate Shipping Rates](/en-us/online/rating.html)
>   - [FedEx One Rate](/en-us/shipping/one-rate.html)
> - Tracking
>   - [Track a Shipment](/en-us/tracking.html)
>   - [FedEx Delivery Manager](/en-us/delivery-manager.html)
> - [Locations](/en-us/locations.html)
> - Support
>   - [Customer Support](/en-us/customer-support.html)

### Section 3 — Tools

Short links shown on the right, optionally with icons:

> :search: [Search](/en-us/search.html)
> [Sign In](/en-us/secure-login.html)

## Behavior

- Desktop: dropdowns open on click and close on Escape or when focus leaves the menu.
- Mobile: everything collapses behind a hamburger that opens a full-screen purple menu.
- Keep top-level items to ~5 and dropdowns to ~6 links — the bar does not wrap gracefully beyond that.

## Local development

Until real `/nav` content exists in the CMS, the repo root contains a `nav.plain.html` fixture that the local dev server serves at the same path. It is excluded from deployment via `.hlxignore`; delete it once the CMS document is published.
