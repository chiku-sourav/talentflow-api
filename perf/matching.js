import http from 'k6/http';

export const options = {
  vus: 30,
  duration: '30s',
};

export default function () {
  http.get('http://localhost:3000/api/projects/1/matches');
}
