#!/bin/bash

# Navigate to the backend directory, install express, and start the server
cd backend || exit
echo "Installing dependencies in backend..."
npm install

# Build the frontend in my-app to generate the build folder
echo "Building frontend..."
cd ../my-app || exit
npm install
npm run build

# Move the build folder into the backend directory if required by your setup
mv build ../backend/

# Start the backend server (which serves the built frontend)
cd ../backend || exit
echo "Starting backend server..."
node index.js
