//Geradpr de secrets JWT
const crypto = require('crypto');

function generateJWTKey() {
    return crypto.randomBytes(32).toString('hex'); // Generates a 256-bit (32-byte) key
}

console.log("Generated JWT Secret Key:", generateJWTKey());