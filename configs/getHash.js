const crypto = require('crypto');

function getHash(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}

module.exports = getHash;