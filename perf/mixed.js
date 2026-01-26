import http from 'k6/http';

export const options = {
  scenarios: {
    reads: {
      executor: 'constant-vus',
      vus: 40,
      duration: '1m',
      exec: 'reads',
    },
    matches: {
      executor: 'constant-vus',
      vus: 20,
      duration: '1m',
      exec: 'matches',
    },
  },
};

export function reads() {
  http.get('http://localhost:3000/api/developers');
}

export function matches() {
  http.get('http://localhost:3000/api/projects/1/matches');
}
