# Tracking Widget

The tabbed tool card from the FedEx homepage (Rate & Ship / Track / Locations). Each authored row becomes one tab. Tabs can hold a single-field form (e.g. tracking number) or plain text with buttons.

## Authoring

Create a table named `Tracking Widget` with **three columns** per row:

| Tracking Widget | | |
| --- | --- | --- |
| Rate & Ship | | Get rates, create shipping labels, and schedule pickups — all in one place.<br>**[Rate & Ship Now](/en-us/online/rating.html)** |
| Track | Tracking ID | Enter a FedEx tracking number to review shipping details.<br>**[Track](https://www.fedex.com/fedextrack/?trknbr=)**<br>[Multiple tracking numbers?](/en-us/tracking.html) [Need help?](/en-us/customer-support.html) |
| Locations | Zip or City, State | Find a FedEx location for drop-off, pickup, or retail services.<br>**[Find Location](https://local.fedex.com/en-us?location=)** |

| Column | Content |
| --- | --- |
| 1 | **Tab label** (required). Shown on the tab button. |
| 2 | **Input label** (optional). If filled, the tab gets a text field with this label. If empty, the tab shows the content as-is with buttons only. |
| 3 | **Panel content**: an optional intro sentence, the main link in **bold**, and optional help links. |

## How the form works

For tabs with an input label, the **bold link's URL must end in an empty query parameter** — that parameter receives what the user types:

- `https://www.fedex.com/fedextrack/?trknbr=` → submits to `…/fedextrack/?trknbr=<typed value>`
- `https://local.fedex.com/en-us?location=` → submits to `…/en-us?location=<typed value>`

Any other parameters already on the URL are kept. The bold link's text becomes the submit button label.

## Variants

- `Tracking Widget (default-track)` — the **Track** tab is selected on page load (matches fedex.com), regardless of row order.

## Placement

Put the widget in the section **directly after the Hero**; on desktop the card automatically pulls up and overlaps the hero image. Anywhere else it renders as a normal centered card.

## Good to know

- Authors can add, remove, or reorder tabs freely; rows without a tab label or content are skipped.
- Tab switching, keyboard navigation (arrow keys), and screen-reader labels are handled by the block — just keep labels short and descriptive.
