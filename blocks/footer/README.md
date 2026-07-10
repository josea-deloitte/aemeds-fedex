# Footer

The site-wide footer: link columns on a light background plus a legal bar. Like the header, it is **not authored per page** — it loads from a shared document.

## Where to author

Edit the document at `/footer` (site root). A page can override it with a `footer` value in its Metadata table.

## Document structure

The `/footer` document has **two sections separated by a horizontal rule (**`---`**)**:

### Section 1 — Link columns

Use a `Columns` block. Each column cell holds a Heading 2 and a bulleted list of links:


| Columns                                                                                                                                   |                                                                                                             |                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ## Our Company - [About FedEx](/en-us/about.html) - [Careers](/en-us/careers.html) - [Investor Relations](/en-us/investor-relations.html) | ## More From FedEx - [FedEx Compatible](/en-us/compatible.html) - [Developer Portal](/en-us/developer.html) | ## Follow FedEx - [Facebook](https://www.facebook.com/FedEx) - [X](https://x.com/FedEx) - [LinkedIn](https://www.linkedin.com/company/fedex) |


Column headings render as small uppercase labels; links are gray and turn purple on hover.

### Section 2 — Legal bar (always the last section)

A paragraph with the copyright notice, followed by a bulleted list of policy links. It renders as a slim bar with a top border — copyright on the left, links flowing horizontally on the right:

> © FedEx 1995–2026
>
> - [Site Map](/en-us/site-map.html)
> - [Terms of Use](/en-us/terms-of-use.html)
> - [Privacy & Security](/en-us/privacy.html)



## Local development

Until real `/footer` content exists in the CMS, the repo root contains a `footer.plain.html` fixture served locally at the same path. It is excluded from deployment via `.hlxignore`; delete it once the CMS document is published.