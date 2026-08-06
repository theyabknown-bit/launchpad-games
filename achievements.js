// ===================== ACHIEVEMENTS SYSTEM =====================
const ACHIEVEMENTS = {
    first_game: { id: 'first_game', name: 'First Steps', desc: 'Play your first game', icon: '👣', unlocked: false },
    game_master: { id: 'game_master', name: 'Game Master', desc: 'Play 10 different games', icon: '🎮', unlocked: false },
    xp_collector: { id: 'xp_collector', name: 'XP Collector', desc: 'Earn 100 XP', icon: '⭐', unlocked: false },
    level_up: { id: 'level_up', name: 'Level Up!', desc: 'Reach level 5', icon: '⬆️', unlocked: false },
    social_butterfly: { id: 'social_butterfly', name: 'Social Butterfly', desc: 'Add 5 friends', icon: '🦋', unlocked: false },
    top_rank: { id: 'top_rank', name: 'Top Rank', desc: 'Reach top 10 on leaderboard', icon: '🏆', unlocked: false }
};

function checkAchievements() {
    const save = loadSave();
    const stats = getPlayerStats();
    
    // Check first game
    if (save.gamesPlayed >= 1 && !ACHIEVEMENTS.first_game.unlocked) {
        unlockAchievement('first_game');
    }
    
    // Check game master
    if (save.gamesPlayed >= 10 && !ACHIEVEMENTS.game_master.unlocked) {
        unlockAchievement('game_master');
    }
    
    // Check XP collector
    if (save.totalXp >= 100 && !ACHIEVEMENTS.xp_collector.unlocked) {
        unlockAchievement('xp_collector');
    }
    
    // Check level up
    if (getPlayerLevel() >= 5 && !ACHIEVEMENTS.level_up.unlocked) {
        unlockAchievement('level_up');
    }
}

function unlockAchievement(id) {
    const achievement = ACHIEVEMENTS[id];
    if (!achievement || achievement.unlocked) return;
    achievement.unlocked = true;
    achievement.unlockedAt = new Date().toISOString();
    saveAchievements();
    showAchievementNotification(achievement);
}

function getAchievements() {
    const saved = localStorage.getItem('launchpad_achievements');
    if (saved) {
        const parsed = JSON.parse(saved);
        Object.keys(ACHIEVEMENTS).forEach(key => {
            if (parsed[key]) {
                ACHIEVEMENTS[key].unlocked = parsed[key].unlocked;
                ACHIEVEMENTS[key].unlockedAt = parsed[key].unlockedAt;
            }
        });
    }
    return ACHIEVEMENTS;
}

function saveAchievements() {
    localStorage.setItem('launchpad_achievements', JSON.stringify(ACHIEVEMENTS));
}

function showAchievementNotification(achievement) {
    // Remove any existing notifications
    const oldNotifs = document.querySelectorAll('.achievement-notification');
    oldNotifs.forEach(el => el.remove());
    
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.style.cssText = 'position:fixed;top:20px;right:20px;background:linear-gradient(135deg,#ffd700,#ff6b35);color:white;padding:15px 25px;border-radius:15px;z-index:9999;box-shadow:0 10px 40px rgba(0,0,0,0.5);animation:slideIn 0.5s ease;font-family:Segoe UI,sans-serif;max-width:300px;';
    notification.innerHTML = '<div style="font-size:2rem;">' + achievement.icon + '</div><div style="font-weight:700;">🏆 Achievement Unlocked!</div><div>' + achievement.name + '</div><div style="font-size:0.8rem;opacity:0.8;">' + achievement.desc + '</div>';
    document.body.appendChild(notification);
    
    // Add animation styles if not already present
    if (!document.getElementById('achievement-styles')) {
        const style = document.createElement('style');
        style.id = 'achievement-styles';
        style.textContent = `
            @keyframes slideIn {
                0% { transform: translateX(100%); opacity: 0; }
                100% { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                0% { transform: translateX(0); opacity: 1; }
                100% { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease forwards';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// Also add to window for global access
window.ACHIEVEMENTS = ACHIEVEMENTS;
window.checkAchievements = checkAchievements;
window.unlockAchievement = unlockAchievement;
window.getAchievements = getAchievements;