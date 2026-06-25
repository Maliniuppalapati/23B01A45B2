require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Log, ensureValidToken } = require('logging-middleware');
const { fetchDepots, fetchVehicles } = require('./api');
const { solveKnapsack } = require('./scheduler');

async function run() {
  try {
    await Log('backend', 'info', 'service', 'Vehicle Maintenance Scheduler Service started');

    const token = await ensureValidToken();

    const depots = await fetchDepots(token);
    const vehicles = await fetchVehicles(token);

    const schedules = [];

    for (const depot of depots) {
      const depotId = depot.ID;
      const budget = depot.MechanicHours;

      await Log('backend', 'info', 'service', `Scheduling started for Depot ID: ${depotId}`);
      
      const result = solveKnapsack(vehicles, budget);

      const depotSchedule = {
        depotID: depotId,
        availableMechanicHours: budget,
        totalUsedHours: result.totalDuration,
        totalOperationalImpact: result.totalImpact,
        selectedVehiclesCount: result.selectedVehicles.length,
        selectedVehicles: result.selectedVehicles,
        unselectedVehiclesCount: result.unselectedVehicles.length,
        unselectedVehicles: result.unselectedVehicles
      };

      schedules.push(depotSchedule);

      await Log('backend', 'info', 'service', `Scheduled Depot ID: ${depotId}: total impact ${result.totalImpact}`);
    }

    const outputDir = path.resolve(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'schedule.json');
    fs.writeFileSync(outputPath, JSON.stringify({ schedules }, null, 2), 'utf8');

    await Log('backend', 'info', 'service', `Successfully saved results to output/schedule.json`);
    await Log('backend', 'info', 'service', 'Vehicle Maintenance Scheduler completed');

  } catch (err) {
    const errorDetails = err.response ? JSON.stringify(err.response.data) : err.message;
    await Log('backend', 'error', 'service', `Process failed: ${errorDetails}`);
  }
}

run();
