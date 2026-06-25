Campus Hiring Evaluation Microservices Backend
This repository contains two backend microservices and a reusable logging middleware package built for the technical assessment evaluation.

Repository Structure
logging-middleware/: Reusable logger package that transmits execution trace logs and handles JWT token refreshes with the evaluation server.
vehicle-scheduler-be/: Microservice implementing a 0/1 Knapsack dynamic programming algorithm for vehicle maintenance optimization.
notification-app-be/: Campus notification service implementing the Priority Inbox algorithm using a custom Min-Heap.
notification-system-design.md: Core system architecture design documentation detailing database schemas, caching, and concurrent worker patterns.
Getting Started
1. Configure the Environment
Ensure you have Node.js installed. Create a .env file inside both vehicle-scheduler-be/ and notification-app-be/ folders containing your JWT Bearer token:

env
JWT_TOKEN=your_token_here
2. Install Dependencies
Navigate into each of the folders and install dependencies:

bash
# Setup middleware
cd logging-middleware
npm install
# Setup vehicle scheduler
cd ../vehicle-scheduler-be
npm install
# Setup notification app
cd ../notification-app-be
npm install
How to Run & Verify Outputs
1. Vehicle Maintenance Scheduler
To compute the optimal scheduling plans for active depots:

bash
cd vehicle-scheduler-be
node index.js
Result Output: The optimal plans are exported directly to vehicle-scheduler-be/output/schedule.json.
Screenshots: Paste execution screenshots in vehicle-scheduler-be/Outputs/.
2. Campus Notifications Priority Inbox
To rank announcements and print the top 10 items:

bash
cd notification-app-be
node priority-inbox.js
Result Output: The top 10 sorted notifications are exported directly to notification-app-be/output/priority_inbox.json.
Screenshots: Paste execution screenshots in notification-app-be/Outputs/.
