const fs = require('fs');
const path = require('path');
const { rewriteImport } = require('../utils');

module.exports = function(url, next) {
  if (!url.endsWith('.js')) return next();
  return {
    content: rewriteImport(fs.readFileSync(path.resolve() + url, 'utf-8'))
  };
}