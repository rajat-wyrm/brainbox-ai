const API_URL = 'http://localhost:5000/api';

export const login = async (email: string, password: string) => {
  const res = await fetch(API_URL + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const signup = async (email: string, password: string, username: string) => {
  const res = await fetch(API_URL + '/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username })
  });
  return res.json();
};
