#!/bin/bash
# BrainBox AI Deployment Script

echo "?? Deploying BrainBox AI..."

# Build and start containers
docker-compose up -d --build

echo "? Deployment complete!"
echo "?? Access your app at http://localhost"
