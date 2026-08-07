# ============================================
# AUTO-ADD LOGOS TO ALL GAME PAGES
# ============================================

$projectPath = "C:\Users\theya\OneDrive\Desktop\launchpad-fixed"

# Game ID to Logo mapping
$gameLogos = @{
    # Space Games
    "space" = "🚀"
    "asteroid" = "☄️"
    "planetbuilder" = "🌍"
    "aliens" = "👽"
    "station" = "🛸"
    "mining" = "⛏️"
    "delivery" = "📦"
    "blackhole" = "🌀"
    "alienzoo" = "🐉"
    
    # Arcade Games
    "tictactoe" = "❌"
    "snake" = "🐍"
    "simon" = "💡"
    "hangman" = "🪢"
    "whackamole" = "🔨"
    "scam" = "🛡️"
    "wordblitz" = "⌨️"
    "colormatch" = "🎨"
    "numbercrunch" = "🔢"
    "reactiontap" = "⚡"
    "draw" = "✏️"
    "typeracer" = "🏎️"
    "beatbop" = "🎵"
    "slidepuzzle" = "🧩"
    "trivia" = "🧠"
    "memory" = "🧠"
    "stim" = "⚡"
    
    # Simulation Games
    "sims" = "👤"
    "doctor" = "🏥"
    "cashier" = "💰"
    "hotel" = "🏨"
}

# File to Game ID mapping
$fileToGameId = @{
    "space.html" = "space"
    "asteroiddodge.html" = "asteroid"
    "PlanetBuilder.html" = "planetbuilder"
    "AlienTranslator.html" = "aliens"
    "SpaceStationManager.html" = "station"
    "AsteroidMining.html" = "mining"
    "GalacticDelivery.html" = "delivery"
    "BlackHoleEscape.html" = "blackhole"
    "AlienZoo.html" = "alienzoo"
    "tictactoe.html" = "tictactoe"
    "snake.html" = "snake"
    "simon.html" = "simon"
    "hangman.html" = "hangman"
    "whackamole.html" = "whackamole"
    "scam.html" = "scam"
    "wordblitz.html" = "wordblitz"
    "colormatch.html" = "colormatch"
    "numbercrunch.html" = "numbercrunch"
    "reactiontap.html" = "reactiontap"
    "draw.html" = "draw"
    "typeracer.html" = "typeracer"
    "beatbop.html" = "beatbop"
    "slidepuzzle.html" = "slidepuzzle"
    "trivia.html" = "trivia"
    "memorycard.html" = "memory"
    "sims.html" = "sims"
    "doctor.html" = "doctor"
    "cashier.html" = "cashier"
    "hotel.html" = "hotel"
}

# Get all HTML files in subfolders
$gameFiles = Get-ChildItem -Path $projectPath -Recurse -Filter "*.html" | Where-Object {
    $_.Directory.Name -in @("space", "a", "sim") -and
    $_.Name -notin @("base.html", "leaderboard.html", "index.html")
}

function AddLogoToGame($filePath) {
    $content = Get-Content $filePath.FullName -Raw
    
    # Get game ID from filename
    $gameId = $fileToGameId[$filePath.Name]
    if (-not $gameId) {
        $gameId = [System.IO.Path]::GetFileNameWithoutExtension($filePath.Name).ToLower()
    }
    
    $logo = $gameLogos[$gameId]
    if (-not $logo) {
        $logo = "🎮"
    }
    
    # Check if logo already exists
    if ($content -match "<title>.*?$logo.*?</title>") {
        Write-Host "✅ Already has logo: $($filePath.Name)" -ForegroundColor Green
        return
    }
    
    # Add logo to title
    $newContent = $content -replace "(<title>)(.*?)(</title>)", "`$1$logo `$2`$3"
    
    # Also add logo to h1 if it exists
    $newContent = $newContent -replace "(<h1[^>]*>)(.*?)(</h1>)", "`$1$logo `$2`$3"
    
    # Save the file
    Set-Content -Path $filePath.FullName -Value $newContent -Encoding UTF8
    Write-Host "✅ Added logo '$logo' to: $($filePath.Name)" -ForegroundColor Green
}

# ============================================
# RUN THE SCRIPT
# ============================================
Write-Host "🎨 Adding logos to ALL game pages..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

foreach ($file in $gameFiles) {
    AddLogoToGame $file
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎉 DONE! Logos added to all games!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. git add ." -ForegroundColor Yellow
Write-Host "2. git commit -m 'Added emoji logos to all game pages'" -ForegroundColor Yellow
Write-Host "3. git push origin main" -ForegroundColor Yellow
