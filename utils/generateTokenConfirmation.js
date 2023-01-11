const crypto = require('crypto');

function generateTokenConfirmation() {
    return crypto.randomBytes(16).toString('hex');
}

module.exports = generateTokenConfirmation