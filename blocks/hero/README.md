# Hero

FedEx-style homepage hero with background image, headline, subtitle, and one or more CTA buttons.

## Authoring in da.live

Create a table named `Hero` with **2 rows and 1 column**:

| Hero |
| --- |
| *[Hero image]* |
| # Ship, manage, track, deliver<br>Your one-stop solution for shipping and tracking.<br>[Rate & Ship](/en-us/shipping.html) [Track](/en-us/tracking.html) |

### Row contract

| Row | Required | Content |
| --- | --- | --- |
| 1 | Yes | Background image (landscape). |
| 2 | Yes | Heading (`h1`/`h2`), optional subtitle paragraph, and CTA links. |

## Notes

- First link renders as the primary orange FedEx button.
- Second link (and beyond) renders as secondary outline buttons.
- The image is treated as LCP: eager loading + high fetch priority are set in JS.
- Keep the hero in the first page section for best performance.
