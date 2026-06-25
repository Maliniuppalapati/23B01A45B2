const axios = require('axios');
const fs = require('fs');
const path = require('path');

let cachedToken = null;
let tokenExpiry = null;

function decodeJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    const payloadB64 = parts[1];
    const base64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    const payloadStr = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(payloadStr);
  } catch (err) {
    throw new Error('Failed to decode JWT: ' + err.message);
  }
}

async function ensureValidToken() {
  const now = Math.floor(Date.now() / 1000);
  
  if (cachedToken && tokenExpiry && (tokenExpiry - now > 10)) {
    return cachedToken;
  }

  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
      throw new Error(`.env file not found at ${envPath}`);
    }

    const rawEnv = fs.readFileSync(envPath, 'utf8').trim();
    if (!rawEnv) {
      throw new Error('.env file is empty');
    }

    const payload = decodeJwt(rawEnv);
    const credentials = {
      email: payload.email,
      name: payload.name,
      rollNo: payload.rollNo,
      accessCode: payload.accessCode,
      clientID: payload.clientID,
      clientSecret: payload.clientSecret
    };

    if (!credentials.email || !credentials.clientID || !credentials.clientSecret) {
      throw new Error('JWT inside .env does not contain required login credentials');
    }

    const response = await axios.post('http://4.224.186.213/evaluation-service/auth', credentials, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`Authentication responded with status ${response.status}`);
    }

    const { access_token, expires_in } = response.data;
    if (!access_token) {
      throw new Error('Auth response did not contain an access_token');
    }

    cachedToken = access_token;
    tokenExpiry = expires_in || (now + 900);
    return cachedToken;

  } catch (err) {
    console.error('Logger Auth Error:', err.message);
    throw err;
  }
}

module.exports = {
  ensureValidToken
};
