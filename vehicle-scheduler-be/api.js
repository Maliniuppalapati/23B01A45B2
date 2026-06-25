const axios = require('axios');
const { Log } = require('logging-middleware');

async function fetchDepots(token) {
  await Log('backend', 'info', 'service', 'Fetching depot details from API');
  const res = await axios.get('http://4.224.186.213/evaluation-service/depots', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const depots = res.data.depots;
  if (!depots || !Array.isArray(depots)) {
    throw new Error('Invalid depots response structure');
  }
  await Log('backend', 'info', 'service', `Successfully fetched ${depots.length} depots from API`);
  return depots;
}

async function fetchVehicles(token) {
  await Log('backend', 'info', 'service', 'Fetching vehicle tasks from API');
  const res = await axios.get('http://4.224.186.213/evaluation-service/vehicles', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const vehicles = res.data.vehicles;
  if (!vehicles || !Array.isArray(vehicles)) {
    throw new Error('Invalid vehicles response structure');
  }
  await Log('backend', 'info', 'service', `Successfully fetched ${vehicles.length} vehicle tasks from API`);
  return vehicles;
}

module.exports = {
  fetchDepots,
  fetchVehicles
};
