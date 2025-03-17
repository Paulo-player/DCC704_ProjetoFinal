/**
 * @file jwtTokenGenerator.js
 * @description Utilidade para gerar secrets para o JWT
 * @author Paulo Belmont <paulopereira737@hotmail.com>
 * @version 1.0.0
 * @license MIT
 */

const crypto = require('crypto');

function generateJWTKey() {
    return crypto.randomBytes(32).toString('hex'); // Generates a 256-bit (32-byte) key
}

console.log("Generated JWT Secret Key:", generateJWTKey());