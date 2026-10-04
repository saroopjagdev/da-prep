# Employer logos on the home banner

Files live in `public/logos/<slug>.<svg|png|jpg>`. The banner shows a logo when a file exists for the employer and its name otherwise.

**Where they came from**
- Barclays, HSBC, Goldman Sachs, Deutsche Bank, Bank of America, Rolls-Royce, Airbus, Google, BT, Cisco, BMW: the Simple Icons set (CC0 artwork).
- The others were fetched by `scripts/fetch-logos.mjs` from the employer's own public website: the Organization logo in the page's JSON-LD, an SVG icon, or its apple-touch-icon (Amazon, Bank of England, BDO, BNY, Capgemini, Citi, Experian, EY, FCA, Grant Thornton, JLR, J.P. Morgan, KPMG, Lloyds, Rothschild, Santander, UBS).

**Names only (no usable logo found)**: Arup, AtkinsRéalis, Aviva, BAE Systems, Deloitte, IBM, Forvis Mazars, Metropolitan Police, Microsoft, Morgan Stanley, NatWest, PwC. Their sites blocked automated downloads or only offered a social-media image, a tab icon, or a mascot (AtkinsRéalis, Forvis Mazars, IBM and NatWest were fetched, looked wrong, and are rejected in the script). To add one, save a file you are permitted to use as `public/logos/<slug>.svg` or `.png` (for example from the employer's brand or press page).

**Rights.** These marks belong to their owners. They are shown to say which employers have guides here, not to suggest any affiliation. If an employer asks for its logo to be removed, delete its file and the banner falls back to the name.

To refresh: delete a file and run `node scripts/fetch-logos.mjs <slug>`, then check how it looks.
