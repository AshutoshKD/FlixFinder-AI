#!/bin/bash

# Create the frontend directory in the expected location
mkdir -p /app/frontend

# Copy frontend files to the expected location
cp -r frontend/* /app/frontend/

# Build the Go application
cd backend
go build -o app

echo "Build completed successfully. Frontend copied to /app/frontend/" 