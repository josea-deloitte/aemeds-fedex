# FedEx Homepage on Edge Delivery Services

Migration of the FedEx homepage (fedex.com/en-us/home.html) to AEM Edge Delivery Services, based on the AEM boilerplate with content authored in da.live.

## Environments
- Preview: https://main--aemeds-fedex--josea-deloitte.aem.page/
- Live: https://main--aemeds-fedex--josea-deloitte.aem.live/

## Authoring guide

Each block has a README describing exactly how authors structure it in da.live. The homepage is composed top to bottom as:

| Order | Block | Authoring doc |
| --- | --- | --- |
| — | Header (from the shared `/nav` document) | [blocks/header](blocks/header/README.md) |
| 1 | Hero — campaign banner, page H1, LCP image | [blocks/hero](blocks/hero/README.md) |
| 2 | Tracking Widget — Rate & Ship / Track / Locations tabs | [blocks/tracking-widget](blocks/tracking-widget/README.md) |
| 3 | Quick Links — circular icon shortcuts | [blocks/quick-links](blocks/quick-links/README.md) |
| 4 | Cards (promo) — marketing card grid | [blocks/cards](blocks/cards/README.md) |
| 5 | Carousel — swipeable service promos | [blocks/carousel](blocks/carousel/README.md) |
| 6 | CTA Banner — full-bleed purple call to action | [blocks/cta-banner](blocks/cta-banner/README.md) |
| — | Footer (from the shared `/footer` document) | [blocks/footer](blocks/footer/README.md) |

General authoring rules:

- Separate sections with a horizontal rule (`---`); the Hero must be the first section and the Tracking Widget the second so the card overlaps the hero on desktop.
- **Bold links** render as orange buttons; plain links render as text links.
- Every image needs alt text.
- Icons use the `:name:` syntax and live in the [icons/](icons/) folder.

## Documentation

Before using the aem-boilerplate, we recommand you to go through the documentation on https://www.aem.live/docs/ and more specifically:
1. [Developer Tutorial](https://www.aem.live/developer/tutorial)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
2. Start the AEM Proxy with the local test content: `aem up --html-folder drafts`
3. Open the sample homepage at `http://localhost:3000/drafts/home`

The `drafts/` folder holds test pages and draft fragments (e.g. `/drafts/header-test` exercises the full FedEx header navigation). Header and footer content loads from the published CMS documents at `/fragments/nav` and `/fragments/footer`.
