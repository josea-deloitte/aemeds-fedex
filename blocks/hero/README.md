# Hero

Full-width campaign banner at the top of the page. The image is the page's LCP element, so this block must be in the **first section** of the document.

## Authoring

Create a table named `Hero` with two rows, one column:

| Hero |
| --- |
| *[image]* |
| # Where now meets next<br>Ship, manage, track, and deliver with the speed and reliability you count on.<br>**[Ship Now](/en-us/shipping.html)** |

| Row | Content |
| --- | --- |
| 1 | The background image. Landscape, at least 1600px wide. **Alt text is required.** |
| 2 | A Heading 1 (this should be the only H1 on the page), an optional short paragraph, and an optional call-to-action link. |

## Formatting rules

- **Bold link** → orange button.
- Keep the headline short (a few words); body copy under ~2 sentences. Text sits over a purple gradient, bottom-centered on mobile and left-aligned on desktop.
- The image is cropped to a fixed banner height on all screens — keep the key subject near the center of the frame.

## Good to know

- The block works without an image: text renders on a solid FedEx purple background.
- Do not mark the image lazy or resize it manually — the platform optimizes it and the code forces eager, high-priority loading automatically.
- The [Tracking Widget](../tracking-widget/README.md) is designed to sit in the **next** section and overlap the hero's bottom edge on desktop.
