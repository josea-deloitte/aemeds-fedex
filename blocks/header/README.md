# Header

FedEx-style sticky header with:
- Purple top bar
- Utility links on the right
- Desktop dropdown navigation
- Mobile hamburger + accordion drawer

## Authoring source

Author content in `/fragments/nav` using three sections separated by `---`.

## Section structure

### 1) Brand section

Single link (with optional logo image):

`[FedEx](/)`

### 2) Navigation section

Use nested lists. Top-level items with nested lists become dropdown triggers.

```md
- Shipping
  - [Create a Shipment](/en-us/shipping/ship-manager/login.html)
  - [Shipping Rates & Delivery Times](/en-us/online/rating.html)
  - **[All Shipping Services](/en-us/shipping.html)**
- Tracking
  - [Advanced Shipment Tracking](/fedextracking)
  - [Manage Your Delivery](/fdmenrollment/)
- [Locations](/en-us/shipping/drop-off-package.html)
- Support
  - [Customer Support](/en-us/customer-support.html)
```

### 3) Utility section

Either one link per paragraph (legacy), or a list. In a list, an item with a
nested list becomes a dropdown — this is how the account menu is authored:

```md
- Sign Up or Log In
  - **[Sign Up / Log In](/secure-login/en-us/)**
  - [My profile](/profile-overview)
  - [Administrative tools](/apps/shipadmin/)
  - [Email preferences](/emailpreferences/login)
  - [Address book](/swab/AddressMain.do)
  - [View & pay bill](/en-us/billing-online.html)
  - [Reporting](/ecap/report)
  - [Open an account](/en-us/open-account.html) to save on shipping costs, time-saving tools and more!
- :search: [Search](/en-us/home.html#)
```

## Rendering rules

- Top-level items with children render as dropdown buttons.
- On desktop (`>=1024px`), the **primary nav** dropdowns (Shipping, Tracking, etc.)
  open on hover or click (matches fedex.com's breakpoint).
- The **account/utility dropdown** ("Sign Up or Log In") is **click-only at every
  breakpoint** — hovering it does nothing, matching fedex.com's real behavior
  (verified live 2026-07-27: hover events produce no change; only a click sets
  `aria-expanded="true"`). Clicking the trigger again, clicking outside the nav,
  or pressing Escape all close it.
- On mobile (`<1024px`), hamburger opens right-side drawer; submenus behave as accordions.
  The utility (account) dropdown floats below the bar at all sizes.
- All dropdown triggers are `<button>` elements, so Enter/Space toggle them via
  native browser behavior; no custom key handling is needed for that.
- Bold submenu links render as blue uppercase CTA links.
- A submenu item that isn't purely a link (e.g. the "Open an account…" sentence)
  renders as a promotional note row (16px light, inline blue links).
- An icon placed next to a utility link is moved inside it; the Search link
  renders icon-only with a screen-reader label.
