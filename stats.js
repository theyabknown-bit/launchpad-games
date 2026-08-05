// ===================== PLAYER STATS =====================
function getPlayerStats() {
    const save = loadSave();
    const totalGames = Object.values(GAMES).flat().length;
    const played = save.gamesPlayed || 0;
    const totalXp = save.totalXp || 0;
    const level = getPlayerLevel();
    const achievements = getAchievements();
    const unlocked = Object.values(achievements).filter(a => a.unlocked).length;
    const totalAchievements = Object.keys(achievements).length;
    
    return {
        totalGames,
        played,
        totalXp,
        level,
        achievements: unlocked,
        totalAchievements,
        progress: Math.round((played / totalGames) * 100),
        xpToNext: getXpForLevel(level + 1) - totalXp
    };
}

function getPlayerLevel() {
    const save = loadSave();
    const xp = save.totalXp || 0;
    let level = 1;
    let needed = 10;
    let total = 0;
    while (total + needed <= xp) {
        total += needed;
        level++;
        needed = Math.floor(needed * 1.3) + 5;
    }
    return level;
}

function getXpForLevel(level) {
    let needed = 10;
    let total = 0;
    for (let i = 1; i < level; i++) {
        total += needed;
        needed = Math.floor(needed * 1.3) + 5;
    }
    return total;
}

function renderStats() {
    const stats = getPlayerStats();
    const container = document.getElementById('playerStats');
    if (!container) return;
    
    container.innerHTML = 
        '<div class="stat-grid">' +
        '<div class="stat-card"><div class="stat-value">' + stats.played + '/' + stats.totalGames + '</div><div class="stat-label">Games Played</div></div>' +
        '<div class="stat-card"><div class="stat-value">' + stats.totalXp + '</div><div class="stat-label">Total XP</div></div>' +
        '<div class="stat-card"><div class="stat-value">' + stats.level + '</div><div class="stat-label">Level</div></div>' +
        '<div class="stat-card"><div class="stat-value">' + stats.achievements + '/' + stats.totalAchievements + '</div><div class="stat-label">Achievements</div></div>' +
        '<div class="stat-card"><div class="stat-value">' + stats.progress + '%</div><div class="stat-label">Progress</div></div>' +
        '<div class="stat-card"><div class="stat-value">' + stats.xpToNext + '</div><div class="stat-label">XP to Next Level</div></div>' +
        '</div>';
}
