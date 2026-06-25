const axios = require('axios');
const { Log } = require('logging-middleware');

async function fetchNotifications(token) {
  await Log('backend', 'info', 'service', 'Fetching notifications from API');
  const response = await axios.get('http://4.224.186.213/evaluation-service/notifications', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const notifications = response.data.notifications;
  if (!notifications || !Array.isArray(notifications)) {
    throw new Error('Invalid notifications response structure');
  }
  await Log('backend', 'info', 'service', `Successfully fetched ${notifications.length} notifications`);
  return notifications;
}

module.exports = {
  fetchNotifications
};
