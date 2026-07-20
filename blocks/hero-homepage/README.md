# hero-homepage Block

The `hero-homepage` block creates a full-bleed hero section matching the FedEx homepage design (`hero_homepage_v1`). It supports:

- **Full-bleed background**: video (desktop + mobile sources) or static image
- **Overlay text**: H1 heading + optional body copy + outlined-pill CTA button
- **Right-side product image**: hidden on mobile, shown on desktop
- **Video controls**: play/pause and mute/unmute buttons (bottom-right)
- **Quick-action strip**: icon + label links overlapping the bottom of the hero
- **Optional tracking form**: add a "track" cell to include a tracking-number input

## Confirmed live 2026-07-27: single static hero, not a carousel

Re-captured `.hero_homepage_v1` directly from fedex.com and checked for slide
markers: 0 real dot/pagination indicators, 0 arrow/next/prev controls, 0
slide elements (the one initial "dot" class match was `fxg-app__form-wrapper`
noise from a form field, not pagination). The video plays once — `loop` is
**not** set on the real `<video>` — rather than looping, which this block
now matches (`createVideo` no longer sets `video.loop`). The quick-actions
row (Quote/Ship/Locations/Support) is a set of plain outbound `<a>` links, and
the "Track" input is the one visible, functional form; there's also a hidden
sibling "locations finder" mini-app (`fxg-app__location`) elsewhere in the
hero that isn't wired to any of the visible quick-links and isn't part of
this block's scope. See `drafts/reference-hero-carousel.html` for the raw
capture.

**Not the same thing as [`tracking-widget`](../tracking-widget/README.md):**
that block's tabbed "Rate & Ship / Track / Locations" card with per-tab forms
does not match this fresh capture of the homepage hero (which has simple
inline quick-links, not tabs) — it was likely modeled on a different source.
Don't conflate the two; this block is the one that matches `hero_homepage_v1`.

## Author Guide

### Creating the Block in da.live

1. **Create a new table** with the `hero-homepage` block name.
2. **Use this row structure** (5 rows total):

| Row | Purpose | Column 1 | Column 2 | Column 3+ |
|---|---|---|---|---|
| 1 | Background media | Desktop video/image link | Mobile video/image link (optional) | — |
| 2 | Heading + product | H1 or H2 heading | Product/screenshot image (optional) | — |
| 3 | Body copy | Paragraph text (optional) | — | — |
| 4 | Call-to-action | Link text (optional) | — | — |
| 5 | Quick links | One link per cell (3–5 total) | One link per cell | "track" to show form |

---

## Row-by-Row Instructions

### Row 1: Background Media

**Purpose:** Set the background video or image for the hero.

| Column 1 | Column 2 |
|---|---|
| Desktop media link | Mobile media link (optional) |

**Column 1 – Desktop media:**
- Enter a link to an `.mp4`, `.webm`, or `.ogg` video file, or a `.jpg` / `.png` image.
- If you provide a video, it will autoplay, loop, and be muted (with play/pause + mute/unmute controls available).
- **Example:** `https://example.com/hero-video-desktop.mp4`

**Column 2 – Mobile media (optional):**
- Enter a link to a mobile-optimized video or image.
- If omitted, the desktop media will be shown on all screen sizes.
- Useful for bandwidth optimization—provide a smaller/shorter video for mobile.
- **Example:** `https://example.com/hero-video-mobile.mp4`

---

### Row 2: Heading + Product Image

**Purpose:** Add the hero headline and optional product screenshot on the right side.

| Column 1 | Column 2 |
|---|---|
| Heading (H1 or H2) | Product image (optional) |

**Column 1 – Heading:**
- Enter an `H1` or `H2` heading. The block will convert `H2` to `H1` automatically.
- The text will be white, overlaid on the video/image background.
- Use `<br>` or line breaks within da.live to create line breaks in the heading.
- **Example:** `FedEx. The New Power Move.`
- You can include `<sup>` for superscript (e.g., `SM`).

**Column 2 – Product image (optional):**
- Enter a link to an image (dashboard screenshot, app UI, etc.).
- Shown on the right side of the overlay text on desktop.
- Hidden on mobile.
- **Example:** `https://example.com/fedex-dashboard.png`

---

### Row 3: Body Copy

**Purpose:** Optional paragraph text beneath the heading (also white, overlaid).

| Column 1 |
|---|
| Paragraph text |

- Enter a paragraph (or leave blank to skip).
- Text will be white on top of the background.
- **Example:** `Streamline your shipping workflow with FedEx Surround.`

---

### Row 4: Call-to-Action (CTA)

**Purpose:** Optional button-style link beneath the body copy.

| Column 1 |
|---|
| CTA link |

- Enter a link (text + URL).
- Rendered as an outlined pill-shaped button with white border.
- **Example:** `Learn more` → `/en-us/about/new-power-move.html`

---

### Row 5: Quick Links + Optional Tracking Form

**Purpose:** Icon + label links at the bottom of the hero (in a rounded card), optionally with a tracking-number form.

| Column 1 | Column 2 | Column 3 | Column 4 | Column 5 |
|---|---|---|---|---|
| Link 1 | Link 2 | Link 3 | Link 4 | "track" |

**Columns 1–4: Quick Links**
- Each cell should contain **one link**.
- The block automatically chooses an icon based on the link text keyword:
  - `quote` or `rate` → 📋 Quote icon
  - `ship` → 📦 Ship icon
  - `location` or `fedex location` → 📍 Location icon
  - `support` or `contact` → 💬 Support icon
- Links appear as flex columns: icon above label.
- The strip is flex-wrap, so on mobile it wraps to multiple rows.
- **Examples:**
  - `Get a quote` → `/en-us/online/rating.html`
  - `Ship now` → `/en-us/shipping/ship-manager/login.html`
  - `FedEx locations` → `https://local.fedex.com/en-us`
  - `Contact support` → `/en-us/customer-support.html`

**Column 5 (optional): Tracking Form**
- If you add a cell with the text `track`, the block will include a tracking-number input form on the right side of the strip (desktop) / below the links (mobile).
- The form has:
  - Input field: placeholder "Tracking number"
  - Button: orange TRACK button
  - Action: submits to `/en-us/tracking.html?tracknum={number}`

---

## Examples

### Example 1: Video Hero with All Features

| Row | Column 1 | Column 2 | Column 3 | Column 4 | Column 5 |
|---|---|---|---|---|---|
| **1** | `https://example.com/hero-desktop.mp4` | `https://example.com/hero-mobile.mp4` | | | |
| **2** | `FedEx. The New Power Move.` | `https://example.com/screenshot.png` | | | |
| **3** | `Streamline your shipping with FedEx Surround.` | | | | |
| **4** | `Learn more` → `/en-us/about/new-power-move.html` | | | | |
| **5** | `Get a quote` | `Ship now` | `FedEx locations` | `Contact support` | `track` |

**Result:** Full hero with video background, heading, body, CTA button, 4 quick links + tracking form.

---

### Example 2: Static Image Hero (No Video)

| Row | Column 1 | Column 2 |
|---|---|---|
| **1** | `https://example.com/hero-bg.jpg` | (skip) |
| **2** | `Manage Your Shipments` | (skip) |
| **3** | (skip) | |
| **4** | `Get Started` → `/en-us/shipping/ship-manager/login.html` | |
| **5** | `Ship now` | `Track` | `Support` | | |

**Result:** Static image hero with heading, CTA, and 3 quick links (no tracking form).

---

### Example 3: Minimal Hero

| Row | Column 1 |
|---|---|
| **1** | `https://example.com/hero-video.mp4` |
| **2** | `Welcome to FedEx` |
| **5** | `Ship now` |

**Result:** Just a video background, heading, and one quick link.

---

## Design Notes

### Responsive Behavior

- **Mobile** (<600px):
  - Hero height: 320px
  - Text heading: 32px
  - Product image: hidden
  - Quick links: wrap to multiple rows
  - Tracking form (if present): below links

- **Tablet** (600–899px):
  - Hero height: 380px
  - Text heading: 40px
  - Product image: still hidden

- **Desktop** (≥900px):
  - Hero height: 420px
  - Text heading: 46px
  - Product image: shown on the right
  - Quick links: single row (left) + tracking form (right)
  - Mobile video hidden, desktop video shown

### Video Optimization

- **Desktop video:** Full-quality, may be larger file size (e.g., 1200p HD, 1500 kbps)
- **Mobile video:** Smaller resolution, lower bitrate (e.g., 640p SD, 750 kbps)
- Both are muted and autoplay, so provide good cover images on first frame
- For Kaltura or CDN hosted videos, use direct mp4 URLs

### Image Guidelines

- **Background image:** Use landscape aspect ratio (16:9 recommended); will be `object-fit: cover`
- **Product/screenshot image:** Use portrait or square aspect ratio; set your own dimensions in da.live
- All images are loaded with `loading="eager"` for LCP performance

### Text Styling

- **Heading:** White, shadow for contrast, font-size scales with breakpoints
- **Body copy:** White, smaller font, same shadow for readability
- **CTA button:** Outlined pill shape, white border, hover → filled background
- **Quick links:** Dark text on light gray background (card), color → purple on hover

### Video Controls

- **Play/Pause button** (top-left of control pair): toggle video play state
- **Mute/Unmute button** (top-right of control pair): toggle audio
- Both apply to all videos on the page (desktop + mobile if both present)
- Buttons appear in the bottom-right corner of the media area

---

## FAQs

**Q: Can I use both video and image backgrounds?**  
A: No. Provide either a video URL or an image URL in column 1 of row 1. The block detects video by file extension (`.mp4`, `.webm`, `.ogg`).

**Q: What if I provide a mobile video but no desktop video?**  
A: The mobile video will appear on all screens. For best results, provide a desktop video and let mobile default to it, or provide both.

**Q: Can I hide the quick-action strip?**  
A: No. At least one quick link is required for the block to render. If you want a minimal hero, provide just one link.

**Q: Can I change the quick-link icons?**  
A: The icons are chosen automatically based on link text keywords. If your link text includes "quote" or "rate", it gets the quote icon, etc. Rename your link text to match a keyword if you need a different icon.

**Q: Can I add more than 4 quick links?**  
A: Yes. Add more cells to row 5 (column 5 onward). On mobile, they will wrap to multiple rows.

**Q: Does the tracking form work without a back end?**  
A: The form submits a `GET` request to `/en-us/tracking.html?tracknum={number}`. Your tracking page must handle the `tracknum` parameter.

**Q: Can I style the CTA button differently?**  
A: Not via authoring. The block uses predefined CSS. Contact your developer to customize the button appearance.

---

## Accessibility

- Heading uses semantic `<h1>` tag
- Video controls have `aria-label` descriptions
- Tracking form input has `aria-label="Tracking number"`
- Tracking button is a proper `<button>` type submit
- All links use proper `<a>` tags with meaningful href attributes

---

## Related Blocks

- **[Header](../header/)** — Site navigation
- **[Footer](../footer/)** — Site footer with links and social icons
- **[Columns](../columns/)** — General-purpose multi-column layout

