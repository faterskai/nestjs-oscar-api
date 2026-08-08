import http from 'k6/http';
import { check, sleep } from 'k6';

// Spike test: sudden burst of traffic to see how the API recovers.
// Run with:
//   k6 run k6/spike-test.js

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  scenarios: {
    spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 10 }, // baseline
        { duration: '10s', target: 500 }, // sudden spike
        { duration: '30s', target: 500 }, // sustain spike
        { duration: '10s', target: 10 }, // drop back
        { duration: '20s', target: 10 }, // recovery observation
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.1'],
  },
};

export default function () {
  const listRes = http.get(`${BASE_URL}/nominees?page=1&limit=10`);
  check(listRes, { 'list status is 200 or 429': (r) => [200, 429].includes(r.status) });
  sleep(0.5);
}
