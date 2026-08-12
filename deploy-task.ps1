# Deployment script for Task Scheduler
Set-Location "C:\Users\theya\OneDrive\Desktop\launchpad-fixed"
git add --all
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "Scheduled deploy: $timestamp" 2>$null
git push origin main 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployed at $timestamp" -ForegroundColor Green
} else {
    Write-Host "❌ Deploy failed at $timestamp" -ForegroundColor Red
}
