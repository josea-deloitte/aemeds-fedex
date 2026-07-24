# Column Control

A single configurable 2-column row, matching FedEx's `column_control_v1`
component. Unlike the generic [`columns`](../columns/README.md) block, each
instance represents **one row** with its own optional background color and
width ratio — nest another `Column Control` table inside a cell to build up
FedEx's recursive layouts (e.g. the "Why ship with FedEx?" section: an outer
text+image row containing a heading row and two paragraph-pair rows, all with
independent styling).

## Authoring

Create a table named `Column Control` with **one content row of 2 cells**:

| Column Control |  |
| --- | --- |
| Left column content | Right column content |

To set this row's background color, add a **3rd cell** with a CSS color
value (hex, name, etc.) — it's read as configuration, not rendered as a
column:

| Column Control |  |  |
| --- | --- | --- |
| Left column content | Right column content | #FAFAFA |

### Nesting (nested nested column layouts)

Put another `Column Control` table inside a cell's content to build a row
within a row — this is exactly how FedEx builds "Why ship with FedEx?":

- Outer `Column Control (col-sm-6, fxg-col-mobile_position2)`, background `#FAFAFA`:
  - Cell 1 (text, shows 2nd on mobile): four nested `Column Control` rows —
    a `(col-sm-10)` heading row, two plain `(col-sm-6)` paragraph-pair rows,
    and a `(col-sm-6, hide-mobile)` footnote row.
  - Cell 2 (image, shows 1st on mobile): the photo.

## Variants

| Variant | Effect |
| --- | --- |
| `col-sm-N` (N = 1–11) | First cell takes N/12 of the row width, second cell takes the rest, from 900px up. Omit for an even 6/6 split. FedEx's own title rows use `col-sm-10` (wide text + narrow gutter). |
| `fxg-col-mobile_position2` | The **2nd** cell shows first when stacked on mobile (e.g. lead with the photo); reverts to authored order from 900px up. |
| `hide-mobile` | Hides the entire row below 900px (FedEx uses this to drop footnote text on mobile). |

Variants combine freely, e.g. `Column Control (col-sm-6, fxg-col-mobile_position2)`.

## Behavior

Columns stack vertically (24px gap) below 900px and sit side by side (32px
gap) from 900px up, at whatever ratio `col-sm-N` sets. Below 900px, a 3rd
cell's background color still applies (mobile just gets less padding).

## Mapping note

This block and [`columns`](../columns/README.md) both originate from
`column_control_v1`. Use **`columns`** for a plain, generic N-column layout
with no special configuration. Use **`column-control`** when the source
content actually needs a per-row background color, a non-even width split,
or nested rows — i.e. when you're reproducing a specific FedEx section like
"Why ship with FedEx?" rather than authoring a new generic layout.
