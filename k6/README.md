# k6 load tests

Requires [k6](https://k6.io/docs/get-started/installation/) installed locally (not an npm package).

Scripts target the `nominees` and `ping` endpoints:

- `smoke-test.js` — 1 VU, 5 iterations. Sanity check before running anything heavier.
- `stress-test.js` — ramps 0 → 300 VUs over ~4 minutes, exercising list/create/get/update.
- `spike-test.js` — sudden burst to 500 VUs to observe recovery behavior.

## Usage

```bash
npm run k6:smoke
npm run k6:stress
npm run k6:spike
```

Target a different host:

```bash
k6 run -e BASE_URL=http://localhost:3000 k6/stress-test.js
```

Make sure the API and its MongoDB dependency are running (`docker-compose up` / `npm run start:dev`) before running these tests, since `stress-test.js` writes data (`POST /nominees`).
