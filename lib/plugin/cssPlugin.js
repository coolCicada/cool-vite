const fs = require('fs');
const path = require('path');

module.exports = function (url, next) {
  if (!url.endsWith('.css')) return next();
  const p = path.resolve() + '/' + url;
  const content = fs.readFileSync(p, 'utf-8');
  const res = `
    const css = '${content.replace(/\n/g, "")}';
    const link = document.createElement('style');
    link.setAttribute('type', 'text/css');
    document.head.appendChild(link);
    link.innerHTML = css;
    export default css;
  `;
  return { content: res };
}