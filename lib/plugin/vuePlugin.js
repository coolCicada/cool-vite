const fs = require('fs');
const path = require('path');
const qs = require('qs');
const compilerSFC = require('@vue/compiler-sfc');
const compilerDOM = require('@vue/compiler-dom');
const { rewriteImport } = require('../utils');

module.exports = function (url, next) {
  if (url.indexOf('.vue') === -1) return next();
  const [fileName, arg] = url.split('?');
  const p = path.resolve() + '/' + fileName.slice(1);
  const { descriptor } = compilerSFC.parse(fs.readFileSync(p, 'utf-8'));
  if (arg) {
    const obj = qs.parse(arg);
    if (obj.type === 'template') {
      const template = descriptor.template;
      const render = compilerDOM.compile(template.content, { mode: 'module' }).code;
      return {
        content: rewriteImport(render),
      };
    }
  }
  return {
    content: `${rewriteImport(descriptor.script.content).replace('export default ', 'const __script = ')}
      import { render as __render } from '${url}?type=template';
      __script.render = __render;
      export default __script;
    `
  };
}