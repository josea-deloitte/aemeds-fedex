# Columns

A responsive row of columns (boilerplate default block). Each authored row
is one set of columns; a row with exactly one picture-only cell floats that
picture to a natural image column.

## Authoring

Create a table named `Columns` with one row and one cell per column:

| Columns | |
| --- | --- |
| ## Ship with confidence<br>Whether it's across states or worldwide, we prioritize the secure and swift arrival of your shipments. | ![](/courier.jpg) |

- Any number of columns per row is supported; columns split the row evenly.
- A cell containing **only** a picture is floated to sit naturally alongside
  the text column instead of stacking above/below it.

## Behavior

Columns stack vertically (16px gap) below 900px and sit in a row (24px gap,
vertically centered) from 900px up.

## Variants

Add one or more of these as extra words in the block name to opt into
FedEx's original `column_control_v1` grid options:

| Variant | Block name | Effect |
| --- | --- | --- |
| `col-sm-6` | `Columns (col-sm-6)` | Forces a fixed 2-up, 50%-width grid (Bootstrap's "6 of 12 columns") from 600px up, instead of splitting evenly across however many cells are authored. Extra cells wrap to a new row. |
| `fxg-col-mobile_position1` | `Columns (fxg-col-mobile_position1)` | Explicitly keeps the 1st authored cell first on mobile. This is already the default — use it to document intent or to override a `fxg-col-mobile_position2` set elsewhere. |
| `fxg-col-mobile_position2` | `Columns (fxg-col-mobile_position2)` | Shows the **2nd** authored cell first on mobile only (e.g. lead with the image, text below), reverting to authored order from 900px up. |

Variants combine freely, e.g. `Columns (col-sm-6, fxg-col-mobile_position2)`
gives a 2-up grid whose second cell leads on mobile.

## Mapping note

This block is the EDS equivalent of FedEx's `column_control_v1` component
(a Bootstrap-style responsive column row) for **plain, generic** usage — one
row, no special background or nested sub-rows. FedEx re-authors separate
`column_control_v1`/`advanced_table_v1` copies of the same content per
breakpoint (e.g. a mobile-only variant and a desktop-only variant of the same
row); EDS doesn't need that — one instance of this block already adapts
responsively via CSS. (Standalone `advanced_table_v1` usage — an actual
table, not a breakpoint duplicate — maps to the
[`advanced-table`](../advanced-table/README.md) block instead.) The specific
repeating "image + heading + copy + link" feature row (e.g. "Find many fast
delivery options") maps to the [`cards`](../cards/README.md) block's `promo`
variant instead, since that block already handles the pinned-footer-link
layout — see that README for the authoring structure.

**Correction (2026-07-27):** an earlier version of this doc used "Why ship
with FedEx?" as this block's example and cited it as this block's variant
options carried straight from `column_control_v1`. Closer live inspection
showed that section is actually a **nested** structure with a per-row
background color (`#FAFAFA`) — a level of configurability this generic block
doesn't (and shouldn't) support. It now maps to the dedicated
[`column-control`](../column-control/README.md) block instead, which was
built specifically for that. Use `columns` for a new, plain N-column layout;
use `column-control` only when reproducing a specific FedEx section that
needs a background color or nested rows.
