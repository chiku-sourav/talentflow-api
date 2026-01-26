import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 50,
  duration: '30s',
};

export default function () {
  const res = http.get('http://localhost:3000/api/developers');

  check(res, {
    'status 200': (r) => r.status === 200,
  });
}
