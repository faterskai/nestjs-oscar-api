import http from 'k6/http';
import { check, sleep } from 'k6';

// Smoke test: low load, verifies the API works before running heavier tests.
// Run with:
//   k6 run k6/smoke-test.js

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  vus: 1,
  iterations: 5,
  thresholds: {
    http_req_failed: ['rate==0'],
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  const ping = http.get(`${BASE_URL}/ping`);
  check(ping, { 'ping status is 200': (r) => r.status === 200 });

  const listRes = http.get(`${BASE_URL}/nominees?page=1&limit=10`);
  check(listRes, { 'list status is 200': (r) => r.status === 200 });

  sleep(1);
}
