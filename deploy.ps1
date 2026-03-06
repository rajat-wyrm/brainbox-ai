# BrainBox AI Deployment Script (PowerShell)

Write-Host "?? Deploying BrainBox AI..." -ForegroundColor Green

# Build and start containers
docker-compose up -d --build

Write-Host "? Deployment complete!" -ForegroundColor Green
Write-Host "?? Access your app at http://localhost" -ForegroundColor Cyan
