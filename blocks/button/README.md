# Button

A single call-to-action link, authored explicitly as its own block instead
of relying on bold/italic auto-formatting. Matches FedEx's `button_v1`
component, which is a plain colored text link by default and occasionally a
solid/outline button (e.g. "Start shipping now" on the homepage).

## Authoring

Create a table named `Button` with a single cell holding one link:

| Button |
| --- |
| [Start shipping now](/en-us/shipping/ship-manager/login.html) |

- Put exactly one link in the cell. Its text is the visible label.

## Variants

| Block name | Renders as |
| --- | --- |
| `Button` | Plain uppercase blue text link (default — matches most FedEx CTAs like "drop off a package") |
| `Button (outline)` | Orange-bordered, orange-text, transparent button that fills orange on hover — matches FedEx's real "Start shipping now" button (`fxg-button--transparent`, confirmed against a live screenshot 2026-07-27) |
| `Button (primary)` | Solid filled button (sitewide `.button.primary` style) |
| `Button (secondary)` | Outlined/transparent button (sitewide `.button.secondary` style, dark border/text — a generic alternative, not a FedEx-specific match) |
| `Button (accent)` | High-impact filled button (sitewide `.button.accent` style) |

**Correction (2026-07-27):** an earlier version of this doc said `secondary`
matched "Start shipping now" — that was wrong (assumed, not verified against
FedEx's real rendered color). Live inspection shows that button is orange, not
dark; use the new `outline` variant for it instead.

## Good to know

- This block exists for authors who want an explicit, unambiguous button
  without formatting a link bold/italic in a paragraph. The existing
  shortcut (**bold** a link for a primary button, *italic* for secondary)
  still works everywhere else and renders identically.
