const fs = require('fs');
const path = require('path');

module.exports = function(url, next) {
  if (url !== '/' || url.endsWith('.html')) {
    return next();
  }

  if (url === '/') url = 'index.html';

  let content = fs.readFileSync(path.resolve() + '/index.html', 'utf-8');
  content = content.replace(
    '<script ', 
    `<script>window.process = { env: { NODE_ENV: 'dev' }}</script><script `
  );

  return {
    content: content,
    type: 'text/html'
  };
}