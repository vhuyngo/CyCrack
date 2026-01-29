/**
 * CyCrack - Cipher Implementations
 * Contains all cryptographic cipher algorithms used in the game
 */

const Ciphers = {
    // Alphabet helpers
    ALPHABET: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    
    /**
     * Helper: Check if character is a letter
     */
    isLetter(char) {
        return /[a-zA-Z]/.test(char);
    },

    /**
     * Helper: Get letter index (0-25)
     */
    letterIndex(char) {
        return char.toUpperCase().charCodeAt(0) - 65;
    },

    /**
     * Helper: Get letter from index (0-25)
     */
    indexToLetter(index, preserveCase = false, wasUpperCase = true) {
        const letter = String.fromCharCode((index % 26 + 26) % 26 + 65);
        return preserveCase && !wasUpperCase ? letter.toLowerCase() : letter;
    },

    // =========================================
    // LEVEL 1 CIPHERS - Rookie
    // =========================================

    /**
     * Reversed Text
     * Simply reverses the order of characters
     */
    reversed: {
        name: 'Reversed',
        difficulty: 'easy',
        description: 'The text is simply written backwards. Read it from right to left to decode.',
        
        encode(text) {
            return text.split('').reverse().join('');
        },
        
        decode(text) {
            return text.split('').reverse().join('');
        },
        
        getHint() {
            return 'Try reading the text backwards!';
        },

        getExample(firstLetter) {
            return {
                visual: `Encryption: "ABC" → "CBA" (reverse order)\nDecryption: "CBA" → "ABC" (reverse again)`,
                text: `In the full word, ${firstLetter} moves to the opposite end`
            };
        },

        getPythonCode(encrypted) {
            return `# Reversed Cipher Decoder
# The text is written backwards - reverse it to decode

encrypted = "${encrypted}"

# TODO: Reverse the string to get the original
# Hint: Use string slicing [::-1] or reversed()

decoded = encrypted  # Fix this line

print("Decoded:", decoded)`;
        }
    },

    /**
     * ROT13 Cipher
     * Rotates each letter by 13 positions (self-inverting)
     */
    rot13: {
        name: 'ROT13',
        difficulty: 'easy',
        description: 'Each letter is replaced by the letter 13 positions after it in the alphabet. A becomes N, B becomes O, etc.',
        
        encode(text) {
            return text.split('').map(char => {
                if (!Ciphers.isLetter(char)) return char;
                const isUpper = char === char.toUpperCase();
                const index = Ciphers.letterIndex(char);
                const newIndex = (index + 13) % 26;
                return Ciphers.indexToLetter(newIndex, true, isUpper);
            }).join('');
        },
        
        decode(text) {
            return this.encode(text);
        },
        
        getHint() {
            return 'Shift each letter by 13 positions';
        },

        getExample(firstLetter) {
            const index = Ciphers.letterIndex(firstLetter);
            const encoded = Ciphers.indexToLetter((index + 13) % 26);
            return {
                visual: `Encryption: ${firstLetter} + 13 → ${encoded}\nDecryption: ${encoded} + 13 → ${firstLetter} (self-inverting)`,
                text: `${firstLetter} → ${encoded}`
            };
        },

        getPythonCode(encrypted) {
            return `# ROT13 Cipher Decoder
# Each letter shifts by 13 positions (self-inverting)

encrypted = "${encrypted}"

# TODO: Shift each letter back by 13 positions
# Hint: (ord(c) - ord('A') + 13) % 26 + ord('A')

decoded = ""
for char in encrypted:
    if char.isalpha():
        # Fix this: shift by 13
        decoded += char  # Replace with shifted character
    else:
        decoded += char

print("Decoded:", decoded)`;
        }
    },

    /**
     * Letter Shift (Simple)
     * Shifts letters by 1 position
     */
    simpleShift: {
        name: 'Simple Shift',
        difficulty: 'easy',
        description: 'Each letter is replaced by the next letter in the alphabet. A becomes B, B becomes C, etc.',
        
        encode(text) {
            return text.split('').map(char => {
                if (!Ciphers.isLetter(char)) return char;
                const isUpper = char === char.toUpperCase();
                const index = Ciphers.letterIndex(char);
                const newIndex = (index + 1) % 26;
                return Ciphers.indexToLetter(newIndex, true, isUpper);
            }).join('');
        },
        
        decode(text) {
            return text.split('').map(char => {
                if (!Ciphers.isLetter(char)) return char;
                const isUpper = char === char.toUpperCase();
                const index = Ciphers.letterIndex(char);
                const newIndex = (index - 1 + 26) % 26;
                return Ciphers.indexToLetter(newIndex, true, isUpper);
            }).join('');
        },
        
        getHint() {
            return 'Each letter shifts to the next letter in the alphabet';
        },

        getExample(firstLetter) {
            const index = Ciphers.letterIndex(firstLetter);
            const encoded = Ciphers.indexToLetter((index + 1) % 26);
            return {
                visual: `Encryption: ${firstLetter} + 1 → ${encoded}\nDecryption: ${encoded} - 1 → ${firstLetter}`,
                text: `${firstLetter} → ${encoded}`
            };
        },

        getPythonCode(encrypted) {
            return `# Simple Shift Cipher Decoder
# Each letter was shifted forward by 1, so shift back by 1

encrypted = "${encrypted}"

# TODO: Shift each letter back by 1 position
# Hint: (ord(c) - ord('A') - 1) % 26 + ord('A')

decoded = ""
for char in encrypted:
    if char.isalpha():
        # Fix this: shift back by 1
        decoded += char  # Replace with shifted character
    else:
        decoded += char

print("Decoded:", decoded)`;
        }
    },

    // =========================================
    // LEVEL 2 CIPHERS - Initiate
    // =========================================

    /**
     * Caesar Cipher
     * Classic shift cipher with variable shift amount
     */
    caesar: {
        name: 'Caesar Cipher',
        difficulty: 'easy',
        description: 'A substitution cipher where each letter is shifted by a fixed number of positions in the alphabet. Named after Julius Caesar who used it with a shift of 3.',
        shift: 3,
        
        encode(text, shift = this.shift) {
            return text.split('').map(char => {
                if (!Ciphers.isLetter(char)) return char;
                const isUpper = char === char.toUpperCase();
                const index = Ciphers.letterIndex(char);
                const newIndex = (index + shift) % 26;
                return Ciphers.indexToLetter(newIndex, true, isUpper);
            }).join('');
        },
        
        decode(text, shift = this.shift) {
            return this.encode(text, -shift);
        },
        
        getHint(shift = this.shift) {
            return `Shift value: ${shift}`;
        },
        
        randomize() {
            this.shift = Math.floor(Math.random() * 25) + 1;
            return this.shift;
        },

        getExample(firstLetter, shift = this.shift) {
            const index = Ciphers.letterIndex(firstLetter);
            const encoded = Ciphers.indexToLetter((index + shift) % 26);
            return {
                visual: `Encryption: ${firstLetter} + ${shift} → ${encoded}\nDecryption: ${encoded} - ${shift} → ${firstLetter}`,
                text: `${firstLetter} → ${encoded}`
            };
        },

        getPythonCode(encrypted, shift = this.shift) {
            return `# Caesar Cipher Decoder
# Each letter was shifted forward by ${shift}, so shift back

encrypted = "${encrypted}"
shift = ${shift}

# TODO: Shift each letter back by the shift value
# Hint: (ord(c) - ord('A') - shift) % 26 + ord('A')

decoded = ""
for char in encrypted:
    if char.isalpha():
        # Fix this: subtract shift and handle wrap-around
        new_pos = (ord(char) - ord('A') - shift) % 26
        decoded += chr(new_pos + ord('A'))
    else:
        decoded += char

print("Decoded:", decoded)`;
        }
    },

    /**
     * Atbash Cipher
     * Substitution cipher where A=Z, B=Y, etc.
     */
    atbash: {
        name: 'Atbash Cipher',
        difficulty: 'medium',
        description: 'Each letter is replaced with its reverse in the alphabet. A becomes Z, B becomes Y, and so on. It\'s a mirror cipher.',
        
        encode(text) {
            return text.split('').map(char => {
                if (!Ciphers.isLetter(char)) return char;
                const isUpper = char === char.toUpperCase();
                const index = Ciphers.letterIndex(char);
                const newIndex = 25 - index;
                return Ciphers.indexToLetter(newIndex, true, isUpper);
            }).join('');
        },
        
        decode(text) {
            return this.encode(text);
        },
        
        getHint() {
            return 'A=Z, B=Y, C=X... (mirror alphabet)';
        },

        getExample(firstLetter) {
            const index = Ciphers.letterIndex(firstLetter);
            const encoded = Ciphers.indexToLetter(25 - index);
            return {
                visual: `Encryption: ${firstLetter} ↔ ${encoded} (mirror alphabet)\nDecryption: ${encoded} ↔ ${firstLetter} (self-inverting)`,
                text: `${firstLetter} → ${encoded} (self-inverting)`
            };
        },

        getPythonCode(encrypted) {
            return `# Atbash Cipher Decoder
# Mirror cipher: A↔Z, B↔Y, C↔X, etc. (self-inverting)

encrypted = "${encrypted}"

# TODO: Replace each letter with its mirror
# Hint: new_pos = 25 - (ord(c) - ord('A'))

decoded = ""
for char in encrypted:
    if char.isalpha():
        # Fix this: find the mirror letter
        pos = ord(char) - ord('A')
        mirror_pos = 25 - pos
        decoded += chr(mirror_pos + ord('A'))
    else:
        decoded += char

print("Decoded:", decoded)`;
        }
    },

    /**
     * A1Z26 Cipher (Numbers)
     * A=1, B=2, etc.
     */
    a1z26: {
        name: 'A1Z26',
        difficulty: 'easy',
        description: 'Each letter is replaced with its position in the alphabet. A=1, B=2, C=3, and so on.',
        
        encode(text) {
            return text.split('').map(char => {
                if (!Ciphers.isLetter(char)) return char === ' ' ? '-' : char;
                const index = Ciphers.letterIndex(char) + 1;
                return index.toString();
            }).join('-');
        },
        
        decode(text) {
            return text.split('-').map(part => {
                const num = parseInt(part);
                if (isNaN(num) || num < 1 || num > 26) return part;
                return Ciphers.indexToLetter(num - 1);
            }).join('');
        },
        
        getHint() {
            return 'Numbers represent letter positions (A=1, B=2...)';
        },

        getExample(firstLetter) {
            const index = Ciphers.letterIndex(firstLetter) + 1;
            return {
                visual: `Encryption: ${firstLetter} → ${index} (letter position)\nDecryption: ${index} → ${firstLetter} (position to letter)`,
                text: `${firstLetter} → ${index}`
            };
        },

        getPythonCode(encrypted) {
            return `# A1Z26 Cipher Decoder
# Numbers represent letter positions: A=1, B=2, ... Z=26

encrypted = "${encrypted}"

# TODO: Split the encrypted text by '-' and convert each number to a letter
# Hint: Use split(), loop through numbers, convert to int, then to chr()
# Formula: chr(number - 1 + ord('A'))

numbers = encrypted.split('-')
decoded = ""
for num in numbers:
    if num.isdigit():
        # TODO: Convert the number to the corresponding letter
        # Step 1: Convert num to integer
        # Step 2: Subtract 1 to make it 0-indexed
        # Step 3: Add ord('A') and use chr() to get the letter
        pass  # Replace this with your code
    else:
        decoded += num

print("Decoded:", decoded)`;
        }
    },

    // =========================================
    // LEVEL 3 CIPHERS - Hacker
    // =========================================

    /**
     * Vigenère Cipher
     * Polyalphabetic substitution using a keyword
     */
    vigenere: {
        name: 'Vigenère Cipher',
        difficulty: 'medium',
        description: 'A polyalphabetic cipher that uses a keyword to determine variable shift amounts. Each letter of the keyword shifts the corresponding plaintext letter.',
        keyword: 'KEY',
        
        encode(text, keyword = this.keyword) {
            let keyIndex = 0;
            const key = keyword.toUpperCase();
            
            return text.split('').map(char => {
                if (!Ciphers.isLetter(char)) return char;
                const isUpper = char === char.toUpperCase();
                const textIndex = Ciphers.letterIndex(char);
                const keyShift = Ciphers.letterIndex(key[keyIndex % key.length]);
                const newIndex = (textIndex + keyShift) % 26;
                keyIndex++;
                return Ciphers.indexToLetter(newIndex, true, isUpper);
            }).join('');
        },
        
        decode(text, keyword = this.keyword) {
            let keyIndex = 0;
            const key = keyword.toUpperCase();
            
            return text.split('').map(char => {
                if (!Ciphers.isLetter(char)) return char;
                const isUpper = char === char.toUpperCase();
                const textIndex = Ciphers.letterIndex(char);
                const keyShift = Ciphers.letterIndex(key[keyIndex % key.length]);
                const newIndex = (textIndex - keyShift + 26) % 26;
                keyIndex++;
                return Ciphers.indexToLetter(newIndex, true, isUpper);
            }).join('');
        },
        
        getHint(keyword = this.keyword) {
            return `Keyword: "${keyword}"`;
        },
        
        randomize() {
            const keywords = ['KEY', 'CODE', 'HACK', 'CYBER', 'LOCK', 'SAFE', 'PASS', 'WORD'];
            this.keyword = keywords[Math.floor(Math.random() * keywords.length)];
            return this.keyword;
        },

        getExample(firstLetter, keyword = this.keyword) {
            const keyLetter = keyword[0];
            const textIndex = Ciphers.letterIndex(firstLetter);
            const keyShift = Ciphers.letterIndex(keyLetter);
            const encoded = Ciphers.indexToLetter((textIndex + keyShift) % 26);
            return {
                visual: `Encryption: ${firstLetter} + ${keyLetter}(${keyShift}) → ${encoded}\nDecryption: ${encoded} - ${keyLetter}(${keyShift}) → ${firstLetter}\nKeyword: "${keyword}"`,
                text: `${firstLetter} → ${encoded} (first key letter shifts by ${keyShift})`
            };
        },

        getPythonCode(encrypted, keyword = this.keyword) {
            return `# Vigenère Cipher Decoder
# Each letter shifts by the corresponding keyword letter value

encrypted = "${encrypted}"
keyword = "${keyword}"

# TODO: Subtract keyword shifts to decode
# Key letter A=0, B=1, ..., Z=25

decoded = ""
for i, char in enumerate(encrypted):
    if char.isalpha():
        # Get the shift from the keyword (cycling)
        key_char = keyword[i % len(keyword)]
        shift = ord(key_char) - ord('A')
        # Subtract the shift to decode
        new_pos = (ord(char) - ord('A') - shift) % 26
        decoded += chr(new_pos + ord('A'))
    else:
        decoded += char

print("Decoded:", decoded)`;
        }
    },

    /**
     * Rail Fence Cipher
     * Transposition cipher using zigzag pattern
     */
    railFence: {
        name: 'Rail Fence',
        difficulty: 'medium',
        description: 'A transposition cipher that writes the message in a zigzag pattern across multiple "rails" and then reads off each rail.',
        rails: 3,
        
        encode(text, rails = this.rails) {
            if (rails === 1) return text;
            
            const fence = Array.from({ length: rails }, () => []);
            let rail = 0;
            let direction = 1;
            
            for (const char of text) {
                fence[rail].push(char);
                rail += direction;
                if (rail === 0 || rail === rails - 1) {
                    direction *= -1;
                }
            }
            
            return fence.map(r => r.join('')).join('');
        },
        
        decode(text, rails = this.rails) {
            if (rails === 1) return text;
            
            const len = text.length;
            const fence = Array.from({ length: rails }, () => []);
            
            const railLengths = Array(rails).fill(0);
            let rail = 0;
            let direction = 1;
            
            for (let i = 0; i < len; i++) {
                railLengths[rail]++;
                rail += direction;
                if (rail === 0 || rail === rails - 1) {
                    direction *= -1;
                }
            }
            
            let index = 0;
            for (let r = 0; r < rails; r++) {
                for (let i = 0; i < railLengths[r]; i++) {
                    fence[r].push(text[index++]);
                }
            }
            
            const result = [];
            const railIndices = Array(rails).fill(0);
            rail = 0;
            direction = 1;
            
            for (let i = 0; i < len; i++) {
                result.push(fence[rail][railIndices[rail]++]);
                rail += direction;
                if (rail === 0 || rail === rails - 1) {
                    direction *= -1;
                }
            }
            
            return result.join('');
        },
        
        getHint(rails = this.rails) {
            return `Number of rails: ${rails}`;
        },
        
        randomize() {
            this.rails = Math.floor(Math.random() * 3) + 2;
            return this.rails;
        },

        getExample(firstLetter, rails = this.rails) {
            return {
                visual: `Encryption: Write zigzag across ${rails} rails, read rows\nDecryption: Distribute letters to rails, read zigzag\nRails: ${rails}`,
                text: `Write zigzag across ${rails} rails, read rows left-to-right`
            };
        },

        getPythonCode(encrypted, rails = this.rails) {
            return `# Rail Fence Cipher Decoder
# Text written in zigzag across ${rails} rails, then read row by row

encrypted = "${encrypted}"
rails = ${rails}

def decode_rail_fence(cipher, num_rails):
    if num_rails == 1:
        return cipher
    
    n = len(cipher)
    # Calculate the length of each rail
    rail_lens = [0] * num_rails
    rail = 0
    direction = 1
    for i in range(n):
        rail_lens[rail] += 1
        rail += direction
        if rail == 0 or rail == num_rails - 1:
            direction *= -1
    
    # Split cipher into rails
    fence = []
    idx = 0
    for length in rail_lens:
        fence.append(list(cipher[idx:idx + length]))
        idx += length
    
    # Read back in zigzag order
    result = []
    rail_indices = [0] * num_rails
    rail = 0
    direction = 1
    for i in range(n):
        result.append(fence[rail][rail_indices[rail]])
        rail_indices[rail] += 1
        rail += direction
        if rail == 0 or rail == num_rails - 1:
            direction *= -1
    
    return ''.join(result)

decoded = decode_rail_fence(encrypted, rails)
print("Decoded:", decoded)`;
        }
    },

    /**
     * Morse Code (simplified - letters only)
     */
    morse: {
        name: 'Morse Code',
        difficulty: 'medium',
        description: 'Each letter is represented by a unique sequence of dots and dashes. Spaces separate letters, slashes separate words.',
        
        morseMap: {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
            'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
            'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
            'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..'
        },
        
        reverseMorseMap: null,
        
        getReverseMorseMap() {
            if (!this.reverseMorseMap) {
                this.reverseMorseMap = {};
                for (const [letter, code] of Object.entries(this.morseMap)) {
                    this.reverseMorseMap[code] = letter;
                }
            }
            return this.reverseMorseMap;
        },
        
        encode(text) {
            return text.toUpperCase().split('').map(char => {
                if (char === ' ') return '/';
                return this.morseMap[char] || char;
            }).join(' ');
        },
        
        decode(text) {
            const reverseMap = this.getReverseMorseMap();
            return text.split(' ').map(code => {
                if (code === '/') return ' ';
                return reverseMap[code] || code;
            }).join('');
        },
        
        getHint() {
            return 'Dots (.) and dashes (-) represent letters';
        },

        getExample(firstLetter) {
            const morse = this.morseMap[firstLetter] || '?';
            return {
                visual: `Encryption: ${firstLetter} → ${morse}\nDecryption: ${morse} → ${firstLetter}`,
                text: `${firstLetter} → ${morse}`
            };
        },

        getPythonCode(encrypted) {
            return `# Morse Code Decoder
# Dots (.) and dashes (-) represent letters, separated by spaces

encrypted = "${encrypted}"

morse_to_letter = {
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E',
    '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
    '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O',
    '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
    '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y',
    '--..': 'Z'
}

# TODO: Split by spaces and look up each morse code
decoded = ""
for code in encrypted.split(' '):
    if code in morse_to_letter:
        decoded += morse_to_letter[code]
    elif code == '/':
        decoded += ' '

print("Decoded:", decoded)`;
        }
    },

    /**
     * Binary representation
     */
    binary: {
        name: 'Binary',
        difficulty: 'medium',
        description: 'Each letter is converted to its ASCII value and represented in 8-bit binary.',
        
        encode(text) {
            return text.toUpperCase().split('').map(char => {
                if (char === ' ') return '00000000';
                const code = char.charCodeAt(0);
                return code.toString(2).padStart(8, '0');
            }).join(' ');
        },
        
        decode(text) {
            return text.split(' ').map(binary => {
                if (binary === '00000000') return ' ';
                const code = parseInt(binary, 2);
                return String.fromCharCode(code);
            }).join('');
        },
        
        getHint() {
            return '8-bit binary ASCII values';
        },

        getExample(firstLetter) {
            const ascii = firstLetter.charCodeAt(0);
            const binary = ascii.toString(2).padStart(8, '0');
            return {
                visual: `Encryption: ${firstLetter} → ${binary} (8-bit binary)\nDecryption: ${binary} → ${ascii} → ${firstLetter}`,
                text: `${firstLetter} → ${binary}`
            };
        },

        getPythonCode(encrypted) {
            return `# Binary Cipher Decoder
# Each 8-bit binary number represents an ASCII character

encrypted = "${encrypted}"

# TODO: Convert each binary string to its ASCII character
decoded = ""
for binary in encrypted.split(' '):
    # Convert binary to decimal, then to character
    ascii_val = int(binary, 2)
    decoded += chr(ascii_val)

print("Decoded:", decoded)`;
        }
    },

    // =========================================
    // LEVEL 4 CIPHERS - Expert
    // =========================================

    /**
     * Affine Cipher
     * ax + b mod 26 substitution
     */
    affine: {
        name: 'Affine Cipher',
        difficulty: 'hard',
        description: 'A mathematical cipher where each letter x is encrypted as (ax + b) mod 26. The values a and b are the key.',
        a: 5,
        b: 8,
        
        validA: [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25],
        
        modInverse(a, m) {
            for (let x = 1; x < m; x++) {
                if ((a * x) % m === 1) return x;
            }
            return 1;
        },
        
        encode(text, a = this.a, b = this.b) {
            return text.split('').map(char => {
                if (!Ciphers.isLetter(char)) return char;
                const isUpper = char === char.toUpperCase();
                const x = Ciphers.letterIndex(char);
                const newIndex = (a * x + b) % 26;
                return Ciphers.indexToLetter(newIndex, true, isUpper);
            }).join('');
        },
        
        decode(text, a = this.a, b = this.b) {
            const aInv = this.modInverse(a, 26);
            return text.split('').map(char => {
                if (!Ciphers.isLetter(char)) return char;
                const isUpper = char === char.toUpperCase();
                const y = Ciphers.letterIndex(char);
                const newIndex = (aInv * (y - b + 26)) % 26;
                return Ciphers.indexToLetter(newIndex, true, isUpper);
            }).join('');
        },
        
        getHint(a = this.a, b = this.b) {
            return `Formula: (${a}x + ${b}) mod 26`;
        },
        
        randomize() {
            this.a = this.validA[Math.floor(Math.random() * this.validA.length)];
            this.b = Math.floor(Math.random() * 26);
            return { a: this.a, b: this.b };
        },

        getExample(firstLetter, a = this.a, b = this.b) {
            const x = Ciphers.letterIndex(firstLetter);
            const result = (a * x + b) % 26;
            const encoded = Ciphers.indexToLetter(result);
            return {
                visual: `Encryption: (${a}×${x} + ${b}) mod 26 = ${result} → ${encoded}\nDecryption: a⁻¹×(y - ${b}) mod 26 → ${firstLetter}`,
                text: `${firstLetter} → ${encoded}`
            };
        },

        getPythonCode(encrypted, a = this.a, b = this.b) {
            // Calculate modular inverse of a
            let aInv = 1;
            for (let x = 1; x < 26; x++) {
                if ((a * x) % 26 === 1) { aInv = x; break; }
            }
            return `# Affine Cipher Decoder
# Encrypted with formula: (${a}x + ${b}) mod 26
# To decode: a_inv * (y - b) mod 26

encrypted = "${encrypted}"
a = ${a}
b = ${b}
a_inv = ${aInv}  # Modular inverse of a

# TODO: Apply the decryption formula
decoded = ""
for char in encrypted:
    if char.isalpha():
        y = ord(char) - ord('A')
        # Decrypt: a_inv * (y - b) mod 26
        x = (a_inv * (y - b)) % 26
        decoded += chr(x + ord('A'))
    else:
        decoded += char

print("Decoded:", decoded)`;
        }
    },

    /**
     * Substitution Cipher
     * Random letter-to-letter mapping
     */
    substitution: {
        name: 'Substitution',
        difficulty: 'hard',
        description: 'Each letter is replaced with another letter according to a fixed substitution alphabet. The full substitution key is provided.',
        key: 'QWERTYUIOPASDFGHJKLZXCVBNM',
        
        encode(text, key = this.key) {
            return text.split('').map(char => {
                if (!Ciphers.isLetter(char)) return char;
                const isUpper = char === char.toUpperCase();
                const index = Ciphers.letterIndex(char);
                const newChar = key[index];
                return isUpper ? newChar : newChar.toLowerCase();
            }).join('');
        },
        
        decode(text, key = this.key) {
            return text.split('').map(char => {
                if (!Ciphers.isLetter(char)) return char;
                const isUpper = char === char.toUpperCase();
                const index = key.indexOf(char.toUpperCase());
                return Ciphers.indexToLetter(index, true, isUpper);
            }).join('');
        },
        
        getHint(key = this.key) {
            return `Key: ${key.substring(0, 13)}...`;
        },
        
        randomize() {
            const arr = Ciphers.ALPHABET.split('');
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            this.key = arr.join('');
            return this.key;
        },

        getExample(firstLetter, key = this.key) {
            const index = Ciphers.letterIndex(firstLetter);
            const encoded = key[index];
            return {
                visual: `Encryption: ${firstLetter} (pos ${index + 1}) → ${encoded}\nDecryption: Find ${encoded} in key, get position → ${firstLetter}`,
                text: `${firstLetter} → ${encoded}`
            };
        },

        getPythonCode(encrypted, key = this.key) {
            return `# Substitution Cipher Decoder
# Each letter maps to another via the substitution key

encrypted = "${encrypted}"
key = "${key}"  # This is the substitution alphabet
alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

# TODO: Find each encrypted letter in the key, get its position,
# then use that position in the normal alphabet

decoded = ""
for char in encrypted:
    if char.isalpha():
        # Find position of char in key, use that index in alphabet
        pos = key.index(char)
        decoded += alphabet[pos]
    else:
        decoded += char

print("Decoded:", decoded)`;
        }
    },

    /**
     * Columnar Transposition
     * Rearranges text based on keyword column order
     */
    columnar: {
        name: 'Columnar Transposition',
        difficulty: 'hard',
        description: 'Text is written into rows under a keyword, then columns are read off in alphabetical order of the keyword letters.',
        keyword: 'CIPHER',
        
        getColumnOrder(keyword) {
            const pairs = keyword.split('').map((char, i) => ({ char, index: i }));
            pairs.sort((a, b) => a.char.localeCompare(b.char) || a.index - b.index);
            const order = Array(keyword.length);
            pairs.forEach((pair, newPos) => {
                order[pair.index] = newPos;
            });
            return order;
        },
        
        encode(text, keyword = this.keyword) {
            const key = keyword.toUpperCase();
            const cols = key.length;
            const order = this.getColumnOrder(key);
            
            const cleanText = text.replace(/\s/g, '').toUpperCase();
            const paddedLen = Math.ceil(cleanText.length / cols) * cols;
            const padded = cleanText.padEnd(paddedLen, 'X');
            
            const grid = [];
            for (let i = 0; i < padded.length; i += cols) {
                grid.push(padded.slice(i, i + cols).split(''));
            }
            
            const result = [];
            for (let col = 0; col < cols; col++) {
                const originalCol = order.indexOf(col);
                for (const row of grid) {
                    result.push(row[originalCol]);
                }
            }
            
            return result.join('');
        },
        
        decode(text, keyword = this.keyword) {
            const key = keyword.toUpperCase();
            const cols = key.length;
            const rows = Math.ceil(text.length / cols);
            const order = this.getColumnOrder(key);
            
            const colLengths = Array(cols).fill(rows);
            
            const columns = [];
            let pos = 0;
            for (let col = 0; col < cols; col++) {
                const originalCol = order.indexOf(col);
                const len = colLengths[originalCol];
                columns[originalCol] = text.slice(pos, pos + len).split('');
                pos += len;
            }
            
            const result = [];
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    if (columns[col][row]) {
                        result.push(columns[col][row]);
                    }
                }
            }
            
            return result.join('').replace(/X+$/, '');
        },
        
        getHint(keyword = this.keyword) {
            return `Keyword: "${keyword}"`;
        },
        
        randomize() {
            const keywords = ['KEY', 'CODE', 'HACK', 'CIPHER', 'SECRET', 'HIDDEN'];
            this.keyword = keywords[Math.floor(Math.random() * keywords.length)];
            return this.keyword;
        },

        getExample(firstLetter, keyword = this.keyword) {
            return {
                visual: `Encryption: Write in rows, read columns alphabetically\nDecryption: Reverse column order, read rows\nKeyword: "${keyword}"`,
                text: `${firstLetter} position changes based on column reordering`
            };
        },

        getPythonCode(encrypted, keyword = this.keyword) {
            return `# Columnar Transposition Cipher Decoder
# Text written in rows under keyword, columns read alphabetically

encrypted = "${encrypted}"
keyword = "${keyword}"

def decode_columnar(cipher, key):
    cols = len(key)
    rows = len(cipher) // cols
    
    # Get column order (alphabetical by key letter)
    order = sorted(range(cols), key=lambda i: key[i])
    
    # Split cipher into columns (in sorted order)
    col_len = rows
    columns = {}
    pos = 0
    for sorted_idx in range(cols):
        orig_col = order[sorted_idx]
        columns[orig_col] = cipher[pos:pos + col_len]
        pos += col_len
    
    # Read back row by row
    result = ""
    for row in range(rows):
        for col in range(cols):
            if row < len(columns[col]):
                result += columns[col][row]
    
    return result.rstrip('X')

decoded = decode_columnar(encrypted, keyword)
print("Decoded:", decoded)`;
        }
    },

    /**
     * Hexadecimal representation
     */
    hex: {
        name: 'Hexadecimal',
        difficulty: 'medium',
        description: 'Each letter is converted to its ASCII value in hexadecimal format.',
        
        encode(text) {
            return text.toUpperCase().split('').map(char => {
                const code = char.charCodeAt(0);
                return code.toString(16).toUpperCase().padStart(2, '0');
            }).join(' ');
        },
        
        decode(text) {
            return text.split(' ').map(hex => {
                const code = parseInt(hex, 16);
                return String.fromCharCode(code);
            }).join('');
        },
        
        getHint() {
            return 'Hexadecimal ASCII values (base 16)';
        },

        getExample(firstLetter) {
            const ascii = firstLetter.charCodeAt(0);
            const hex = ascii.toString(16).toUpperCase();
            return {
                visual: `Encryption: ${firstLetter} → ${ascii} → ${hex} (hex)\nDecryption: ${hex} (hex) → ${ascii} → ${firstLetter}`,
                text: `${firstLetter} → ${hex}`
            };
        },

        getPythonCode(encrypted) {
            return `# Hexadecimal Cipher Decoder
# Each hex value represents an ASCII character

encrypted = "${encrypted}"

# TODO: Convert each hex value to its ASCII character
decoded = ""
for hex_val in encrypted.split(' '):
    # Convert hex to decimal, then to character
    ascii_val = int(hex_val, 16)
    decoded += chr(ascii_val)

print("Decoded:", decoded)`;
        }
    },

    // =========================================
    // LEVEL 5 CIPHERS - Master
    // =========================================

    /**
     * Double Caesar
     * Apply Caesar cipher twice with different shifts
     */
    doubleCaesar: {
        name: 'Double Caesar',
        difficulty: 'hard',
        description: 'The text is encrypted with the Caesar cipher twice, using two different shift values.',
        shift1: 3,
        shift2: 7,
        
        encode(text, shift1 = this.shift1, shift2 = this.shift2) {
            const first = Ciphers.caesar.encode(text, shift1);
            return Ciphers.caesar.encode(first, shift2);
        },
        
        decode(text, shift1 = this.shift1, shift2 = this.shift2) {
            const first = Ciphers.caesar.decode(text, shift2);
            return Ciphers.caesar.decode(first, shift1);
        },
        
        getHint(shift1 = this.shift1, shift2 = this.shift2) {
            return `First shift: ${shift1}, Second shift: ${shift2}`;
        },
        
        randomize() {
            this.shift1 = Math.floor(Math.random() * 12) + 1;
            this.shift2 = Math.floor(Math.random() * 12) + 1;
            return { shift1: this.shift1, shift2: this.shift2 };
        },

        getExample(firstLetter, shift1 = this.shift1, shift2 = this.shift2) {
            const index = Ciphers.letterIndex(firstLetter);
            const after1 = (index + shift1) % 26;
            const after2 = (after1 + shift2) % 26;
            return {
                visual: `Encryption: ${firstLetter} +${shift1}→ ${Ciphers.indexToLetter(after1)} +${shift2}→ ${Ciphers.indexToLetter(after2)}\nDecryption: ${Ciphers.indexToLetter(after2)} -${shift2}→ ${Ciphers.indexToLetter(after1)} -${shift1}→ ${firstLetter}`,
                text: `${firstLetter} → ${Ciphers.indexToLetter(after2)} (total shift: ${shift1}+${shift2}=${(shift1+shift2)%26})`
            };
        },

        getPythonCode(encrypted, shift1 = this.shift1, shift2 = this.shift2) {
            return `# Double Caesar Cipher Decoder
# Two Caesar shifts applied: first ${shift1}, then ${shift2}

encrypted = "${encrypted}"
shift1 = ${shift1}
shift2 = ${shift2}

# TODO: Reverse both shifts (subtract shift2 first, then shift1)
decoded = ""
for char in encrypted:
    if char.isalpha():
        pos = ord(char) - ord('A')
        # Undo shift2, then undo shift1
        pos = (pos - shift2 - shift1) % 26
        decoded += chr(pos + ord('A'))
    else:
        decoded += char

print("Decoded:", decoded)`;
        }
    },

    /**
     * Reverse + Caesar combo
     */
    reverseCaesar: {
        name: 'Reverse Caesar',
        difficulty: 'hard',
        description: 'The text is first reversed, then encrypted with a Caesar cipher.',
        shift: 5,
        
        encode(text, shift = this.shift) {
            const reversed = Ciphers.reversed.encode(text);
            return Ciphers.caesar.encode(reversed, shift);
        },
        
        decode(text, shift = this.shift) {
            const decrypted = Ciphers.caesar.decode(text, shift);
            return Ciphers.reversed.decode(decrypted);
        },
        
        getHint(shift = this.shift) {
            return `Reversed, then shifted by ${shift}`;
        },
        
        randomize() {
            this.shift = Math.floor(Math.random() * 25) + 1;
            return this.shift;
        },

        getExample(firstLetter, shift = this.shift) {
            const index = Ciphers.letterIndex(firstLetter);
            const shifted = Ciphers.indexToLetter((index + shift) % 26);
            return {
                visual: `Encryption: Reverse text, then +${shift}\nDecryption: Subtract ${shift}, then reverse\nShift: ${shift}`,
                text: `${firstLetter} → ${shifted}`
            };
        },

        getPythonCode(encrypted, shift = this.shift) {
            return `# Reverse Caesar Cipher Decoder
# Text was reversed, then Caesar shifted by ${shift}

encrypted = "${encrypted}"
shift = ${shift}

# TODO: First undo the Caesar shift, then reverse

# Step 1: Undo Caesar shift
unshifted = ""
for char in encrypted:
    if char.isalpha():
        pos = (ord(char) - ord('A') - shift) % 26
        unshifted += chr(pos + ord('A'))
    else:
        unshifted += char

# Step 2: Reverse the string
decoded = unshifted[::-1]

print("Decoded:", decoded)`;
        }
    },

    /**
     * Atbash + Vigenère combo
     */
    atbashVigenere: {
        name: 'Atbash Vigenère',
        difficulty: 'hard',
        description: 'The text is first encrypted with Atbash, then with Vigenère cipher.',
        keyword: 'MASTER',
        
        encode(text, keyword = this.keyword) {
            const atbashed = Ciphers.atbash.encode(text);
            return Ciphers.vigenere.encode(atbashed, keyword);
        },
        
        decode(text, keyword = this.keyword) {
            const decrypted = Ciphers.vigenere.decode(text, keyword);
            return Ciphers.atbash.decode(decrypted);
        },
        
        getHint(keyword = this.keyword) {
            return `Atbash, then Vigenère with key "${keyword}"`;
        },
        
        randomize() {
            const keywords = ['MASTER', 'EXPERT', 'PUZZLE', 'CRYPTO'];
            this.keyword = keywords[Math.floor(Math.random() * keywords.length)];
            return this.keyword;
        },

        getExample(firstLetter, keyword = this.keyword) {
            const index = Ciphers.letterIndex(firstLetter);
            const atbashed = Ciphers.indexToLetter(25 - index);
            const keyShift = Ciphers.letterIndex(keyword[0]);
            const final = Ciphers.indexToLetter((25 - index + keyShift) % 26);
            return {
                visual: `Encryption: ${firstLetter} →Atbash→ ${atbashed} →Vigenère→ ${final}\nDecryption: Undo Vigenère, then Atbash\nKeyword: "${keyword}"`,
                text: `${firstLetter} → ${final} (decode: undo Vigenère, then Atbash)`
            };
        },

        getPythonCode(encrypted, keyword = this.keyword) {
            return `# Atbash Vigenère Cipher Decoder
# Text was Atbash'd, then Vigenère encrypted with key "${keyword}"

encrypted = "${encrypted}"
keyword = "${keyword}"

# TODO: First undo Vigenère, then undo Atbash

# Step 1: Undo Vigenère
unvig = ""
for i, char in enumerate(encrypted):
    if char.isalpha():
        key_char = keyword[i % len(keyword)]
        shift = ord(key_char) - ord('A')
        pos = (ord(char) - ord('A') - shift) % 26
        unvig += chr(pos + ord('A'))
    else:
        unvig += char

# Step 2: Undo Atbash (self-inverting)
decoded = ""
for char in unvig:
    if char.isalpha():
        pos = ord(char) - ord('A')
        decoded += chr(25 - pos + ord('A'))
    else:
        decoded += char

print("Decoded:", decoded)`;
        }
    }
};

// Freeze the Ciphers object to prevent modifications
Object.freeze(Ciphers);
