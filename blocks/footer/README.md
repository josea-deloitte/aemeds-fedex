# Footer Block

The site-wide footer: link columns on a light background, a "Follow FedEx" social icon strip, and a purple legal bar. It is **not authored per page** — it loads from a shared document at `/fragments/footer`.

## Where to author

Edit the document at `/fragments/footer`. A page can override it by adding a `footer` row to its Metadata table.

---

## Document structure

The `/footer` document has **two sections separated by a horizontal rule (`---`)**.

---

### Section 1 — Link columns (`Columns` block)

Use a `Columns` block with **four cells** in this order:

| # | Column heading | Content type |
|---|---|---|
| 1 | `Our Company` | Two bulleted lists (renders as a 2-col sub-grid on desktop) |
| 2 | `More From FedEx` | One bulleted list |
| 3 | `Language` | Country link paragraph + language options list |
| 4 | `Follow FedEx` | Social platform links (auto-converted to circular icon buttons) |

> The JS decorator extracts the **Follow FedEx** column into its own strip between the link columns and the legal bar, matching the fedex.com layout.

---

### Column 1 — Our Company

Two separate bulleted lists in one cell. The JS detects the two `<ul>` elements and lays them out as a **2-column sub-grid** on desktop. On mobile they collapse into a single accordion.

```
## Our Company

- [About FedEx](https://www.fedex.com/en-us/about.html)
- [Our Portfolio](https://www.fedex.com/en-us/about/company-structure.html)
- [Investor Relations](https://investors.fedex.com/home/default.aspx)
- [Careers](https://careers.fedex.com/fedex/)
- [Transportation Contracting Opportunities](https://www.contracting.fedex.com/)

- [FedEx Blog](https://www.fedex.com/en-us/blog.html)
- [Corporate Responsibility](https://www.fedex.com/en-us/about/corporate-social-responsibility.html)
- [Newsroom](https://newsroom.fedex.com/)
- [Contact Us](https://www.fedex.com/en-us/customer-support.html)
```

---

### Column 2 — More From FedEx

```
## More From FedEx

- [FedEx Compatible](https://www.fedex.com/en-us/compatible.html)
- [FedEx Developer Portal](https://developer.fedex.com/api/en-us/home.html)
- [FedEx Logistics](https://www.fedex.com/en-us/logistics.html)
```

---

### Column 3 — Language

A **paragraph** with the country link, then a **bulleted list** of language options. The JS transforms these into a globe-icon country link and a dropdown toggle.

```
## Language

[United States](https://www.fedex.com/?location=home)

- [English](https://www.fedex.com/en-us/home.html)
- [Español](https://www.fedex.com/es-us/home.html)
```

**How the dropdown works:**
- The paragraph link becomes a globe icon + "United States" label.
- A `<button aria-expanded="false">` toggles the language list. Clicking outside dismisses it.
- The first list item is selected by default. To mark a different language as current, add `aria-current="true"` to its link in the CMS rich-text editor.
- To add languages, add more list items.

> **Rules:**
> - The paragraph must contain exactly **one link** (the country selector).
> - Language options must be in a `<ul>` (bulleted list), **not** a paragraph.
> - The heading must be exactly `Language` — the JS uses a `/language/i` regex to locate this column.

---

### Column 4 — Follow FedEx (social icons)

A bulleted list of social platform links. The JS maps each link's text to an SVG from `/icons/` and replaces the text with a circular icon button.

```
## Follow FedEx

- [Newsletter](https://www.fedex.com/en-us/email.html)
- [Facebook](https://www.facebook.com/FedEx/)
- [Twitter](https://twitter.com/fedex)
- [Instagram](https://www.instagram.com/fedex/)
- [LinkedIn](https://www.linkedin.com/company/fedex)
- [YouTube](https://www.youtube.com/user/fedex/custom?sub_confirmation=1)
- [Pinterest](https://www.pinterest.com/FedEx/)
```

Icon matching is keyword-based (case-insensitive, substring match on link text):

| Link text contains | Icon file |
|---|---|
| `newsletter` or `email` | `icons/social-email.svg` |
| `facebook` | `icons/social-facebook.svg` |
| `twitter` | `icons/social-x.svg` |
| `instagram` | `icons/social-instagram.svg` |
| `linkedin` | `icons/social-linkedin.svg` |
| `youtube` | `icons/social-youtube.svg` |
| `pinterest` | `icons/social-pinterest.svg` |

`aria-label` is preserved from the authored link; if absent the JS sets a sensible default (e.g. "FedEx on Facebook").

> **Rules:**
> - The heading must be exactly `Follow FedEx` — the JS uses a `/follow fedex/i` regex to extract this column.
> - Do **not** rename or reorder this column relative to the others.

---

### Section 2 — Legal bar

Always the **last section** of the `/footer` document. A plain copyright paragraph followed by a bulleted list of policy links. No block wrapper needed.

```
© FedEx 1995–2026

- [Site Map](https://www.fedex.com/en-us/sitemap.html)
- [Terms of Use](https://www.fedex.com/en-us/terms-of-use.html)
- [Privacy & Security](https://www.fedex.com/en-us/trust-center.html)
- [Ad Choices](https://www.fedex.com/en-us/trust-center/privacy.html#section7)
```

The JS adds `©` automatically if the paragraph doesn't start with one.

> **Rules:**
> - Copyright must be a plain paragraph (`<p>`), not a heading or list item.
> - Legal links render inline with `|` separators; keep to **4–6 items**.
> - Do **not** wrap this in a Columns block — the CSS handles the flex layout automatically.
> - This section renders as a full-width purple bar across all viewports.

---

## Mobile behaviour

On screens narrower than **900 px**:

- Each link column (except Follow FedEx) collapses into an accordion. The H2 becomes the toggle button with a `+`/`−` indicator.
- The Our Company two-column sub-layout reverts to a single column.
- The Language dropdown keeps its toggle but the options list renders inline (not absolutely positioned).
- The Follow FedEx strip remains visible with icons wrapping as needed.

---

## Local development fixture

`footer.plain.html` at the repo root is a legacy local fixture (the block loads `/fragments/footer`, which is now published in the CMS). It is excluded from deployment via `.hlxignore` and can be deleted.
