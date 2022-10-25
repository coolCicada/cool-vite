const fs = require('fs');
const path = require('path');
const { rewriteImport } = require('../utils');

module.exports = function(url, next) {
  if (!url.startsWith('/@modules')) return next();
  const prefix = path.resolve() + /node_modules/ + url.replace('/@modules/', '');
  const module = require(prefix + '/package.json').module;
  const p = path.resolve(prefix, module);
  const content = rewriteImport(fs.readFileSync(p, 'utf-8'));
  return {
    content,
  };
}