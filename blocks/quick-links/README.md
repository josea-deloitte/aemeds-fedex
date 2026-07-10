# Quick Links

A centered row of circular icon shortcuts ("How can we help you?"). Each row is one shortcut.

## Authoring

Create a table named `Quick Links` with one column, one row per shortcut. Each cell holds an icon followed by a link:

| Quick Links |
| --- |
| :box: [Drop off a package](/en-us/shipping/dropoff.html) |
| :redirect: [Redirect a package](/en-us/delivery-manager.html) |
| :return: [Return a package](/en-us/returns.html) |
| :store: [Store hours and services](/en-us/locations.html) |
| :alert: [Service alerts](/en-us/service-alerts.html) |

- The **link text is the visible label** — keep it short (2–4 words).
- The icon uses the `:name:` syntax and is optional; a row without an icon shows just the label.
- Rows without a link are skipped.

## Available icons

`:box:` `:redirect:` `:return:` `:store:` `:alert:` `:search:`

To add a new icon, ask a developer to drop an SVG into the `/icons` folder (24×24 viewBox, FedEx purple strokes); it is then available everywhere as `:filename:`.

## Behavior

Icons render in white circles with a purple ring; on hover/focus the circle fills purple and the icon inverts to white. Items wrap onto multiple lines on small screens.
