# Columns Featured Offer

A single promo panel pairing an image with a heading, a short paragraph, and
one link — e.g. FedEx's "Stay on top of tariffs and trade news" callout.

## Authoring

Create a table named `Columns Featured Offer` with one row and two cells: image,
then content.

| Columns Featured Offer | |
| --- | --- |
| ![](/tariff-image.jpg) | ## Stay on top of tariffs and trade news<br>Find helpful tools for international shipping.<br>[Navigate global shipping](/en-us/shipping/international/us-tariffs-impact.html) |

- Cell order doesn't matter — the cell containing the image is detected
  automatically and always displays first (above the content on mobile,
  beside it on desktop).
- The content cell should end with a single link as its **last paragraph**.
  A plain link renders as an uppercase text CTA; a **bold link** renders as
  a filled button instead.

## Behavior

Image and content stack on mobile; from 900px the image sits beside the
content (image takes ~42% of the width) with the content vertically centered.
