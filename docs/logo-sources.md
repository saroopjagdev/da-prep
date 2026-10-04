# Employer logos on the home banner

Files live in `public/logos/<slug>.<svg|png|jpg>`. The banner shows the logo alone (its name is the image's alt text) when a file exists for the employer, and the name as text otherwise. Prefer the full logo with the name in it; use a symbol only when the employer has no wordmark.

**Where they came from.** Every logo is the one in the employer's Wikipedia infobox, fetched through the public MediaWiki API by `scripts/fetch-wikipedia-logos.mjs`. SVG is kept as is; a bitmap-only logo is saved at the 600px width Wikipedia serves (Arup, FCA, Lloyds). Three infobox images were a photo or a symbol only, so the script names a better file for them: BMW (BMW.svg), Bank of England (the wordmark file) and Rolls-Royce (the Group logo). All 41 employers have one.

**Rights.** These marks belong to their owners. They are shown to say which employers have guides here, not to suggest any affiliation. If an employer asks for its logo to be removed, delete its file and the banner falls back to the name. To use an employer's own brand-page file instead, save it over `public/logos/<slug>.svg`.

To refresh: `node scripts/fetch-wikipedia-logos.mjs <slug>`, then check how it looks. The older `scripts/fetch-logos.mjs` (employer websites) is kept for reference but is no longer used.
