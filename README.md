# Fake Identity Generator (Offline)

<p align='center'>
  <a href='README.md'>English</a> &nbsp;·&nbsp; <a href='README_zh.md'>中文</a>
</p>

<p align='center'>
  <img alt='Runtime' src='https://img.shields.io/badge/runtime-100%25%20offline-blue'>
  <img alt='Dependencies' src='https://img.shields.io/badge/dependencies-zero-brightgreen'>
  <img alt='i18n' src='https://img.shields.io/badge/i18n-%E4%B8%AD%E6%96%87%20%7C%20English-orange'>
  <img alt='Countries' src='https://img.shields.io/badge/countries-9-important'>
</p>

A fully **offline**, **zero-dependency** web application that generates realistic-looking, synthetic virtual identities for 9 countries/regions. All data is randomly generated in the browser — **no network requests are ever made**, no build step is required, and it runs straight from the file system.

> ⚠️ **Disclaimer** — Everything produced by this tool is fictional, randomly synthesized data for **testing, prototyping, and demonstration only**. It is **not** real personal information, and the generated identifiers (ID numbers, SSNs, card numbers, etc.) are **illustrative** and must **never** be used to impersonate a real person or for any fraudulent purpose.

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Browser Support](#browser-support)
- [Supported Countries](#supported-countries)
- [Generated Profile Fields](#generated-profile-fields)
- [Realism Engine](#realism-engine)
  - [Birth Date & Age](#birth-date--age)
  - [Body Metrics](#body-metrics)
  - [Occupation by Age](#occupation-by-age)
  - [Company by Age](#company-by-age)
  - [Credit Cards](#credit-cards)
  - [Country-Specific Identifiers](#country-specific-identifiers)
- [Credit Card Networks](#credit-card-networks)
- [Internationalization](#internationalization)
- [Theme (Light / Dark / System)](#theme-light--dark--system)
- [Copy & CSV Export](#copy--csv-export)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Developer Guide: Adding a New Country](#developer-guide-adding-a-new-country)
- [API Reference](#api-reference)
- [Privacy & Security](#privacy--security)
- [Known Limitations](#known-limitations)
- [License](#license)

---

## Features

- **100% offline & dependency-free.** Pure HTML/CSS/JavaScript (classic scripts loaded with `defer`), so it works directly from `file://` with no server, bundler, or npm install.
- **9 countries/regions** with locale-appropriate names, surnames, given names, regions, cities, streets, companies, occupations, and email domains.
- **Cascading location selectors** — *Country → Region/State → City → District (optional)*. Municipalities, Special Administrative Regions, and Taiwan are already district-level and need no further selection.
- **Bilingual UI (中文 / English)** with automatic detection of the visitor's system language and persistence via `localStorage`.
- **Light / Dark / System theme** driven by a design-token CSS variable system with smooth transitions and no flash-of-wrong-theme (FOUC) on load.
- **Age-aware generation** — birth dates, body metrics (height/weight), occupations, employers, and credit cards are all consistent with the generated age.
- **Valid-structure identifiers** — Chinese ID cards use the real GB 11643-1999 (mod 11-2) checksum; card numbers pass the **Luhn** algorithm; SSN/NINO/My Number/Steuer-ID/NIR/Codice Fiscale/DNI follow their respective format conventions (all demo/illustrative).
- **Flexible controls** — gender, age mode (random / exact / range), email domain (random per country / popular webmail / custom), card network, and batch count (1/3/5/10).
- **Copy All** (Clipboard API with an `execCommand` fallback) and **Export CSV** (UTF-8 BOM, RFC-style quoting/escaping) for quick reuse in tests and demos.

---

## Quick Start

No installation or build is required.

1. Download / clone this repository.
2. Open `index.html` in any modern browser (double-click works — `file://` is fully supported).
3. Pick a country, adjust the controls, and click **Generate**.

Optionally serve it with any static file server:

```bash
# Python
python3 -m http.server 8080
# then visit http://localhost:8080

# or Node
npx serve .
```

---

## Browser Support

| Feature | Minimum |
| --- | --- |
| Core generation | Any browser with ES5 + `Array`/`String` support |
| Clipboard copy | `navigator.clipboard` (with `document.execCommand('copy')` fallback) |
| Dark mode auto-detect | `window.matchMedia('(prefers-color-scheme: dark)')` |
| Persistence | `localStorage` (gracefully degrades if blocked) |

Tested conceptually on evergreen desktop and mobile browsers.

---

## Supported Countries

| Code | Country | Locale | Identifier field | Notes |
| --- | --- | --- | --- | --- |
| `china` | China (中国) | `zh` | 身份证号 (ID card) | 6-digit region code + checksum; district-level cities for municipalities/SARs/Taiwan |
| `us` | United States | `en` | SSN (demo) | Format `AAA-BB-CCCC`; excludes area `666` and `900+` |
| `japan` | Japan (日本) | `ja` | My Number (demo) | 12 digits; Japanese given/surnames |
| `uk` | United Kingdom | `en` | NINO (demo) | e.g. `AB123456C` |
| `germany` | Germany (德国) | `de` | Steuer-ID (demo) | 11 digits, grouped `XX XXX XXX XXX` |
| `france` | France | `fr` | NIR (demo) | Encodes gender + birth date |
| `italy` | Italy (意大利) | `it` | Codice Fiscale (demo) | |
| `spain` | Spain (西班牙) | `es` | DNI (demo) | |
| `canada` | Canada | `en` | SIN (demo) | Format `XXX-XXX-XXX`; postal code `A1B 2C3` |

> Note: every identifier above is **synthetic and for demonstration only** — it follows the public format/checksum conventions but is **not** a valid, issued number.

---

## Generated Profile Fields

There are two profile 'shapes':

**Western profile** (built by `util.buildWestern`, used by `us`, `uk`, `japan`, `germany`, `france`, `italy`, `spain`, `canada`):

| Field key | Label (EN) | Label (中文) | Notes |
| --- | --- | --- | --- |
| `lastName` | Last Name | 姓 | |
| `firstName` | First Name | 名 | |
| `gender` | Gender | 性别 | `male` / `female` |
| `birthDate` | Date of Birth | 出生日期 | `YYYY-MM-DD` |
| `age` | Age | 年龄 | derived from birth date |
| `height` | Height | 身高 | e.g. `172 cm` |
| `weight` | Weight | 体重 | e.g. `68 kg` |
| `phone` | Phone | 手机号 | locale prefix + random |
| `email` | Email | 邮箱 | from email pool / custom domain |
| `username` | Username | 用户名 | ASCII handle |
| `password` | Password | 密码 | 10-char random |
| `id` | ID / SSN / NINO / … | 证件号 / SSN(示意) / … | country-specific (label varies) |
| `address` | Address | 地址 | street + city (+ region) |
| `zip` | Postal Code | 邮编 | country-specific format |
| `company` | Company | 公司 | only for working-age adults |
| `occupation` | Occupation | 职业 | age-category or job from pool |
| `cardType` | Card Type | 信用卡类型 | only for adults ≥ 18 |
| `cardNumber` | Card Number | 卡号 | Luhn-valid |
| `expiry` | Expiry | 有效期 | `MM/YY` |
| `cvv` | CVV | 安全码 | 3–4 digits |

**China profile** (`china` module, uses a combined name):

| Field key | Label (EN) | Label (中文) |
| --- | --- | --- |
| `fullName` | Full Name | 姓名 |
| `gender` | Gender | 性别 |
| `birthDate` | Date of Birth | 出生日期 |
| `age` | Age | 年龄 |
| `height` | Height | 身高 |
| `weight` | Weight | 体重 |
| `idCard` | ID Number | 身份证号 |
| `phone` | Phone | 手机号 |
| `email` | Email | 邮箱 |
| `username` | Username | 用户名 |
| `password` | Password | 密码 |
| `address` | Address | 地址 |
| `company` | Company | 公司 (working-age only) |
| `occupation` | Occupation | 职业 |
| `cardType` / `cardNumber` / `expiry` / `cvv` | Card fields | 信用卡相关 (adults ≥ 18 only) |

Fields are stored internally as `[key, value]` pairs and localized at render time according to the active UI language, so the same data can be displayed in either 中文 or English.

---

## Realism Engine

All randomness is funneled through `util` helpers so that generated records stay internally consistent.

### Birth Date & Age

- `ageMode = random` → birth date uniformly sampled between **1965** and **2004**.
- `ageMode = exact` → a birth date is chosen so that `util.ageFrom(date)` **exactly equals** the requested age (birthday is guaranteed to have already occurred this year).
- `ageMode = range` → an age is drawn from the inclusive range (min/max auto-swapped if reversed), then the exact birth date is derived.
- `util.ageFrom(date)` computes the current age with correct month/day handling.

### Body Metrics

`util.bodyMetrics(gender, age)` returns a `[heightCm, weightKg]` pair scaled by a growth factor:

- infants/toddlers have proportionally small heights (no 'baby with an adult body');
- ages 3–17 interpolate toward adult height;
- adults use a gender-based reference height with variation;
- seniors (≥ 70) lose a small amount of height;
- weight is estimated from an age-appropriate BMI × height².

### Occupation by Age

`util.occupationForAge(age, cfg)` enforces age-appropriateness:

| Age | Category | Behavior |
| --- | --- | --- |
| < 6 | child (学龄前儿童 / Child) | no occupation |
| 6 – 17 | student (学生 / Student) | no occupation |
| 18 – 64 | working adult | random job drawn from the locale's occupation pool |
| ≥ 65 | retired (退休 / Retired) | no occupation |

The category **code** (`child` / `student` / `retired`) is stored and localized at render time, while adult job names come from the country's native-language occupation pool and are **not** translated.

### Company by Age

`util.companyForAge(age, cfg)` returns an employer **only** for working-age adults (18–64). Minors, preschoolers, students, and retirees get **no** `company` field — avoiding 'a 5-year-old employed at a corporation' mismatches.

### Credit Cards

`util.creditCardForAge(age, opts)` emits the four card fields **only** when `age ≥ 18`. Minors receive none. When generated:

- the card network is chosen from `opts.cardType` or picked at random;
- the number is built from a valid IIN/BIN prefix and padded, then a **Luhn** check digit is appended (`util.luhnCheckDigit`);
- expiry is `MM/YY` between 2025 and 2034; CVV length depends on the network (3 digits, 4 for American Express);
- display formatting follows network conventions (AmEx → `4-6-5`, others → `4-4-4-4`).

### Country-Specific Identifiers

- **China `idCard`** — `util.makeChinaID(region6, date)` formats `regionCode(6) + birthDate(8) + sequence(3) + checksum(1)` and computes the check digit with `util.chinaIDChecksum` using the GB 11643-1999 (mod 11-2) weights `[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2]` and remainder map `['1','0','X','9','8','7','6','5','4','3','2']`.
- **US `ssn`** — `AAA-BB-CCCC`; area avoids `000`, `666`, and `900–999`.
- **UK `nino`** — two letters + 6 digits + one suffix letter (`A–D`).
- **Japan `myNumber`** — 12 digits.
- **Germany `taxId` (Steuer-ID)** — 11 digits, displayed in `XX XXX XXX XXX` groups.
- **France `nir`** — encodes gender and birth date per the French NIR convention.
- **Italy `cf`** — Codice Fiscale style.
- **Spain `dni`** — DNI style.
- **Canada `sin`** — `XXX-XXX-XXX`; postal code follows `A1B 2C3`.

---

## Credit Card Networks

The `util.cardTypes` registry ships with **~60** global and regional card networks (label, IIN/BIN prefixes, length, CVV length). A selection:

Visa, Visa Electron, Mastercard, American Express, Discover, JCB, UnionPay (银联), Diners Club, Carte Blanche, Maestro, RuPay, Mir (Мир), Troy, Elo, Dankort, Interac, Verve, UATP, Laser, Switch, Solo, Bancontact, EnRoute, Voyager, InstaPayment, PostePay, SberCard, NAPS, KCP, MEPS, BC Card, PolCard, Girocard, Carte Bancaire, LankaPay, NepalPay, BCA, and more.

Brand display names are localized through `i18n.card(key)`.

---

## Internationalization

`assets/js/i18n.js` is the single source of truth for UI text and field labels.

- **Languages:** `zh` (中文) and `en` (English). System language is auto-detected from `navigator.languages` (falls back to 中文).
- **Persistence:** the chosen preference (`system` / `zh` / `en`) is saved to `localStorage['fakeid.lang']`.
- **DOM translation:** `i18n.apply(root)` rewrites any element carrying one of:
  - `data-i18n` → `textContent`
  - `data-i18n-ph` → `placeholder`
  - `data-i18n-title` → `title`
  - `data-i18n-html` → `innerHTML` (used for the disclaimer)
- **Field & value localization:** `i18n.field(key)`, `i18n.gender(code)`, `i18n.occLabel(code)`, `i18n.card(key)`, and `i18n.countryLabel(code)` keep generated output consistent with the active language.
- **Observer:** `i18n.onChange(cb)` lets the UI re-render on language switch without reload.

---

## Theme (Light / Dark / System)

`assets/js/theme.js` manages a `system` / `light` / `dark` preference persisted in `localStorage['fakeid.theme']`.

- `system` → no `data-theme` attribute is set; CSS `@media (prefers-color-scheme: dark)` decides automatically (and tracks live OS changes).
- `light` / `dark` → an explicit `data-theme` attribute overrides the OS preference.
- A tiny inline script in `<head>` applies the saved explicit theme **before first paint** to avoid a flash of the wrong theme (FOUC).
- Design tokens (colors, borders, shadows) are centralized as CSS variables in `assets/css/styles.css`, giving a consistent slate + blue/emerald palette across both modes with smooth color transitions.

---

## Copy & CSV Export

- **Copy All** — builds a plain-text block of all generated records (localized to the active language) and writes it via `navigator.clipboard.writeText`, falling back to a hidden `<textarea>` + `document.execCommand('copy')` on unsupported browsers.
- **Export CSV** — emits a UTF-8 file prefixed with a BOM (`﻿`) so Excel renders Chinese correctly, with proper RFC-style quoting/escaping of fields containing commas, quotes, or newlines. Headers are the localized field labels.

---

## Project Structure

```text
.
├── index.html                 # App shell; loads scripts in dependency order (defer)
└── assets
    ├── css
    │   └── styles.css          # Design-token theming (light/dark/system)
    └── js
        ├── i18n.js             # UI text, field labels, card/country/occupation names
        ├── util.js             # Registry + generation helpers (no dependencies)
        ├── generator.js        # FakeID.generate / FakeID.listCountries
        ├── theme.js            # Light/dark/system preference + observer
        ├── app.js              # UI orchestration (cascading selects, render, copy, export)
        └── data
            ├── occupations.js  # Locale occupation pools (util.occupationPool)
            ├── maildomains.js  # Locale email-domain pools (util.emailPool)
            ├── china.js        # registerCountry('china', …) — bespoke make()
            ├── us.js           # registerCountry('us', …)   — buildWestern
            ├── japan.js        # registerCountry('japan', …)
            ├── uk.js           # registerCountry('uk', …)
            ├── germany.js      # registerCountry('germany', …)
            ├── france.js       # registerCountry('france', …)
            ├── italy.js        # registerCountry('italy', …)
            ├── spain.js        # registerCountry('spain', …)
            └── canada.js       # registerCountry('canada', …)
```

---

## Architecture

The app is built around a single global namespace, **`window.FakeID`**, populated by small, order-independent modules loaded with `defer` (so execution order follows document order and `file://` works without modules/CORS).

| Module | Responsibility |
| --- | --- |
| `i18n.js` | Dictionaries (zh/en) for UI strings, field labels, card brands, country names, age-category occupation labels; `apply()`, `t()`, `field()`, `card()`, `gender()`, `countryLabel()`, `occLabel()`, `setLang()`, `onChange()`. |
| `util.js` | The engine: RNG helpers, date/age logic, body metrics, occupation/company-by-age, password/handle generation, China ID checksum, email/pool resolvers, the shared `buildWestern()` profile builder, the `cardTypes` registry + Luhn logic, and the **country registry** (`registerCountry`). |
| `generator.js` | Public entry points `FakeID.generate(code, opts)` and `FakeID.listCountries()`. |
| `theme.js` | Theme preference + observer; writes `data-theme` on `<html>`. |
| `app.js` | Wires the DOM: cascading Country→Region→City→District selects, control synchronization, rendering, copy/export, and language/theme switching. |
| `data/*.js` | One `registerCountry(code, cfg)` call each. `occupations.js` and `maildomains.js` expose shared, locale-keyed pools. |

**Extension model:** a country is just a data file that calls `FakeID.registerCountry('code', { label, locale, regions, make })`. The UI discovers it automatically through `FakeID.listCountries()` — no changes to `app.js` or `index.html`'s control logic are needed beyond adding the `<script>` tag.

---

## Developer Guide: Adding a New Country

1. **Create the data module** under `assets/js/data/`, e.g. `assets/js/data/example.js`:

```js
(function (global) {
  'use strict';
  var FakeID = global.FakeID, util = FakeID.util;

  var surnames    = ['Surname1', 'Surname2'];
  var givenMale   = ['MaleName1', 'MaleName2'];
  var givenFemale = ['FemaleName1', 'FemaleName2'];
  // regions → cities → (optional) districts
  var regions = [
    { name: 'Region A', abbr: 'RA', cities: ['City X', 'City Y'] },
    { name: 'Region B', cities: [{ name: 'City Z', districts: ['District 1'] }] }
  ];
  var streets   = ['Main St', 'Oak Ave'];
  var companies = ['Acme Ltd', 'Globex Inc'];
  var jobs      = util.occupationPool('en'); // or 'zh','de','fr','it','es','ja'

  FakeID.registerCountry('ex', {
    label: 'Example',          // shown in the country <select> (localized in i18n.COUNTRY)
    locale: 'en',
    regions: regions,
    make: function (opts) {
      var cfg = {
        regions: regions,
        surnames: surnames, givenMale: givenMale, givenFemale: givenFemale,
        domains: util.emailPool('en'),
        phonePrefix: ['010'], phoneLen: 7,
        idLabel: 'id',
        idFn: function () { return 'ID-' + util.pad(util.randInt(0, 999999), 6); },
        addressFn: function (u, ctx) {
          var city = ctx.city ? (typeof ctx.city === 'string' ? ctx.city : ctx.city.name) : '';
          return u.randInt(1, 199) + ' ' + u.pick(streets) + ', ' + city;
        },
        zipFn: function (u) { return u.pad(u.randInt(0, 99999), 5); },
        companies: companies, jobs: jobs, locale: 'en'
      };
      return util.buildWestern(cfg, opts); // shared western-profile builder
    }
  });
})(window);
```

2. **Register the locale strings** (country name + any new occupation/job text) in `assets/js/i18n.js` — add the code to both the `zh` and `en` `COUNTRY` maps so the selector label localizes correctly.

3. **Load the script** by adding it to `index.html` in `defer` order, after `util.js` / `occupations.js` / `maildomains.js` and before `generator.js`:

```html
<script defer src='assets/js/data/example.js'></script>
```

That's it — the new country appears in the dropdown with full cascading, i18n, theming, copy, and CSV export support, with no other code changes.

---

## API Reference

### `window.FakeID`

| Member | Signature | Description |
| --- | --- | --- |
| `generate` | `generate(code, opts) → Array<[key, value]>` | Generate one profile. See `opts` below. |
| `listCountries` | `listCountries() → Array<{code,label,hasStates,states,hasRegions,regions}>` | List registered countries. |
| `countries` | `Object<code, cfg>` | Raw registry. |
| `registerCountry` | `registerCountry(code, cfg)` | Register a country/region. |
| `util` | `Object` | The engine (see below). |
| `i18n` | `Object` | Internationalization API (see below). |
| `theme` | `Object` | Theme API (see below). |

### Generation options (`opts`)

| Key | Values | Effect |
| --- | --- | --- |
| `gender` | `'random'` \| `'male'` \| `'female'` | Gender selection. |
| `cardType` | `'random'` \| card key | Card network, or random. |
| `region` | region name | Restrict to a region/state. |
| `city` | city name | Restrict to a city. |
| `district` | district name | Restrict to a district (where applicable). |
| `ageMode` | `'random'` \| `'exact'` \| `'range'` | Age strategy. |
| `ageExact` | number | Used when `ageMode === 'exact'`. |
| `ageMin` / `ageMax` | number | Used when `ageMode === 'range'`. |
| `emailDomain` | string | Override the country-default email domain (leading `@` trimmed). |

### `FakeID.util` (selected)

`randInt(min,max)`, `pick(arr)`, `chance(p)`, `pad(n,len)`, `randomDate(y1,y2)`, `formatDate(d,sep)`, `ageFrom(d)`, `deaccent(s)`, `birthDate(opts)`, `birthDateForAge(age)`, `bodyMetrics(gender,age)`, `occupationForAge(age,cfg)`, `companyForAge(age,cfg)`, `password(len)`, `randomHandle(len)`, `chinaIDChecksum(body17)`, `makeChinaID(region6,date)`, `emailDomain(opts,defaults)`, `buildWestern(cfg,opts)`, `emailPool(locale)`, `occupationPool(locale)`, `cardTypes`, `cardTypeKeys()`, `luhnCheckDigit(body)`, `creditCard(opts)`, `formatCardNumber(num,key)`, `creditCardFields(opts)`, `creditCardForAge(age,opts)`, `registerCountry(code,cfg)`.

### `FakeID.i18n`

`SUPPORTED`, `lang()`, `pref()`, `detectSystemLang()`, `t(key)`, `field(key)`, `countryLabel(code)`, `occLabel(code)`, `card(key)`, `gender(code)`, `setLang(lang, persist?)`, `onChange(cb)`, `apply(root)`.

### `FakeID.theme`

`SUPPORTED` (`['system','light','dark']`), `pref()`, `systemPrefersDark()`, `isDark()`, `set(theme)`, `onChange(cb)`.

---

## Privacy & Security

- **No network access.** The page makes zero external requests (no CDNs, no analytics, no fonts, no telemetry). Open the Network tab and you will see nothing leave the browser.
- **No storage of generated data.** Records exist only in the DOM until you copy or export them; nothing is written to a server or shared.
- **Synthetic only.** All values are randomly generated; identifiers follow public format conventions but are **not** valid issued numbers and must not be used to represent real individuals.

---

## Known Limitations

- Occupation and name pools are **curated samples**, not exhaustive census data; they are illustrative, not statistically representative.
- The Chinese (`zh`) occupation pool still contains a few non-localized placeholder entries that should be cleaned up.
- Identifiers are **demo/illustrative** — they match public formats/checksums but are not validated or issuable.
- No automated tests or CI are included in this repository yet.

---

## License

**No `LICENSE` file is currently present in this repository.** Before redistributing or forking, the maintainer should add an explicit license (for example, MIT) to clarify terms of use. Until then, usage is governed by default copyright law.
