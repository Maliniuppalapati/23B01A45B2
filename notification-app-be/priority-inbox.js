require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Log, ensureValidToken } = require('logging-middleware');
const { fetchNotifications } = require('./notificationService');
const MinHeap = require('./heap');

const TYPE_WEIGHTS = {
  'placement': 3,
  'result': 2,
  'event': 1
};

function calculatePriorityScore(notification) {
  const type = (notification.Type || '').toLowerCase();
  const weight = TYPE_WEIGHTS[type] || 0;
  const timeMs = new Date(notification.Timestamp).getTime();
  
  return (weight * 1e13) + timeMs;
}

async function run() {
  try {
    await Log('backend', 'info', 'service', 'Priority Inbox analyzer started');

    const token = await ensureValidToken();
    const notifications = await fetchNotifications(token);

    const scoredNotifications = notifications.map(notif => ({
      ...notif,
      priorityScore: calculatePriorityScore(notif)
    }));

    const heap = new MinHeap(10, (a, b) => a.priorityScore - b.priorityScore);
    
    scoredNotifications.forEach(notif => {
      heap.push(notif);
    });

    const top10 = heap.getSorted();

    await Log('backend', 'info', 'service', 'Successfully calculated top 10 priority items');
     
    console.log('                        TOP 10 PRIORITY INBOX NOTIFICATIONS                       ');
     
    console.log(String.prototype.padStart.call('Rank', 5) + ' | ' +
                String.prototype.padEnd.call('Type', 10) + ' | ' +
                String.prototype.padEnd.call('Timestamp', 20) + ' | ' +
                String.prototype.padEnd.call('Message', 40));
    
    
    top10.forEach((notif, index) => {
      const typeStr = String.prototype.padEnd.call(notif.Type, 10);
      const timeStr = String.prototype.padEnd.call(notif.Timestamp, 20);
      const msgStr = String.prototype.padEnd.call(notif.Message, 40);
      console.log(String.prototype.padStart.call(`${index + 1}`, 5) + ' | ' + typeStr + ' | ' + timeStr + ' | ' + msgStr);
    });
   
    const outputDir = path.resolve(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const outputPath = path.join(outputDir, 'priority_inbox.json');
    fs.writeFileSync(outputPath, JSON.stringify({ priorityInbox: top10 }, null, 2), 'utf8');

    await Log('backend', 'info', 'service', 'Successfully saved results to output/priority_inbox.json');
    await Log('backend', 'info', 'service', 'Priority Inbox analyzer finished successfully');

  } catch (err) {
    const errorDetails = err.response ? JSON.stringify(err.response.data) : err.message;
    await Log('backend', 'error', 'service', `Priority Inbox analysis failed: ${errorDetails}`);
  }
}

run();
