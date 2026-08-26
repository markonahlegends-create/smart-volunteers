const path = require('path');
const serverPath = path.join(__dirname, '..', 'server', 'dist', 'index.js');
const app = require(serverPath).default;
module.exports = app;
