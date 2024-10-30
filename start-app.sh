#!/bin/bash

# Navigate to the backend directory, install express, and start the server
cd backend || exit
echo "Installing express in backend..."
npm install express --save

echo "Starting backend server..."
node index.js &  # Run backend server in the background

# Navigate to the frontend directory and start the frontend
cd ../my-app || exit
echo "Starting frontend..."
npm run start
