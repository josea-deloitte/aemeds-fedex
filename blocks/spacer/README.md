# Spacer

An empty block that reserves vertical space, with independent control over
how tall it is on mobile, tablet, and desktop.

## Authoring

Create a table named `Spacer` with a single cell holding one height, or three
comma-separated heights (mobile, tablet, desktop):

| Spacer |
| --- |
| 40px |

| Spacer |
| --- |
| 13px, 40px, 40px |

- Any valid CSS length works (`px`, `rem`, `%`, etc.).
- One value applies at every breakpoint. Three values apply mobile, tablet
  (≥600px), and desktop (≥900px) respectively — each falls back to the
  previous tier if omitted (e.g. `13px, 40px` leaves desktop same as tablet).
- An empty cell falls back to 24px.

## Behavior

The block renders as an empty, `aria-hidden` div — it carries no content and
is invisible to screen readers.
