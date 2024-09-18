#!/bin/bash

echo "Installing server dependencies..."
cd server && sudo npm install

echo "Installing client dependencies..."
cd ../client && sudo npm install

echo "Starting the project..."
cd ../server && sudo npm run dev
