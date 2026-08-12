# ============================================================
# 🔄 AUTO-DEPLOY – POLLING VERSION (FIXED)
# ============================================================

$folder = "C:\Users\theya\OneDrive\Desktop\launchpad-fixed"
$interval = 30

Write-Host "🔍 Auto-deploy started" -ForegroundColor Cyan
Write-Host "   Watching: $folder" -ForegroundColor Gray
Write-Host "   Interval: $interval seconds" -ForegroundColor Gray
Write-Host "   Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

$lastHash = $null

while ($true) {
    try {
        $files = Get-ChildItem -Path $folder -Recurse -File -Exclude ".git" | Where-Object {
            $_.FullName -notmatch "\\.git\\" -and 
            $_.Extension -notin @(".tmp", ".log", ".cache")
        }
        $currentHash = ""
        foreach ($file in $files) {
            $currentHash += "$($file.FullName)|$($file.LastWriteTime.Ticks);"
        }

        if ($lastHash -and $currentHash -ne $lastHash) {
            Write-Host "`n📝 Changes detected! Deploying..." -ForegroundColor Yellow

            Set-Location $folder
            git add --all

            $status = git status --porcelain
            if ($status) {
                $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
                git commit -m "Auto-deploy: $timestamp"

                if ($LASTEXITCODE -eq 0) {
                    git push origin main
                    if ($LASTEXITCODE -eq 0) {
                        Write-Host "✅ Deployed! 🌐 https://bit.ly/launchgamepad" -ForegroundColor Green
                    } else {
                        Write-Host "❌ Push failed!" -ForegroundColor Red
                    }
                }
            }
            Write-Host ""
        }

        $lastHash = $currentHash
        Start-Sleep -Seconds $interval

    } catch {
        Write-Host "⚠️ Error: $_" -ForegroundColor Red
        Start-Sleep -Seconds 5
    }
}
