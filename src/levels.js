/**
 * CyCrack - Level Configuration
 * Defines levels, their ciphers, word generation, and progression rules
 */

const Levels = {
    // =========================================
    // Game Session Seed (set when game starts)
    // =========================================
    gameSeed: null,
    challengeCounter: 0,

    // =========================================
    // Word Length Configuration by Level
    // =========================================
    wordLengths: {
        1: 3,   // Rookie: 3 characters
        2: 5,   // Initiate: 5 characters
        3: 8,   // Hacker: 8 characters
        4: 10,  // Expert: 10 characters
        5: 15,  // Master: 15 characters
        6: 12,  // Legendary: 12 characters
        endless: 8  // Endless mode: 8 characters
    },

    // =========================================
    // Endless Mode Configuration
    // =========================================
    endlessMode: {
        allCiphers: [
            'reversed', 'rot13', 'simpleShift', 'pigLatin', 'rot5',
            'caesar', 'atbash', 'a1z26', 'keyword', 'beaufort',
            'vigenere', 'railFence', 'morse', 'binary', 'playfair', 'polybius',
            'affine', 'substitution', 'columnar', 'hex', 'bifid', 'adfgx',
            'doubleCaesar', 'reverseCaesar', 'atbashVigenere', 'fourSquare',
            'xorCipher', 'base64ish'
        ],
        basePoints: 100,
        pointsIncreasePerRound: 25,
        xpPerSolve: 25
    },

    /**
     * Initialize game seed based on current date/time
     * Called when starting a new game
     */
    initializeGameSeed() {
        const now = new Date();
        // Create seed from current timestamp
        this.gameSeed = now.getFullYear() * 10000000000 +
                       (now.getMonth() + 1) * 100000000 +
                       now.getDate() * 1000000 +
                       now.getHours() * 10000 +
                       now.getMinutes() * 100 +
                       now.getSeconds();
        this.challengeCounter = 0;
        return this.gameSeed;
    },

    /**
     * Seeded random number generator (Mulberry32)
     * Produces deterministic results based on seed
     */
    seededRandom(seed) {
        let t = seed + 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    },

    /**
     * Generate a random letter sequence based on seed and challenge number
     * Uses Fisher-Yates shuffle with seeded random for true randomization
     */
    generateRandomWord(levelId) {
        const length = this.wordLengths[levelId] || 5;
        
        // Create unique seed for this challenge
        const challengeSeed = this.gameSeed + (this.challengeCounter * 12345);
        this.challengeCounter++;
        
        let word = '';
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        // Generate random letters using seeded RNG
        for (let i = 0; i < length; i++) {
            const charSeed = challengeSeed + (i * 7919); // Prime multiplier for variation
            const randomValue = this.seededRandom(charSeed);
            const letterIndex = Math.floor(randomValue * 26);
            word += alphabet[letterIndex];
        }
        
        return word;
    },

    // =========================================
    // Cipher Categories (for Hint 1)
    // =========================================
    cipherCategories: {
        reversed: 'Transposition Cipher',
        rot13: 'Substitution Cipher',
        simpleShift: 'Substitution Cipher',
        pigLatin: 'Encoding Scheme',
        rot5: 'Encoding Scheme',
        caesar: 'Substitution Cipher',
        atbash: 'Substitution Cipher',
        a1z26: 'Encoding Scheme',
        keyword: 'Substitution Cipher',
        beaufort: 'Polyalphabetic Cipher',
        vigenere: 'Polyalphabetic Cipher',
        railFence: 'Transposition Cipher',
        morse: 'Encoding Scheme',
        binary: 'Binary Encoding',
        playfair: 'Digraphic Cipher',
        polybius: 'Encoding Scheme',
        affine: 'Mathematical Cipher',
        substitution: 'Monoalphabetic Cipher',
        columnar: 'Transposition Cipher',
        hex: 'Hexadecimal Encoding',
        bifid: 'Digraphic Cipher',
        adfgx: 'Digraphic Cipher',
        doubleCaesar: 'Compound Cipher',
        reverseCaesar: 'Compound Cipher',
        atbashVigenere: 'Compound Cipher',
        fourSquare: 'Digraphic Cipher',
        xorCipher: 'Stream Cipher',
        base64ish: 'Encoding Scheme'
    },

    // =========================================
    // Level Definitions
    // =========================================
    definitions: [
        {
            id: 1,
            name: 'Rookie',
            description: 'Basic ciphers to get you started',
            ciphers: ['reversed', 'rot13', 'simpleShift', 'pigLatin', 'rot5'],
            wordLength: 3,
            challengesPerLevel: 5,
            timeLimit: 120,
            maxAttempts: 5,
            basePoints: 100,
            timeBonus: 2,
            unlockRequirement: 0,
            streakMultiplier: 1.1,
            xpReward: 50,
            completionMessages: [
                "You've taken your first steps into cryptography!",
                "Not bad for a beginner! The codes are getting nervous.",
                "Rookie no more! You're starting to think like a codebreaker."
            ]
        },
        {
            id: 2,
            name: 'Initiate',
            description: 'Classic ciphers with more challenge',
            ciphers: ['caesar', 'atbash', 'a1z26', 'keyword', 'beaufort'],
            wordLength: 5,
            challengesPerLevel: 5,
            timeLimit: 100,
            maxAttempts: 4,
            basePoints: 150,
            timeBonus: 3,
            unlockRequirement: 1,
            streakMultiplier: 1.15,
            xpReward: 75,
            completionMessages: [
                "Julius Caesar would be impressed!",
                "You're cracking codes like a true initiate.",
                "The ancient ciphers bow before your skills!"
            ]
        },
        {
            id: 3,
            name: 'Hacker',
            description: 'Complex ciphers requiring more thought',
            ciphers: ['vigenere', 'railFence', 'morse', 'binary', 'playfair', 'polybius'],
            wordLength: 8,
            challengesPerLevel: 5,
            timeLimit: 120,
            maxAttempts: 4,
            basePoints: 200,
            timeBonus: 4,
            unlockRequirement: 2,
            streakMultiplier: 1.2,
            xpReward: 100,
            completionMessages: [
                "You're hacking through ciphers like a pro!",
                "The digital realm trembles at your approach.",
                "Elite hacker status: CONFIRMED."
            ]
        },
        {
            id: 4,
            name: 'Expert',
            description: 'Advanced ciphers for seasoned crackers',
            ciphers: ['affine', 'substitution', 'columnar', 'hex', 'bifid', 'adfgx'],
            wordLength: 10,
            challengesPerLevel: 5,
            timeLimit: 150,
            maxAttempts: 4,
            basePoints: 300,
            timeBonus: 5,
            unlockRequirement: 3,
            streakMultiplier: 1.25,
            xpReward: 150,
            completionMessages: [
                "Expert-level skills unlocked!",
                "Even the NSA is taking notes.",
                "Cryptographic mastery is within your grasp!"
            ]
        },
        {
            id: 5,
            name: 'Master',
            description: 'Combined ciphers - the ultimate test',
            ciphers: ['doubleCaesar', 'reverseCaesar', 'atbashVigenere', 'fourSquare'],
            wordLength: 15,
            challengesPerLevel: 5,
            timeLimit: 180,
            maxAttempts: 5,
            basePoints: 500,
            timeBonus: 8,
            unlockRequirement: 4,
            streakMultiplier: 1.5,
            xpReward: 250,
            completionMessages: [
                "Master-level complete! One level remains...",
                "The Enigma machine weeps at your brilliance.",
                "Almost legendary! Can you handle the final challenge?"
            ]
        },
        {
            id: 6,
            name: 'Legendary',
            description: 'Modern cryptography concepts - for true masters',
            ciphers: ['xorCipher', 'base64ish', 'fourSquare', 'bifid', 'playfair'],
            wordLength: 12,
            challengesPerLevel: 5,
            timeLimit: 240,
            maxAttempts: 6,
            basePoints: 750,
            timeBonus: 10,
            unlockRequirement: 5,
            streakMultiplier: 2.0,
            xpReward: 500,
            completionMessages: [
                "LEGENDARY STATUS ACHIEVED! You are a true Cipher Master!",
                "You've conquered the impossible! The cryptographic world bows to you.",
                "Beyond legendary! You've transcended mere mortal codebreaking!"
            ]
        }
    ],

    // =========================================
    // Hint Multipliers (new system)
    // =========================================
    hintMultipliers: {
        0: 1.0,    // No hints used
        1: 0.9,    // Cipher category revealed
        2: 0.7,    // Full cipher explanation
        3: 0.4     // Character example shown
    },

    // =========================================
    // Helper Methods
    // =========================================

    /**
     * Get level by ID
     */
    getLevel(levelId) {
        return this.definitions.find(l => l.id === levelId);
    },

    /**
     * Get random cipher for a level
     */
    getRandomCipher(levelId) {
        const level = this.getLevel(levelId);
        if (!level) return 'reversed';
        return level.ciphers[Math.floor(Math.random() * level.ciphers.length)];
    },

    /**
     * Get cipher category name
     */
    getCipherCategory(cipherName) {
        return this.cipherCategories[cipherName] || 'Unknown Cipher';
    },

    /**
     * Check if level is unlocked based on progress
     */
    isLevelUnlocked(levelId, highestCompletedLevel) {
        const level = this.getLevel(levelId);
        if (!level) return false;
        return highestCompletedLevel >= level.unlockRequirement;
    },

    /**
     * Calculate score for a challenge with new hint system
     * timeElapsed is now the time taken (counting up)
     */
    calculateScore(levelId, timeElapsed, hintsUsedCount, attempts, streak) {
        const level = this.getLevel(levelId);
        if (!level) return 0;

        // Base score
        let score = level.basePoints;

        // Time penalty (points decrease as time increases)
        // Max bonus at 0 seconds, decreases linearly
        const maxTimeBonus = level.basePoints * 0.5; // Up to 50% bonus for speed
        const timePenalty = Math.min(timeElapsed * 2, maxTimeBonus); // 2 points per second
        score += maxTimeBonus - timePenalty;

        // Hint multiplier (based on number of hints used)
        const hintMultiplier = this.hintMultipliers[Math.min(hintsUsedCount, 3)];
        score *= hintMultiplier;

        // Attempt bonus (more points for fewer attempts)
        const attemptBonus = [1.5, 1.25, 1.1, 1.0, 0.85];
        const attemptMultiplier = attemptBonus[Math.min(attempts - 1, 4)];
        score *= attemptMultiplier;

        // Streak multiplier
        const streakBonus = Math.min(streak, 5) * (level.streakMultiplier - 1);
        score *= (1 + streakBonus);

        return Math.round(Math.max(score, 10));
    },

    /**
     * Get random completion message for a level
     */
    getCompletionMessage(levelId) {
        const level = this.getLevel(levelId);
        if (!level || !level.completionMessages) {
            return "Level Complete!";
        }
        const messages = level.completionMessages;
        return messages[Math.floor(Math.random() * messages.length)];
    },

    /**
     * Generate a challenge
     */
    generateChallenge(levelId) {
        const level = this.getLevel(levelId);
        if (!level) return null;

        // Generate random word based on seed and level
        const word = this.generateRandomWord(levelId);
        const cipherName = this.getRandomCipher(levelId);
        const cipher = Ciphers[cipherName];

        if (!cipher) return null;

        // Randomize cipher parameters if available
        if (cipher.randomize) {
            cipher.randomize();
        }

        // Store current cipher parameters
        let cipherParams = {};
        if (cipherName === 'caesar') {
            cipherParams.shift = cipher.shift;
        } else if (cipherName === 'vigenere') {
            cipherParams.keyword = cipher.keyword;
        } else if (cipherName === 'railFence') {
            cipherParams.rails = cipher.rails;
        } else if (cipherName === 'affine') {
            cipherParams.a = cipher.a;
            cipherParams.b = cipher.b;
        } else if (cipherName === 'substitution') {
            cipherParams.key = cipher.key;
        } else if (cipherName === 'columnar') {
            cipherParams.keyword = cipher.keyword;
        } else if (cipherName === 'doubleCaesar') {
            cipherParams.shift1 = cipher.shift1;
            cipherParams.shift2 = cipher.shift2;
        } else if (cipherName === 'reverseCaesar') {
            cipherParams.shift = cipher.shift;
        } else if (cipherName === 'atbashVigenere') {
            cipherParams.keyword = cipher.keyword;
        }

        // Encode the word
        const encrypted = cipher.encode(word);

        return {
            original: word,
            encrypted: encrypted,
            cipherName: cipherName,
            cipherCategory: this.getCipherCategory(cipherName),
            cipherDisplayName: cipher.name,
            cipherDescription: cipher.description,
            cipherDifficulty: cipher.difficulty,
            cipherParams: cipherParams,
            levelId: levelId,
            timeLimit: level.timeLimit,
            maxAttempts: level.maxAttempts,
            basePoints: level.basePoints
        };
    },

    /**
     * Get all levels with unlock status
     */
    getAllLevelsWithStatus(highestCompletedLevel) {
        return this.definitions.map(level => ({
            ...level,
            isUnlocked: this.isLevelUnlocked(level.id, highestCompletedLevel)
        }));
    }
};

// Freeze to prevent modifications
Object.freeze(Levels.definitions);
Object.freeze(Levels.cipherCategories);
Object.freeze(Levels.hintMultipliers);
Object.freeze(Levels.wordLengths);
