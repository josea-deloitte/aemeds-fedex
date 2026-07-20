# Advanced Table

A responsive data table. It renders as a normal `<table>` on tablet and
desktop (scrolling horizontally if it's too wide) and collapses to stacked
label/value rows on mobile.

## Authoring

Create a table named `Advanced Table`, with the first row as column
headers and one row below per table row:

| Advanced Table |  |  |
| --- | --- | --- |
| Service | Delivery time | Price |
| FedEx Priority Overnight | Next business day | $$$ |
| FedEx Ground | 1-5 business days | $ |

For a header-less grid of tiles (e.g. an icon + link per column, all in a
single row) use the `no-header` variant and put every cell in one row:

| Advanced Table (no header) |  |  |  |
| --- | --- | --- | --- |
| ![icon](/icons/box.svg) [Drop off a package](/en-us/shipping/dropoff.html) | ![icon](/icons/redirect.svg) [Redirect a package](/en-us/delivery-manager.html) | ![icon](/icons/return.svg) [Return a package](/en-us/returns.html) | ![icon](/icons/store.svg) [Find a location](/en-us/locations.html) |

## Variants

- `Advanced Table` — first authored row renders as the `<th>` header row.
- `Advanced Table (no header)` — every authored row is a plain data row;
  use this when the table doesn't have (or need) column headers.

## Behavior

Below 600px, the header row is visually hidden (still readable by screen
readers) and each cell becomes its own line, labeled with its column header
—unless the table has no header, in which case cells simply stack.
