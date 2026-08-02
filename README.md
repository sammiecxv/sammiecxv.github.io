# ThreadTrace

A prototype platform for EU Digital Product Passports (DPPs) for garments.
There is a Node/Express REST API in `server/`, and two web apps in `public/`
that get all their data from it: a consumer app at `/consumer` and a business
app at `/business`. Both run in a phone-sized frame. They are separate pages
that share the one API, and you switch between them from the sign-in screen.

## Run it

```bash
cd fullstack
npm install
npm start
```

Then open http://localhost:3000, which redirects to `/consumer`. The business
app is at `/business`. `npm start` builds the client first, so there is no CDN
to reach and it works offline once `npm install` has run.

For development, this rebuilds the client and restarts the server on changes:

```bash
npm run dev
```

To build without starting the server:

```bash
npm run build
```

## How it fits together

```
fullstack/
├── server/
│   ├── server.js            the Express app: REST API + serves the client
│   ├── build/
│   │   ├── build-client.mjs compiles the JSX into public/dist
│   │   └── vendor-entry.js  entry point for the React bundle
│   ├── db/
│   │   ├── schema.sql       the database schema
│   │   ├── migrate.js       builds threadtrace.db from the seed
│   │   └── db.js            data access, falls back to the seed file
│   └── data/
│       ├── seed.js          all the domain data
│       ├── provenance.js    the signed hash chain
│       └── image-slots.json saved product photos
└── public/
    ├── consumer.html        the /consumer page and its script list
    ├── business.html        the /business page and its script list
    ├── consumer-root.jsx    mounts ConsumerApp
    ├── business-root.jsx    mounts SupplierMobileApp
    ├── styles.css           colours, fonts, spacing
    ├── shell.css            the phone frame
    ├── _ds_bundle.js        design system components (generated, see Notes)
    ├── app/shell.jsx        StatusBar, useFitScale, AppSwitch
    ├── app/*.jsx            the screens
    └── dist/                build output, git-ignored
```

Each page only loads what it needs. Nothing from the supplier screens is sent
to `/consumer`, and nothing from the consumer screens is sent to `/business`.
The control that moves you between them is `AppSwitch` in `app/shell.jsx`. It
sits on both sign-in screens and navigates to the other page.

The JSX is compiled ahead of time rather than in the browser.
`server/build/build-client.mjs` runs each file through esbuild and writes the
result into `public/dist`, which is what the HTML loads. React, ReactDOM and
the QR code library are ordinary npm dependencies bundled into
`public/dist/vendor.js`. `_ds_bundle.js` is not part of this build.

None of the data lives in the client. Each page fetches `/api/bootstrap.js`,
which puts the dataset on `window.TT`, and the screens read from there. Edit
`server/data/seed.js`, restart, reload, and the UI follows.

Two finished screens are compiled but nothing mounts them yet:
`app/supplier.jsx` (`window.SupplierApp`, the desktop console) and
`app/passport.jsx` (`window.WebPassport`, a web version of the passport).
Each would need its own page to be reachable.

## Database

The API reads from a SQLite database in `server/db/`. `npm install` pulls in
`better-sqlite3`, and the database builds itself from the seed the first time
you run `npm start`. You can also build it directly:

```bash
npm run migrate     # writes server/db/threadtrace.db and prints row counts
```

`server/db/schema.sql` is the source of truth for the schema: brands,
passports, materials, evidence, signing authorities, the provenance ledger,
certificates, the operations ledger, service jobs and wardrobe. Anything that
needs joining or checking is normalised with foreign keys, using
`ON DELETE CASCADE` and `PRAGMA foreign_keys = ON`. The one exception is a
passport's editorial content, which nests too deeply to be worth splitting up,
so it sits in a `doc` JSON column. `docs/er-diagram.html` has the ER diagram
and the reasoning.

If `better-sqlite3` isn't installed the server falls back to reading
`data/seed.js` directly, so the app still runs. `GET /api/health` tells you
which source is active.

The provenance ledger is a real table, not something rebuilt in memory.
`provenance_event` holds every signed event with its `prev_hash`,
`record_hash` and `signature`, and `/verify` reads those rows back and
re-derives the chain from them. Public keys live in the `authority` table.
Private keys are kept in a separate keystore file, which would be an HSM in
production.

## REST API

Base URL: `http://localhost:3000/api`

| Method | Route | Returns |
|--------|-------|---------|
| GET  | `/health` | service status |
| GET  | `/bootstrap` | entire dataset (used by the client) |
| GET  | `/passports` | all garment passports (summary) |
| GET  | `/passports/:slug` | one full passport |
| GET  | `/passports/:slug/materials` | its material breakdown |
| GET  | `/passports/:slug/tiers` | computed honesty-tier percentages |
| GET  | `/passports/:slug/story` | story chapters + brand voices |
| GET  | `/passports/:slug/chain` | the signed provenance hash chain |
| GET  | `/passports/:slug/verify` | verify the chain (`?tamper=<seq>` to simulate an attack) |
| GET  | `/authorities` | issuer public keys (Ed25519, JWK + PEM) |
| GET  | `/products` | business operations ledger |
| GET  | `/products/:sku` | one ledger row |
| GET  | `/wardrobe` | consumer wardrobe |
| GET  | `/resale` | resale market listings |
| GET  | `/rewards` | keeper-rewards state |
| GET  | `/certs` | certifications + standards mapping |
| GET  | `/compliance` | DPP compliance checklist |
| GET  | `/service-jobs` | repair / maintenance / refurb jobs |
| POST | `/service-jobs/:id/advance` | move a job to its next status |

Some examples:

```bash
curl http://localhost:3000/api/passports
curl http://localhost:3000/api/passports/365-midweight-hoodie-crocus-purple/tiers
curl http://localhost:3000/api/passports/365-midweight-hoodie-crocus-purple/verify
curl "http://localhost:3000/api/passports/365-midweight-hoodie-crocus-purple/verify?tamper=2"
curl -X POST http://localhost:3000/api/service-jobs/SVC-118/advance
```

The passport slugs are `365-midweight-hoodie-crocus-purple`,
`clean-eileen-black-crosshatch`, `mother-lover-t-shirt`,
`falabella-tiny-tote-grey` and `campo-leather-white-black`.

## Verifiable provenance

This is the part I spent most of the time on. Each passport's chain of custody
is a signed hash chain, built in `server/data/provenance.js`:

```
record[i].payloadHash = SHA-256(canonical event payload)
record[i].recordHash  = SHA-256(seq ‖ payloadHash ‖ record[i-1].recordHash)
record[i].signature   = Ed25519_sign(issuerPrivKey, recordHash)
```

Every supply chain event is signed by whoever attested it, whether that is the
brand, spinner, mill, atelier or certifier. Each has its own Ed25519 keypair.
The garment tag carries only the head hash of the chain. Scanning it calls
`/verify`, which re-derives every hash and checks every signature.

That gives you two things. Because each record commits to the hash of the one
before it, inserting, deleting or reordering an event breaks every hash after
the splice point. And because a consumer only ever holds public keys, they can
check who signed an event without being able to forge one.

The checking happens on the phone rather than on the server. The consumer app
downloads the chain and the published public keys from `GET /api/authorities`,
then re-checks every hash and signature in the browser using WebCrypto
(`public/app/provenance-client.js`). This matters because it means the server
does not have to be trusted: if it served a forged claim, or simply lied about
the verdict, the phone would still catch it. The tamper demo changes the
downloaded chain locally to show this.

Adding `?tamper=<seq>` to `/verify` simulates someone quietly editing one event
after it was signed. The response comes back with `valid:false` and
`brokenAt:<seq>`, and everything after that point fails too. In the consumer
app this shows up as a "Verifying provenance" screen after each scan.

### Threat model

| Attack | Caught by |
|---|---|
| Counterfeit / cloned tag | head hash won't match a signed chain |
| Silent edit of a claim | `payloadHash` changes, so `recordHash` and signature break |
| Inserted / deleted / reordered event | linkage breaks at the splice point |
| Forged attestation | signature check fails, since the attacker has no private key |

Not covered, and left for future work: key distribution and PKI, certificate
revocation, replay across serials, and anchoring the head hash on-chain.

### Tests

The test suite uses Node's built-in runner and has no dependencies. It checks
that an untouched chain verifies, and that each of the attacks above (edit,
forge, delete, insert, reorder, replay under the wrong serial) is caught at the
right event.

```bash
npm test        # runs tests/provenance.test.js and tests/database.test.js
```

The database tests migrate a fresh database, check referential integrity, and
confirm that a chain read back out of storage still verifies and still detects
tampering. They skip themselves if `better-sqlite3` isn't installed.

### Evaluation

`npm run bench` times verification against chain length and chain size, writes
`bench/results.json` and prints a table. `bench/evaluation.html` charts it
along with the method and what the numbers mean. Verification comes out linear
in the number of events, at roughly a few hundred microseconds each, so a
realistic passport verifies in a few milliseconds. The tag itself only ever
carries the 32-byte head hash.

## Notes

- The service desk `/advance` route mutates in memory, so those changes are
  lost on restart.
- Authority keypairs are saved to `server/db/authority-keys.json` (git-ignored)
  so signatures survive a restart. In production the private keys would sit in
  an HSM or the brand's PKI, and only the public keys would be published at
  `/api/authorities`.
- SQLite keeps the whole thing self-contained. The schema is standard SQL, so
  moving to Postgres would mostly mean swapping the driver.
- `public/_ds_bundle.js` is generated by the design system export, not written
  by hand. The build doesn't touch it and it loads as-is.
