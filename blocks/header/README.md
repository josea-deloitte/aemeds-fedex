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

One link per paragraph, for example:

```md
[Sign Up or Log In](/secure-login/en-us/)
[Search](/en-us/home.html#)
```

## Rendering rules

- Top-level items with children render as dropdown buttons.
- On desktop (`>=900px`), dropdowns open on hover/click.
- On mobile (`<900px`), hamburger opens right-side drawer; submenus behave as accordions.
- Bold submenu links render as blue uppercase CTA links.
