# Carousel

A swipeable promo carousel ("Explore our services"). Each authored row is one slide with an image and text content side by side on desktop, stacked on mobile.

## Authoring

Create a table named `Carousel` with **two columns** per row:

| Carousel | |
| --- | --- |
| *[image]* | ### FedEx One Rate<br>Predictable, flat-rate shipping with no need to weigh or measure packages under 50 lbs.<br>**[See One Rate options](/en-us/shipping/one-rate.html)** |
| *[image]* | ### Small business solutions<br>Save on shipping, printing, and more with tools built for growing businesses.<br>**[Explore small business](/en-us/small-business.html)** |

| Column | Content |
| --- | --- |
| 1 | Slide image. Landscape, at least 1200px wide. **Alt text is required.** |
| 2 | A Heading 3, a short paragraph, and a call-to-action link in **bold** (renders as an orange button). |

## Recommendations

- 3–5 slides works best; keep copy to one or two sentences per slide.
- Use a consistent image crop across slides — images display at a 3:2 ratio.

## Behavior

- Users navigate with the arrow buttons, the dots, or by swiping/scrolling on touch devices.
- There is **no autoplay** — this is deliberate for accessibility; don't request it without a pause control design.
- With a single row, the slide renders without arrows or dots.
- Slide labels ("Slide 1 of 3"), button states, and keyboard focus styles are handled by the block.
