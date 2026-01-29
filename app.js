/**
 * CyCrack - Main Application
 * Handles game logic, state management, UI updates, and persistence
 */

// =========================================
// Game State
// =========================================
const GameState = {
    // Current game session
    currentLevel: 1,
    currentChallenge: null,
    challengeNumber: 0,
    totalChallenges: 5,
    
    // Scoring
    totalScore: 0,
    roundScore: 0,
    streak: 0,
    hintMultiplier: 1.0,
    
    // Current challenge state
    timeElapsed: 0,
    timerInterval: null,
    attemptsRemaining: 3,
    hintsUsed: 0, // 0-3 hints used
    guesses: [],
    startTime: null,
    isPaused: false,
    
    // Notepad content
    notepadContent: '',
    
    // Player progress (persisted)
    stats: {
        totalGamesPlayed: 0,
        passwordsCracked: 0,
        passwordsFailed: 0,
        highestScore: 0,
        bestStreak: 0,
        highestLevel: 1,
        totalTimePlayed: 0,
        cipherStats: {},
        // Game history for stats
        gameHistory: [],
        // Average time per cipher
        averageTimes: {}
    },
    
    // Level summaries for current session
    levelStats: {
        startTime: null,
        correctAnswers: 0,
        totalAttempts: 0,
        fastestTime: Infinity,
        totalScore: 0
    }
};

// =========================================
// DOM Elements
// =========================================
const DOM = {
    // Confetti
    confettiCanvas: document.getElementById('confetti-canvas'),
    
    // Screens
    startScreen: document.getElementById('start-screen'),
    gameScreen: document.getElementById('game-screen'),
    resultScreen: document.getElementById('result-screen'),
    levelCompleteScreen: document.getElementById('level-complete-screen'),
    
    // Header stats
    totalScoreEl: document.getElementById('total-score'),
    currentLevelEl: document.getElementById('current-level'),
    streakEl: document.getElementById('streak'),
    
    // Start screen
    levelButtons: document.querySelectorAll('.level-btn'),
    startGameBtn: document.getElementById('start-game-btn'),
    howToPlayBtn: document.getElementById('how-to-play-btn'),
    viewStatsBtn: document.getElementById('view-stats-btn'),
    
    // Game screen - Cipher panel
    cipherInfoPanel: document.getElementById('cipher-info-panel'),
    panelLocked: document.getElementById('panel-locked'),
    panelContent: document.getElementById('panel-content'),
    cipherName: document.getElementById('cipher-name'),
    cipherDifficulty: document.getElementById('cipher-difficulty'),
    cipherDescription: document.getElementById('cipher-description'),
    cipherExampleBox: document.getElementById('cipher-example-box'),
    cipherExample: document.getElementById('cipher-example'),
    attemptsList: document.getElementById('attempts-list'),
    
    // Game screen - Main panel
    challengeNum: document.getElementById('challenge-num'),
    totalChallengesEl: document.getElementById('total-challenges'),
    scoreMultiplier: document.getElementById('score-multiplier'),
    progressFill: document.getElementById('progress-fill'),
    timer: document.getElementById('timer'),
    timerValue: document.getElementById('timer-value'),
    roundScoreEl: document.getElementById('round-score'),
    potentialScoreContainer: document.getElementById('potential-score-container'),
    
    encryptedText: document.getElementById('encrypted-text'),
    cipherCategoryBadge: document.getElementById('cipher-category-badge'),
    cipherCategoryText: document.getElementById('cipher-category-text'),
    cipherNameBadge: document.getElementById('cipher-name-badge'),
    cipherNameText: document.getElementById('cipher-name-text'),
    
    guessInput: document.getElementById('guess-input'),
    submitGuessBtn: document.getElementById('submit-guess-btn'),
    inputFeedback: document.getElementById('input-feedback'),
    
    // Hint button (single button with tooltip)
    hintBtn: document.getElementById('hint-btn'),
    hintsUsedBadge: document.getElementById('hints-used-badge'),
    hintTooltip: document.getElementById('hint-tooltip'),
    hintTooltipContent: document.getElementById('hint-tooltip-content'),
    hintTooltipCost: document.getElementById('hint-tooltip-cost'),
    
    // Give up
    giveUpBtn: document.getElementById('give-up-btn'),
    
    
    // Notepad
    notepadTextarea: document.getElementById('notepad-textarea'),
    notepadPanel: document.getElementById('notepad-panel'),
    notepadToggle: document.getElementById('notepad-toggle'),
    showPythonIdeBtn: document.getElementById('show-python-ide-btn'),
    
    // Python IDE Modal
    pythonIdeModal: document.getElementById('python-ide-modal'),
    pythonCodeEditor: document.getElementById('python-code-editor'),
    pythonOutput: document.getElementById('python-output'),
    runPythonBtn: document.getElementById('run-python-btn'),
    closePythonIde: document.getElementById('close-python-ide'),
    
    // Result screen
    resultIcon: document.getElementById('result-icon'),
    resultTitle: document.getElementById('result-title'),
    resultMessage: document.getElementById('result-message'),
    resultPassword: document.getElementById('result-password'),
    resultPoints: document.getElementById('result-points'),
    resultTime: document.getElementById('result-time'),
    nextChallengeBtn: document.getElementById('next-challenge-btn'),
    backToMenuBtn: document.getElementById('back-to-menu-btn'),
    
    // Level complete screen
    completedLevel: document.getElementById('completed-level'),
    levelNameDisplay: document.getElementById('level-name-display'),
    levelCompleteMessage: document.getElementById('level-complete-message'),
    levelTotalScore: document.getElementById('level-total-score'),
    levelAccuracy: document.getElementById('level-accuracy'),
    levelBestTime: document.getElementById('level-best-time'),
    unlockNotice: document.getElementById('unlock-notice'),
    continueNextLevelBtn: document.getElementById('continue-next-level-btn'),
    replayLevelBtn: document.getElementById('replay-level-btn'),
    levelMenuBtn: document.getElementById('level-menu-btn'),
    
    // Modals
    howToPlayModal: document.getElementById('how-to-play-modal'),
    statsModal: document.getElementById('stats-modal'),
    giveUpModal: document.getElementById('give-up-modal'),
    gameOverModal: document.getElementById('game-over-modal'),
    
    closeHowToPlay: document.getElementById('close-how-to-play'),
    closeStats: document.getElementById('close-stats'),
    
    // Give up modal
    confirmGiveUpBtn: document.getElementById('confirm-give-up-btn'),
    cancelGiveUpBtn: document.getElementById('cancel-give-up-btn'),
    
    // Game over modal
    gameOverIcon: document.getElementById('game-over-icon'),
    gameOverTitle: document.getElementById('game-over-title'),
    revealedPassword: document.getElementById('revealed-password'),
    finalScore: document.getElementById('final-score'),
    challengesCompleted: document.getElementById('challenges-completed'),
    challengesTotal: document.getElementById('challenges-total'),
    newGameBtn: document.getElementById('new-game-btn'),
    gameOverMenuBtn: document.getElementById('game-over-menu-btn'),
    
    // Stats modal elements
    statsTotalGames: document.getElementById('stats-total-games'),
    statsPasswordsCracked: document.getElementById('stats-passwords-cracked'),
    statsHighestScore: document.getElementById('stats-highest-score'),
    statsBestStreak: document.getElementById('stats-best-streak'),
    statsHighestLevel: document.getElementById('stats-highest-level'),
    statsAccuracy: document.getElementById('stats-accuracy'),
    statsTotalTime: document.getElementById('stats-total-time'),
    cipherProgressList: document.getElementById('cipher-progress-list'),
    gameHistoryList: document.getElementById('game-history-list'),
    resetStatsBtn: document.getElementById('reset-stats-btn'),
    
    // Toast container
    toastContainer: document.getElementById('toast-container')
};

// =========================================
// Pyodide Python Runtime
// =========================================
let pyodideReady = false;
let pyodide = null;

async function initPyodide() {
    if (pyodideReady) return;
    try {
        pyodide = await loadPyodide();
        pyodideReady = true;
        console.log('✅ Pyodide Python runtime loaded');
    } catch (error) {
        console.error('Failed to load Pyodide:', error);
    }
}

// =========================================
// Confetti System
// =========================================
const Confetti = {
    particles: [],
    running: false,
    ctx: null,
    
    init() {
        if (!DOM.confettiCanvas) return;
        this.ctx = DOM.confettiCanvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    },
    
    resize() {
        if (!DOM.confettiCanvas) return;
        DOM.confettiCanvas.width = window.innerWidth;
        DOM.confettiCanvas.height = window.innerHeight;
    },
    
    createParticle() {
        const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#fbbf24'];
        return {
            x: Math.random() * DOM.confettiCanvas.width,
            y: -20,
            size: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 4 - 2,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        };
    },
    
    start(duration = 3000) {
        if (!this.ctx) return;
        this.running = true;
        this.particles = [];
        
        // Add initial particles
        for (let i = 0; i < 100; i++) {
            const p = this.createParticle();
            p.y = Math.random() * DOM.confettiCanvas.height;
            this.particles.push(p);
        }
        
        this.animate();
        
        // Add more particles over time
        const interval = setInterval(() => {
            for (let i = 0; i < 5; i++) {
                this.particles.push(this.createParticle());
            }
        }, 50);
        
        setTimeout(() => {
            clearInterval(interval);
            this.running = false;
        }, duration);
    },
    
    animate() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, DOM.confettiCanvas.width, DOM.confettiCanvas.height);
        
        this.particles = this.particles.filter(p => p.y < DOM.confettiCanvas.height + 20);
        
        this.particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;
            
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation * Math.PI / 180);
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            this.ctx.restore();
        });
        
        if (this.running || this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        }
    }
};

// =========================================
// Utility Functions
// =========================================
function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    } else {
        console.error(`Modal element not found: ${modalId}`);
    }
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
    `;
    
    DOM.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.25s ease reverse';
        setTimeout(() => toast.remove(), 250);
    }, 3000);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

// =========================================
// Persistence
// =========================================
function saveStats() {
    localStorage.setItem('cycrack_stats', JSON.stringify(GameState.stats));
}

function loadStats() {
    const saved = localStorage.getItem('cycrack_stats');
    if (saved) {
        try {
            const loadedStats = JSON.parse(saved);
            // Ensure all required properties exist
            GameState.stats = {
                totalGamesPlayed: loadedStats.totalGamesPlayed || 0,
                passwordsCracked: loadedStats.passwordsCracked || 0,
                passwordsFailed: loadedStats.passwordsFailed || 0,
                highestScore: loadedStats.highestScore || 0,
                bestStreak: loadedStats.bestStreak || 0,
                highestLevel: loadedStats.highestLevel || 1,
                totalTimePlayed: loadedStats.totalTimePlayed || 0,
                cipherStats: loadedStats.cipherStats || {},
                gameHistory: loadedStats.gameHistory || [],
                averageTimes: loadedStats.averageTimes || {}
            };
        } catch (e) {
            console.error('Failed to load stats:', e);
            // Reset to defaults on error
            GameState.stats = {
                totalGamesPlayed: 0,
                passwordsCracked: 0,
                passwordsFailed: 0,
                highestScore: 0,
                bestStreak: 0,
                highestLevel: 1,
                totalTimePlayed: 0,
                cipherStats: {},
                gameHistory: [],
                averageTimes: {}
            };
        }
    }
}

function resetStats() {
    GameState.stats = {
        totalGamesPlayed: 0,
        passwordsCracked: 0,
        passwordsFailed: 0,
        highestScore: 0,
        bestStreak: 0,
        highestLevel: 1,
        totalTimePlayed: 0,
        cipherStats: {},
        gameHistory: [],
        averageTimes: {}
    };
    saveStats();
    updateStatsModal();
    showToast('Stats have been reset', 'info');
}

// =========================================
// UI Updates
// =========================================
function updateHeaderStats() {
    DOM.totalScoreEl.textContent = GameState.totalScore.toLocaleString();
    DOM.currentLevelEl.textContent = GameState.currentLevel;
    DOM.streakEl.textContent = GameState.streak;
}

function updateLevelButtons() {
    DOM.levelButtons.forEach(btn => {
        const levelId = parseInt(btn.dataset.level);
        const isUnlocked = Levels.isLevelUnlocked(levelId, GameState.stats.highestLevel);
        
        btn.classList.toggle('locked', !isUnlocked);
        btn.classList.toggle('selected', levelId === GameState.currentLevel);
        btn.disabled = !isUnlocked;
    });
}

function updateTimer() {
    const minutes = Math.floor(GameState.timeElapsed / 60);
    const seconds = GameState.timeElapsed % 60;
    DOM.timerValue.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Color changes based on time elapsed
    DOM.timer.classList.remove('warning', 'danger');
    if (GameState.timeElapsed >= 120) {
        DOM.timer.classList.add('danger');
    } else if (GameState.timeElapsed >= 60) {
        DOM.timer.classList.add('warning');
    }
}

// Attempts counter removed - no longer needed

function updateProgress(completedOverride = null) {
    // Calculate progress as percentage of completed challenges
    // If completedOverride is provided, use that (for when challenge is just completed)
    const completedChallenges = completedOverride !== null ? completedOverride : (GameState.challengeNumber - 1);
    const progress = (completedChallenges / GameState.totalChallenges) * 100;
    
    // Update progress bar width
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        const width = Math.min(Math.max(progress, 0), 100);
        progressFill.style.width = `${width}%`;
        console.log(`📊 Progress bar: ${completedChallenges}/${GameState.totalChallenges} = ${width}%`);
    } else {
        console.error('❌ progressFill element not found!');
    }
    
    // Update challenge counter text
    const challengeNum = document.getElementById('challenge-num');
    const totalChallengesEl = document.getElementById('total-challenges');
    
    if (challengeNum) {
        challengeNum.textContent = GameState.challengeNumber;
    }
    if (totalChallengesEl) {
        totalChallengesEl.textContent = GameState.totalChallenges;
    }
    
    console.log(`🎯 Challenge ${GameState.challengeNumber} of ${GameState.totalChallenges}, Completed: ${completedChallenges}`);
}

function updateScoreDisplay() {
    const multiplier = Levels.hintMultipliers[GameState.hintsUsed] || 0.4;
    GameState.hintMultiplier = multiplier;
    
    DOM.scoreMultiplier.textContent = `×${multiplier.toFixed(1)}`;
    DOM.scoreMultiplier.style.color = multiplier === 1 ? 'var(--accent-gold)' : 
                                       multiplier >= 0.7 ? 'var(--warning)' : 'var(--danger)';
    
    // Hide potential points - don't show to user
    if (DOM.potentialScoreContainer) {
        DOM.potentialScoreContainer.style.display = 'none';
    }
}

function calculatePotentialScore() {
    if (!GameState.currentChallenge) return 0;
    
    return Levels.calculateScore(
        GameState.currentLevel,
        GameState.timeElapsed,
        GameState.hintsUsed,
        (Levels.getLevel(GameState.currentLevel)?.maxAttempts || 3) - GameState.attemptsRemaining + 1,
        GameState.streak
    );
}


function clearAttemptsList() {
    if (DOM.attemptsList) {
        DOM.attemptsList.innerHTML = '<p class="no-attempts">No attempts yet</p>';
        console.log('Attempts list cleared');
    } else {
        console.error('attemptsList DOM element not found!');
    }
}

function updateHintButtons() {
    // Update the hint button badge and tooltip
    updateHintBadgeAndTooltip();
}

function updateHintBadgeAndTooltip() {
    const hintBtn = DOM.hintBtn;
    const badge = DOM.hintsUsedBadge;
    const tooltipContent = DOM.hintTooltipContent;
    const tooltipCost = DOM.hintTooltipCost;
    
    if (!hintBtn) return;
    
    // Update badge
    if (badge) {
        if (GameState.hintsUsed > 0) {
            badge.textContent = GameState.hintsUsed;
            badge.classList.remove('hidden');
            console.log('Hint badge updated:', GameState.hintsUsed);
        } else {
            badge.classList.add('hidden');
            badge.textContent = '';
            console.log('Hint badge hidden');
        }
    } else {
        console.error('hintsUsedBadge DOM element not found!');
    }
    
    // Update tooltip content based on next available hint
    const nextHint = GameState.hintsUsed + 1;
    
    if (nextHint > 3) {
        // All hints used
        hintBtn.classList.add('all-used');
        if (tooltipContent) {
            tooltipContent.innerHTML = '<strong>All hints used</strong><span>No more hints available</span>';
        }
        if (tooltipCost) {
            tooltipCost.textContent = '';
        }
    } else {
        hintBtn.classList.remove('all-used');
        
        const hintInfo = {
            1: { name: 'Description', desc: 'Learn how this cipher works', cost: '×0.9' },
            2: { name: 'Letter Example', desc: 'See how the first letter transforms', cost: '×0.7' },
            3: { name: 'Python Code', desc: 'Open code editor to solve it', cost: '×0.4' }
        };
        
        const info = hintInfo[nextHint];
        if (tooltipContent) {
            tooltipContent.innerHTML = `<strong>${info.name}</strong><span>${info.desc}</span>`;
        }
        if (tooltipCost) {
            tooltipCost.textContent = `Cost: ${info.cost}`;
        }
    }
}

function addGuessToList(guess, isCorrect) {
    // Add to the attempts panel in the left sidebar
    if (DOM.attemptsList) {
        // Remove "no attempts" message if present
        const noAttempts = DOM.attemptsList.querySelector('.no-attempts');
        if (noAttempts) {
            noAttempts.remove();
        }
        
        const attemptItem = document.createElement('div');
        attemptItem.className = `attempt-item ${isCorrect ? 'correct' : 'wrong'}`;
        
        // Build the guess text with character-by-character highlighting
        const original = GameState.currentChallenge.original.toUpperCase();
        const guessUpper = guess.toUpperCase();
        let guessHTML = '';
        
        for (let i = 0; i < guessUpper.length; i++) {
            const char = guessUpper[i];
            const isCharCorrect = i < original.length && char === original[i];
            guessHTML += `<span class="${isCharCorrect ? 'char-correct' : ''}">${char}</span>`;
        }
        
        attemptItem.innerHTML = `
            <span class="attempt-icon">${isCorrect ? '✓' : '✗'}</span>
            <span class="attempt-text">${guessHTML}</span>
        `;
        DOM.attemptsList.insertBefore(attemptItem, DOM.attemptsList.firstChild);
    }
}

function showFeedback(message, type) {
    DOM.inputFeedback.textContent = message;
    DOM.inputFeedback.className = `input-feedback ${type}`;
    
    setTimeout(() => {
        DOM.inputFeedback.textContent = '';
        DOM.inputFeedback.className = 'input-feedback';
    }, 2500);
}

function updateStatsModal() {
    try {
        const stats = GameState.stats;
        
        // Ensure stats object has all required properties
        if (!stats.gameHistory) {
            stats.gameHistory = [];
        }
        if (!stats.cipherStats) {
            stats.cipherStats = {};
        }
        
        // Update basic stats with null checks
        if (DOM.statsTotalGames) DOM.statsTotalGames.textContent = stats.totalGamesPlayed || 0;
        if (DOM.statsPasswordsCracked) DOM.statsPasswordsCracked.textContent = stats.passwordsCracked || 0;
        if (DOM.statsHighestScore) DOM.statsHighestScore.textContent = (stats.highestScore || 0).toLocaleString();
        if (DOM.statsBestStreak) DOM.statsBestStreak.textContent = stats.bestStreak || 0;
        if (DOM.statsHighestLevel) DOM.statsHighestLevel.textContent = stats.highestLevel || 1;
        
        const total = (stats.passwordsCracked || 0) + (stats.passwordsFailed || 0);
        const accuracy = total > 0 ? Math.round(((stats.passwordsCracked || 0) / total) * 100) : 0;
        if (DOM.statsAccuracy) DOM.statsAccuracy.textContent = `${accuracy}%`;
        
        // Total time played
        if (DOM.statsTotalTime) {
            const minutes = Math.floor((stats.totalTimePlayed || 0) / 60);
            const hours = Math.floor(minutes / 60);
            if (hours > 0) {
                DOM.statsTotalTime.textContent = `${hours}h ${minutes % 60}m`;
            } else {
                DOM.statsTotalTime.textContent = `${minutes}m`;
            }
        }
        
        const cipherNames = ['reversed', 'rot13', 'simpleShift', 'caesar', 'atbash', 'a1z26', 
                             'vigenere', 'railFence', 'morse', 'binary', 'affine', 'substitution', 
                             'columnar', 'hex', 'doubleCaesar', 'reverseCaesar', 'atbashVigenere'];
        
        // Cipher mastery progress
        if (DOM.cipherProgressList) {
            DOM.cipherProgressList.innerHTML = cipherNames.map(name => {
                const cipher = Ciphers[name];
                const cipherStat = stats.cipherStats[name] || { solved: 0, attempts: 0 };
                const successRate = cipherStat.attempts > 0 
                    ? Math.round((cipherStat.solved / cipherStat.attempts) * 100) 
                    : 0;
                const practiced = cipherStat.attempts > 0;
                
                return `
                    <div class="cipher-progress-item ${practiced ? 'practiced' : 'not-practiced'}">
                        <span class="cipher-progress-name">${cipher?.name || name}</span>
                        <div class="cipher-progress-stats">
                            <span class="cipher-attempts">${cipherStat.solved}/${cipherStat.attempts}</span>
                        </div>
                        <div class="cipher-progress-bar">
                            <div class="cipher-progress-fill" style="width: ${successRate}%"></div>
                        </div>
                        <span class="cipher-progress-value">${successRate}%</span>
                    </div>
                `;
            }).join('');
        }
        
        // Game history (last 10 games)
        if (DOM.gameHistoryList) {
            if (stats.gameHistory && stats.gameHistory.length > 0) {
                const recentGames = stats.gameHistory.slice(-10).reverse();
                DOM.gameHistoryList.innerHTML = recentGames.map(game => {
                    const date = new Date(game.timestamp);
                    const dateStr = date.toLocaleDateString();
                    const levelName = Levels.getLevel(game.level)?.name || `Level ${game.level}`;
                    return `
                        <div class="game-history-item">
                            <span class="history-date">${dateStr}</span>
                            <span class="history-level">${levelName}</span>
                            <span class="history-score">${(game.score || 0).toLocaleString()} pts</span>
                            <span class="history-accuracy">${game.accuracy || 0}%</span>
                        </div>
                    `;
                }).join('');
            } else {
                DOM.gameHistoryList.innerHTML = '<p class="no-history">No games played yet.</p>';
            }
        }
    } catch (error) {
        console.error('Error updating stats modal:', error);
        showToast('Error loading statistics', 'error');
    }
}

// =========================================
// Cipher Info Panel
// =========================================
function resetCipherPanel() {
    // Cipher name is always shown upfront now
    DOM.panelLocked.classList.add('hidden');
    DOM.panelContent.classList.remove('hidden');
    DOM.cipherDescription.classList.add('hidden');
    DOM.cipherExampleBox.classList.add('hidden');
    DOM.cipherCategoryBadge.classList.add('hidden');
}

function showCipherNameUpfront() {
    const challenge = GameState.currentChallenge;
    if (!challenge) return;
    
    // Show cipher name immediately (educational approach)
    DOM.cipherName.textContent = challenge.cipherDisplayName;
    DOM.cipherDifficulty.textContent = challenge.cipherDifficulty;
    DOM.cipherDifficulty.className = `cipher-difficulty ${challenge.cipherDifficulty}`;
    
    // Show cipher name badge under encrypted text
    if (DOM.cipherNameBadge) {
        DOM.cipherNameBadge.classList.remove('hidden');
        DOM.cipherNameText.textContent = challenge.cipherDisplayName;
    }
}

function revealCipherDescription() {
    // Hint 1: Show description (0.9 multiplier)
    const challenge = GameState.currentChallenge;
    if (!challenge) return;
    
    DOM.cipherDescription.textContent = challenge.cipherDescription;
    DOM.cipherDescription.classList.remove('hidden');
}

function revealCipherExample() {
    // Hint 2: Show example using first letter of the word (0.7 multiplier)
    const challenge = GameState.currentChallenge;
    if (!challenge) return;
    
    const cipher = Ciphers[challenge.cipherName];
    if (!cipher || !cipher.getExample) return;
    
    // Get the first letter of the original word for the example
    const firstLetter = challenge.original[0].toUpperCase();
    
    let example;
    // Pass first letter and cipher parameters to getExample
    if (challenge.cipherName === 'caesar') {
        example = cipher.getExample(firstLetter, challenge.cipherParams.shift);
    } else if (challenge.cipherName === 'vigenere') {
        example = cipher.getExample(firstLetter, challenge.cipherParams.keyword);
    } else if (challenge.cipherName === 'railFence') {
        example = cipher.getExample(firstLetter, challenge.cipherParams.rails);
    } else if (challenge.cipherName === 'affine') {
        example = cipher.getExample(firstLetter, challenge.cipherParams.a, challenge.cipherParams.b);
    } else if (challenge.cipherName === 'substitution') {
        example = cipher.getExample(firstLetter, challenge.cipherParams.key);
    } else if (challenge.cipherName === 'columnar') {
        example = cipher.getExample(firstLetter, challenge.cipherParams.keyword);
    } else if (challenge.cipherName === 'doubleCaesar') {
        example = cipher.getExample(firstLetter, challenge.cipherParams.shift1, challenge.cipherParams.shift2);
    } else if (challenge.cipherName === 'reverseCaesar') {
        example = cipher.getExample(firstLetter, challenge.cipherParams.shift);
    } else if (challenge.cipherName === 'atbashVigenere') {
        example = cipher.getExample(firstLetter, challenge.cipherParams.keyword);
    } else {
        example = cipher.getExample(firstLetter);
    }
    
    DOM.cipherExampleBox.classList.remove('hidden');
    DOM.cipherExample.textContent = example.visual;
}

function revealPythonCode() {
    // Hint 3: Show Python code framework (0.4 multiplier)
    const challenge = GameState.currentChallenge;
    if (!challenge) return;
    
    const cipher = Ciphers[challenge.cipherName];
    if (!cipher || !cipher.getPythonCode) return;
    
    let pythonCode;
    // Pass cipher parameters to getPythonCode
    if (challenge.cipherName === 'caesar') {
        pythonCode = cipher.getPythonCode(challenge.encrypted, challenge.cipherParams.shift);
    } else if (challenge.cipherName === 'vigenere') {
        pythonCode = cipher.getPythonCode(challenge.encrypted, challenge.cipherParams.keyword);
    } else if (challenge.cipherName === 'railFence') {
        pythonCode = cipher.getPythonCode(challenge.encrypted, challenge.cipherParams.rails);
    } else if (challenge.cipherName === 'affine') {
        pythonCode = cipher.getPythonCode(challenge.encrypted, challenge.cipherParams.a, challenge.cipherParams.b);
    } else if (challenge.cipherName === 'substitution') {
        pythonCode = cipher.getPythonCode(challenge.encrypted, challenge.cipherParams.key);
    } else if (challenge.cipherName === 'columnar') {
        pythonCode = cipher.getPythonCode(challenge.encrypted, challenge.cipherParams.keyword);
    } else if (challenge.cipherName === 'doubleCaesar') {
        pythonCode = cipher.getPythonCode(challenge.encrypted, challenge.cipherParams.shift1, challenge.cipherParams.shift2);
    } else if (challenge.cipherName === 'reverseCaesar') {
        pythonCode = cipher.getPythonCode(challenge.encrypted, challenge.cipherParams.shift);
    } else if (challenge.cipherName === 'atbashVigenere') {
        pythonCode = cipher.getPythonCode(challenge.encrypted, challenge.cipherParams.keyword);
    } else {
        pythonCode = cipher.getPythonCode(challenge.encrypted);
    }
    
    // Open Python IDE modal with the code
    openPythonIDE(pythonCode);
    
    // Show the button to reopen IDE
    showPythonIdeButton();
}

// =========================================
// Python IDE
// =========================================
function openPythonIDE(code) {
    if (DOM.pythonCodeEditor) {
        DOM.pythonCodeEditor.value = code;
    }
    if (DOM.pythonOutput) {
        DOM.pythonOutput.textContent = 'Click "Run Code" to execute...';
    }
    showModal('python-ide-modal');
}

async function runPythonCode() {
    const code = DOM.pythonCodeEditor.value;
    const outputStatus = document.getElementById('output-status');
    
    try {
        if (outputStatus) {
            outputStatus.textContent = 'Running...';
            outputStatus.style.color = 'var(--accent-secondary)';
        }
        
        // Check if Pyodide is ready
        if (!pyodideReady || !pyodide) {
            DOM.pythonOutput.textContent = 'Loading Python runtime...\nPlease wait a moment and try again.';
            DOM.pythonOutput.classList.remove('error');
            if (outputStatus) outputStatus.textContent = 'Loading...';
            await initPyodide();
            return;
        }
        
        // Redirect stdout to capture print statements
        await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
        `);
        
        // Run the user's code
        await pyodide.runPythonAsync(code);
        
        // Get the output
        const output = await pyodide.runPythonAsync('sys.stdout.getvalue()');
        
        DOM.pythonOutput.textContent = output || 'Code executed successfully (no output)';
        DOM.pythonOutput.classList.remove('error');
        
        if (outputStatus) {
            outputStatus.textContent = 'Complete';
            outputStatus.style.color = 'var(--success)';
        }
    } catch (error) {
        DOM.pythonOutput.textContent = `Error: ${error.message}`;
        DOM.pythonOutput.classList.add('error');
        
        if (outputStatus) {
            outputStatus.textContent = 'Error';
            outputStatus.style.color = 'var(--danger)';
        }
    }
}

// Legacy functions removed - now using real Pyodide Python execution

// Show Python IDE button
function showPythonIdeButton() {
    const btn = document.getElementById('show-python-ide-btn');
    if (btn) {
        btn.classList.remove('hidden');
    }
}

// =========================================
// Notepad
// =========================================

function saveNotepadContent() {
    if (DOM.notepadTextarea) {
        GameState.notepadContent = DOM.notepadTextarea.value;
    }
}

function loadNotepadContent() {
    if (DOM.notepadTextarea) {
        DOM.notepadTextarea.value = GameState.notepadContent;
    }
}

// =========================================
// Timer Management
// =========================================
function startTimer() {
    stopTimer();
    GameState.timeElapsed = 0;
    
    GameState.timerInterval = setInterval(() => {
        if (!GameState.isPaused) {
            GameState.timeElapsed++;
            updateTimer();
            updateScoreDisplay();
        }
    }, 1000);
}

function stopTimer() {
    if (GameState.timerInterval) {
        clearInterval(GameState.timerInterval);
        GameState.timerInterval = null;
    }
}

function pauseGame() {
    GameState.isPaused = true;
}

// =========================================
// Hint System
// =========================================
function useNextHint() {
    const nextHint = GameState.hintsUsed + 1;
    
    if (nextHint > 3) return; // All hints used
    
    GameState.hintsUsed = nextHint;
    updateHintButtons();
    updateScoreDisplay();
    
    switch (nextHint) {
        case 1:
            // Hint 1: Description (0.9 multiplier)
            revealCipherDescription();
            showToast('Cipher description revealed!', 'info');
            break;
        case 2:
            // Hint 2: Example with first letter transformation (0.7 multiplier)
            revealCipherExample();
            showToast('Letter transformation example revealed!', 'info');
            break;
        case 3:
            // Hint 3: Python code framework (0.4 multiplier)
            revealPythonCode();
            showToast('Python code template opened!', 'info');
            break;
    }
}

// Keep for backwards compatibility
function useHint(hintNumber) {
    if (GameState.hintsUsed >= hintNumber) return;
    if (hintNumber !== GameState.hintsUsed + 1) return;
    useNextHint();
}

// =========================================
// Game Logic
// =========================================
function startGame(levelId = 1) {
    GameState.currentLevel = levelId;
    GameState.challengeNumber = 0;
    GameState.totalScore = 0;
    GameState.streak = 0;
    
    // Initialize game seed for random word generation
    Levels.initializeGameSeed();
    
    // Reset level stats
    GameState.levelStats = {
        startTime: Date.now(),
        correctAnswers: 0,
        totalAttempts: 0,
        fastestTime: Infinity,
        totalScore: 0
    };
    
    const level = Levels.getLevel(levelId);
    GameState.totalChallenges = level ? level.challengesPerLevel : 5;
    
    GameState.stats.totalGamesPlayed++;
    saveStats();
    
    // Clear notepad content when starting a new level
    GameState.notepadContent = '';
    if (DOM.notepadTextarea) {
        DOM.notepadTextarea.value = '';
    }
    
    updateHeaderStats();
    nextChallenge();
}

function nextChallenge() {
    GameState.challengeNumber++;
    
    // Check if level is complete
    if (GameState.challengeNumber > GameState.totalChallenges) {
        showLevelComplete();
        return;
    }
    
    // Generate new challenge
    const challenge = Levels.generateChallenge(GameState.currentLevel);
    if (!challenge) {
        showToast('Error generating challenge', 'error');
        return;
    }
    
    GameState.currentChallenge = challenge;
    GameState.timeElapsed = 0;
    GameState.attemptsRemaining = challenge.maxAttempts;
    GameState.hintsUsed = 0;
    GameState.hintMultiplier = 1.0;
    GameState.guesses = [];
    GameState.startTime = Date.now();
    GameState.isPaused = false;
    
    console.log('=== Starting new challenge ===');
    console.log('Challenge number:', GameState.challengeNumber);
    console.log('Hints used:', GameState.hintsUsed);
    
    // Reset UI elements for new challenge
    resetGameUIElements();
    
    // Update UI
    showScreen('game-screen');
    displayChallenge();
    resetCipherPanel();
    updateProgress();
    updateTimer();
    updateScoreDisplay();
    updateHintButtons();
    
    // Close notepad if this is the first challenge (let it stay open between challenges)
    if (GameState.challengeNumber === 1) {
        if (DOM.notepadPanel) {
            DOM.notepadPanel.classList.add('hidden');
        }
        const gameLayout = document.querySelector('.game-layout-3col');
        if (gameLayout) {
            gameLayout.classList.add('notepad-hidden');
        }
    }
    
    // Clear input
    DOM.guessInput.value = '';
    DOM.inputFeedback.textContent = '';
    
    // Focus input and start timer
    DOM.guessInput.focus();
    startTimer();
}

function displayChallenge() {
    const challenge = GameState.currentChallenge;
    if (!challenge) return;
    
    // Main display
    DOM.encryptedText.textContent = challenge.encrypted;
    
    // Show cipher name upfront (educational approach)
    showCipherNameUpfront();
    
    // Load notepad content
    loadNotepadContent();
}

function submitGuess() {
    const guess = DOM.guessInput.value.trim().toUpperCase();
    
    if (!guess) {
        showFeedback('Please enter a guess', 'error');
        return;
    }
    
    if (GameState.guesses.includes(guess)) {
        showFeedback('You already tried that!', 'warning');
        return;
    }
    
    GameState.guesses.push(guess);
    GameState.levelStats.totalAttempts++;
    
    const isCorrect = guess === GameState.currentChallenge.original.toUpperCase();
    addGuessToList(guess, isCorrect);
    
    if (isCorrect) {
        handleCorrectGuess();
    } else {
        handleWrongGuess(guess);
    }
    
    DOM.guessInput.value = '';
    DOM.guessInput.focus();
}

function handleCorrectGuess() {
    stopTimer();
    
    const timeTaken = GameState.timeElapsed;
    const points = calculatePotentialScore();
    
    GameState.roundScore = points;
    GameState.totalScore += points;
    GameState.streak++;
    GameState.levelStats.correctAnswers++;
    GameState.levelStats.totalScore += points;
    GameState.levelStats.fastestTime = Math.min(GameState.levelStats.fastestTime, timeTaken);
    
    // Update progress bar immediately to show completion
    updateProgress(GameState.challengeNumber);
    
    // Update stats
    GameState.stats.passwordsCracked++;
    GameState.stats.highestScore = Math.max(GameState.stats.highestScore, GameState.totalScore);
    GameState.stats.bestStreak = Math.max(GameState.stats.bestStreak, GameState.streak);
    GameState.stats.totalTimePlayed += timeTaken;
    
    // Update cipher stats
    const cipherName = GameState.currentChallenge.cipherName;
    if (!GameState.stats.cipherStats[cipherName]) {
        GameState.stats.cipherStats[cipherName] = { solved: 0, attempts: 0 };
    }
    GameState.stats.cipherStats[cipherName].solved++;
    GameState.stats.cipherStats[cipherName].attempts++;
    
    saveStats();
    updateHeaderStats();
    
    // Save notepad content
    saveNotepadContent();
    
    // Celebration
    Confetti.start(2000);
    
    endChallenge(true);
}

function handleWrongGuess(guess) {
    // No attempt limit - just provide feedback
    const original = GameState.currentChallenge.original.toUpperCase();
    const matchingLetters = countMatchingLetters(guess, original);
    
    if (matchingLetters > 0 && matchingLetters >= original.length / 2) {
        showFeedback(`Close! ${matchingLetters} letters match`, 'partial');
    } else if (matchingLetters > 0) {
        showFeedback(`${matchingLetters} letter(s) in correct position`, 'partial');
    } else {
        showFeedback('No letters in correct position', 'error');
    }
}

function countMatchingLetters(guess, original) {
    let count = 0;
    const minLen = Math.min(guess.length, original.length);
    
    for (let i = 0; i < minLen; i++) {
        if (guess[i] === original[i]) count++;
    }
    
    return count;
}

function endChallenge(success) {
    stopTimer();
    
    const challenge = GameState.currentChallenge;
    const timeTaken = GameState.timeElapsed;
    
    if (!success) {
        GameState.streak = 0;
        GameState.stats.passwordsFailed++;
        saveStats();
    }
    
    // Update result screen
    DOM.resultIcon.textContent = success ? '🎉' : '😢';
    DOM.resultTitle.textContent = success ? 'Password Cracked!' : 'Challenge Failed';
    DOM.resultMessage.textContent = success 
        ? `Excellent work! You decoded it in ${formatTime(timeTaken)}!`
        : `The password was "${challenge.original}"`;
    DOM.resultPassword.textContent = challenge.original;
    DOM.resultPoints.textContent = success ? `+${GameState.roundScore}` : '+0';
    DOM.resultPoints.style.color = success ? 'var(--success)' : 'var(--danger)';
    DOM.resultTime.textContent = formatTime(timeTaken);
    
    // Update button text
    if (GameState.challengeNumber >= GameState.totalChallenges) {
        DOM.nextChallengeBtn.innerHTML = `Complete Level <span class="btn-icon">→</span>`;
    } else {
        DOM.nextChallengeBtn.innerHTML = `Next Challenge <span class="btn-icon">→</span>`;
    }
    
    updateHeaderStats();
    showScreen('result-screen');
}

function showLevelComplete() {
    const level = Levels.getLevel(GameState.currentLevel);
    const stats = GameState.levelStats;
    
    // Calculate accuracy
    const accuracy = stats.correctAnswers > 0 
        ? Math.round((stats.correctAnswers / GameState.totalChallenges) * 100)
        : 0;
    
    // Save game to history
    if (!GameState.stats.gameHistory) {
        GameState.stats.gameHistory = [];
    }
    GameState.stats.gameHistory.push({
        timestamp: Date.now(),
        level: GameState.currentLevel,
        score: stats.totalScore,
        accuracy: accuracy,
        challengesCompleted: stats.correctAnswers,
        totalChallenges: GameState.totalChallenges
    });
    
    // Keep only last 50 games
    if (GameState.stats.gameHistory.length > 50) {
        GameState.stats.gameHistory = GameState.stats.gameHistory.slice(-50);
    }
    
    // Check for level unlock - only unlock if player completed enough challenges
    const requiredChallenges = 5; // Must complete at least 5 challenges to unlock next level
    if (stats.correctAnswers >= requiredChallenges && GameState.currentLevel >= GameState.stats.highestLevel) {
        GameState.stats.highestLevel = GameState.currentLevel + 1;
        console.log(`🔓 Level ${GameState.currentLevel + 1} unlocked! (Completed ${stats.correctAnswers}/${GameState.totalChallenges} challenges)`);
    } else {
        console.log(`⚠️ Need ${requiredChallenges} challenges to unlock next level (Completed: ${stats.correctAnswers})`);
    }
    
    saveStats();
    
    // Big celebration!
    Confetti.start(4000);
    
    // Get random completion message
    const message = Levels.getCompletionMessage(GameState.currentLevel);
    
    // Update UI
    DOM.completedLevel.textContent = GameState.currentLevel;
    DOM.levelNameDisplay.textContent = level.name;
    DOM.levelCompleteMessage.textContent = message;
    DOM.levelTotalScore.textContent = stats.totalScore.toLocaleString();
    DOM.levelAccuracy.textContent = `${accuracy}%`;
    DOM.levelBestTime.textContent = stats.fastestTime === Infinity 
        ? 'N/A' 
        : formatTime(stats.fastestTime);
    
    // Show unlock notice if applicable
    const nextLevel = Levels.getLevel(GameState.currentLevel + 1);
    if (nextLevel) {
        DOM.unlockNotice.style.display = 'inline-flex';
        DOM.unlockNotice.innerHTML = `
            <span class="unlock-icon">🔓</span>
            <span>Level ${nextLevel.id}: ${nextLevel.name} unlocked!</span>
        `;
        DOM.continueNextLevelBtn.style.display = 'block';
    } else {
        DOM.unlockNotice.innerHTML = `
            <span class="unlock-icon">🏆</span>
            <span>You've completed all levels! You're a Cipher Master!</span>
        `;
        DOM.continueNextLevelBtn.style.display = 'none';
    }
    
    showScreen('level-complete-screen');
}

// =========================================
// UI Reset Functions
// =========================================
function resetGameUIElements() {
    // Reset hint badge
    if (DOM.hintsUsedBadge) {
        DOM.hintsUsedBadge.classList.add('hidden');
        DOM.hintsUsedBadge.textContent = '';
    }
    
    // Reset hint button appearance
    if (DOM.hintBtn) {
        DOM.hintBtn.classList.remove('all-used');
    }
    
    // Reset hint tooltip to default (for first hint)
    if (DOM.hintTooltipContent) {
        DOM.hintTooltipContent.innerHTML = '<strong>Description</strong><span>Learn how this cipher works</span>';
    }
    if (DOM.hintTooltipCost) {
        DOM.hintTooltipCost.textContent = 'Cost: ×0.9';
    }
    
    // Hide Python IDE button
    if (DOM.showPythonIdeBtn) {
        DOM.showPythonIdeBtn.classList.add('hidden');
    }
    
    // Clear previous attempts list
    clearAttemptsList();
    
    console.log('✅ Game UI elements reset (including hint tooltip)');
}

// =========================================
// Give Up System
// =========================================
function showGiveUpConfirmation() {
    showModal('give-up-modal');
}

function confirmGiveUp() {
    hideModal('give-up-modal');
    stopTimer();
    
    const challenge = GameState.currentChallenge;
    
    // Update stats
    GameState.stats.passwordsFailed++;
    GameState.streak = 0;
    saveStats();
    
    // Show game over modal
    DOM.gameOverIcon.textContent = '🏳️';
    DOM.gameOverTitle.textContent = 'Password Revealed';
    DOM.revealedPassword.textContent = challenge.original;
    DOM.finalScore.textContent = GameState.totalScore.toLocaleString();
    DOM.challengesCompleted.textContent = GameState.challengeNumber - 1;
    DOM.challengesTotal.textContent = GameState.totalChallenges;
    
    showModal('game-over-modal');
}

function startNewGame() {
    hideModal('game-over-modal');
    startGame(GameState.currentLevel);
}

// =========================================
// Event Listeners
// =========================================
function initEventListeners() {
    // Logo click - return to home and pause game
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            pauseGame();
            resetGameUIElements();
            showScreen('start-screen');
        });
        logo.style.cursor = 'pointer';
    }
    
    // Level selection
    DOM.levelButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const levelId = parseInt(btn.dataset.level);
            if (!btn.classList.contains('locked')) {
                GameState.currentLevel = levelId;
                updateLevelButtons();
            }
        });
    });
    
    // Start game
    DOM.startGameBtn.addEventListener('click', () => {
        startGame(GameState.currentLevel);
    });
    
    // Submit guess
    DOM.submitGuessBtn.addEventListener('click', submitGuess);
    DOM.guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitGuess();
        }
    });
    
    // Hint button (single button)
    if (DOM.hintBtn) {
        DOM.hintBtn.addEventListener('click', useNextHint);
    }
    
    // Give up button
    DOM.giveUpBtn.addEventListener('click', showGiveUpConfirmation);
    DOM.confirmGiveUpBtn.addEventListener('click', confirmGiveUp);
    DOM.cancelGiveUpBtn.addEventListener('click', () => hideModal('give-up-modal'));
    
    // Game over modal
    DOM.newGameBtn.addEventListener('click', startNewGame);
    DOM.gameOverMenuBtn.addEventListener('click', () => {
        hideModal('game-over-modal');
        resetGameUIElements();
        updateLevelButtons();
        showScreen('start-screen');
    });
    
    // Result screen
    DOM.nextChallengeBtn.addEventListener('click', () => {
        if (GameState.challengeNumber >= GameState.totalChallenges) {
            showLevelComplete();
        } else {
            nextChallenge();
        }
    });
    
    // Result screen - Enter key
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && DOM.resultScreen.classList.contains('active')) {
            if (GameState.challengeNumber >= GameState.totalChallenges) {
                showLevelComplete();
            } else {
                nextChallenge();
            }
        }
    });
    
    DOM.backToMenuBtn.addEventListener('click', () => {
        stopTimer();
        resetGameUIElements();
        updateLevelButtons();
        showScreen('start-screen');
    });
    
    // Level complete screen
    DOM.continueNextLevelBtn.addEventListener('click', () => {
        const nextLevelId = GameState.currentLevel + 1;
        if (Levels.getLevel(nextLevelId)) {
            startGame(nextLevelId);
        }
    });
    
    DOM.replayLevelBtn.addEventListener('click', () => {
        startGame(GameState.currentLevel);
    });
    
    DOM.levelMenuBtn.addEventListener('click', () => {
        resetGameUIElements();
        updateLevelButtons();
        showScreen('start-screen');
    });
    
    // Modals
    DOM.howToPlayBtn.addEventListener('click', () => {
        showModal('how-to-play-modal');
    });
    
    DOM.closeHowToPlay.addEventListener('click', () => {
        hideModal('how-to-play-modal');
    });
    
    if (DOM.viewStatsBtn) {
        DOM.viewStatsBtn.addEventListener('click', () => {
            try {
                console.log('View Stats button clicked');
                updateStatsModal();
                const modal = document.getElementById('stats-modal');
                console.log('Stats modal element:', modal);
                if (modal) {
                    showModal('stats-modal');
                    console.log('Modal should be visible now');
                } else {
                    console.error('Stats modal element not found in DOM');
                    showToast('Stats modal not found', 'error');
                }
            } catch (error) {
                console.error('Error opening stats modal:', error);
                showToast('Error opening statistics', 'error');
            }
        });
    } else {
        console.error('View Stats button not found in DOM');
    }
    
    DOM.closeStats.addEventListener('click', () => {
        hideModal('stats-modal');
    });
    
    DOM.resetStatsBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all your stats? This cannot be undone.')) {
            resetStats();
        }
    });
    
    // Python IDE
    if (DOM.runPythonBtn) {
        DOM.runPythonBtn.addEventListener('click', runPythonCode);
    }
    if (DOM.closePythonIde) {
        DOM.closePythonIde.addEventListener('click', () => {
            hideModal('python-ide-modal');
        });
    }
    
    // Python IDE reopen button
    const showPythonIdeBtn = document.getElementById('show-python-ide-btn');
    if (showPythonIdeBtn) {
        showPythonIdeBtn.addEventListener('click', () => {
            showModal('python-ide-modal');
        });
    }
    
    // Python code editor - keyboard shortcuts
    if (DOM.pythonCodeEditor) {
        DOM.pythonCodeEditor.addEventListener('keydown', (e) => {
            // Tab for indentation
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = e.target.selectionStart;
                const end = e.target.selectionEnd;
                const value = e.target.value;
                
                // Insert tab (4 spaces)
                e.target.value = value.substring(0, start) + '    ' + value.substring(end);
                e.target.selectionStart = e.target.selectionEnd = start + 4;
            }
            
            // Ctrl+/ or Cmd+/ for comment toggle
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                const start = e.target.selectionStart;
                const end = e.target.selectionEnd;
                const value = e.target.value;
                const lines = value.split('\n');
                
                // Find the lines that are selected
                let currentPos = 0;
                let startLine = 0;
                let endLine = 0;
                for (let i = 0; i < lines.length; i++) {
                    if (currentPos + lines[i].length >= start && startLine === 0) {
                        startLine = i;
                    }
                    if (currentPos + lines[i].length >= end) {
                        endLine = i;
                        break;
                    }
                    currentPos += lines[i].length + 1; // +1 for newline
                }
                
                // Toggle comments on selected lines
                for (let i = startLine; i <= endLine; i++) {
                    if (lines[i].trim().startsWith('#')) {
                        lines[i] = lines[i].replace(/^(\s*)#\s?/, '$1');
                    } else {
                        lines[i] = '# ' + lines[i];
                    }
                }
                
                e.target.value = lines.join('\n');
            }
            
            // Ctrl+X or Cmd+X for cut
            if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
                const start = e.target.selectionStart;
                const end = e.target.selectionEnd;
                const value = e.target.value;
                
                if (start === end) {
                    // No selection - cut the entire line
                    e.preventDefault();
                    const lines = value.split('\n');
                    
                    // Find which line the cursor is on
                    let currentPos = 0;
                    let lineIndex = 0;
                    for (let i = 0; i < lines.length; i++) {
                        if (currentPos + lines[i].length >= start) {
                            lineIndex = i;
                            break;
                        }
                        currentPos += lines[i].length + 1;
                    }
                    
                    // Copy line to clipboard
                    const lineToCut = lines[lineIndex] + '\n';
                    navigator.clipboard.writeText(lineToCut).then(() => {
                        // Remove the line
                        lines.splice(lineIndex, 1);
                        e.target.value = lines.join('\n');
                        
                        // Position cursor at start of next line
                        const newPos = lines.slice(0, lineIndex).join('\n').length + (lineIndex > 0 ? 1 : 0);
                        e.target.selectionStart = e.target.selectionEnd = Math.min(newPos, e.target.value.length);
                    });
                }
                // If there's a selection, browser default cut will work
            }
        });
    }
    
    // Notepad - auto-save on input and toggle
    if (DOM.notepadTextarea) {
        DOM.notepadTextarea.addEventListener('input', saveNotepadContent);
    }
    if (DOM.notepadToggle) {
        DOM.notepadToggle.addEventListener('click', toggleNotepad);
    }
    
    function toggleNotepad() {
        if (DOM.notepadPanel) {
            DOM.notepadPanel.classList.toggle('hidden');
            const gameLayout = document.querySelector('.game-layout-3col');
            if (gameLayout) {
                gameLayout.classList.toggle('notepad-hidden');
            }
        }
    }
    
    // Close modals on backdrop click
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => modal.classList.remove('active'));
        }
    });
}

// =========================================
// Initialization
// =========================================
function init() {
    loadStats();
    updateLevelButtons();
    updateHeaderStats();
    initEventListeners();
    Confetti.init();
    
    console.log('🔐 CyCrack initialized!');
    console.log('📊 Stats loaded:', GameState.stats);
    console.log('🐍 Initializing Python runtime...');
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    init();
    initPyodide();
});
