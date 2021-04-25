const fs = require('fs');
const dotenv = require('dotenv');

const RC_FILE = '.rc';

const loadRc = (rcDict) => {

    let config;
    if (rcDict) {
        config = { ...rcDict };
    } else
    if (fs.existsSync(RC_FILE)) {
        config = dotenv.parse(fs.readFileSync(RC_FILE));
    } else {
        config = {};
    }
    return config;
};

module.exports = loadRc;
