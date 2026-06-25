const axios = require('axios');
const { ensureValidToken } = require('./authHelper');

async function Log(stack, level, pkg, message) {
  try {
    const token = await ensureValidToken();
    let formattedMessage = message;
    if (formattedMessage.length > 48) {
      formattedMessage = formattedMessage.substring(0, 45) + '...';
    }

    const payload = {
      level: level.toLowerCase(),
      message: formattedMessage,
      timestamp: new Date().toISOString(),
      stack: stack.toLowerCase(),
      package: pkg.toLowerCase()
    };

    const response = await axios.post('http://4.224.186.213/evaluation-service/logs', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 200 || response.status === 201) {
      console.log(`[${payload.timestamp}] [${payload.level.toUpperCase()}] [${payload.package.toUpperCase()}] ${payload.message}`);
      return response.data;
    } else {
      throw new Error(`Logs API status: ${response.status}`);
    }
  } catch (err) {
    const errorDetails = err.response ? JSON.stringify(err.response.data) : err.message;
    console.error(`Logging Middleware Failure: ${errorDetails}`);
  }
}

module.exports = {
  Log
};
