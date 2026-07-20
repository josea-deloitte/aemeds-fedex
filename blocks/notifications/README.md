# Notifications

A full-width informational banner with an icon and a short message (e.g. a
site-wide service alert like FedEx's "IEEPA tariff refund update").

## Authoring

Create a table named `Notifications` (optionally with a theme variant) with
a single cell holding the message:

| Notifications |
| --- |
| IEEPA tariff refund update. [Customer portal live now.](/en-us/shipping/international/us-tariffs-impact.html) |

- The message can be plain text and/or a link; keep it to one short paragraph.
- A **bold link** inside the message is still rendered inline (not turned
  into a button) — this block is for short status text, not calls to action.

## Variants

The icon and color scheme change with the block name:

| Block name | Theme |
| --- | --- |
| `Notifications` | Informational (blue) — default |
| `Notifications (success)` | Success (green) |
| `Notifications (warning)` | Warning (amber) |
| `Notifications (error)` | Error (red) |

## Behavior

The block gets `role="alert"` for the error theme and `role="status"` for
every other theme, so assistive tech announces the message when it appears.
