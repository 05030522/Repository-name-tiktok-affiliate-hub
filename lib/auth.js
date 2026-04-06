// Session cookie helpers

export function getSessionToken(req) {
  const cookies = req.headers.cookie || '';
  const match = cookies.match(/tv_session=([^;]+)/);
  return match ? match[1] : null;
}

export function setSessionCookie(token) {
  return `tv_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`;
}

export function clearSessionCookie() {
  return 'tv_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0';
}

// CORS headers for API responses
export function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// Generate 6-digit code
export function generateCode() {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return String(array[0] % 1000000).padStart(6, '0');
}
