#!/usr/bin/env node
const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const { rewriteImport } = require('./utils');
const compilerSFC = require('@vue/compiler-sfc');
const compilerDOM = require('@vue/compiler-dom');
const app = new Koa();
console.log('init')
app.use(async (ctx) => {
  const { url } = ctx.request;
  if (url === '/') {
    ctx.type = 'text/html';
    let content = fs.readFileSync('./index.html', 'utf-8');
    ctx.body = content.replace('<script ', 
    `
    <script>
      window.process = { env: { NODE_ENV: 'dev' }}
    </script>
    <script `);
  }
  else if (url.endsWith('.js')) {
    const p = path.resolve() + url;
    const content = fs.readFileSync(p, 'utf-8');
    ctx.type = 'application/javascript';
    ctx.body = rewriteImport(content);;
  }
  else if (url.startsWith('/@modules')) {
    const prefix = path.resolve() + '/node_modules/' + url.replace('/@modules/', '');
    const module = require(prefix + '/package.json').module;
    const p = path.resolve(prefix, module);
    const content = fs.readFileSync(p, 'utf-8');
    ctx.type = 'application/javascript';
    ctx.body = rewriteImport(content);;
  }
  else if (url.indexOf('.vue') > -1) {
    const p = path.resolve() + '/' + url.split('?')[0].slice(1);
    const { descriptor } = compilerSFC.parse(fs.readFileSync(p, 'utf-8'));
    if (!ctx.query || !ctx.query.type) {
      ctx.type = 'application/javascript';
      ctx.body = `
      ${rewriteImport(
        descriptor.script.content
        .replace("export default ", "const __script = ")
      )}
      import { render as __render } from '${url}?type=template'
      __script.render = __render;
      export default __script;
      `
    } else if (ctx.query && ctx.query.type === 'template') {
      const template = descriptor.template;
      const render = compilerDOM.compile(template.content, { mode: 'module' }).code;
      ctx.type = 'application/javascript';
      ctx.body = rewriteImport(render);
    }
  }
  else if (url.endsWith('.css')) {
    const p = path.resolve('.') + '/' + url;
    const content = fs.readFileSync(p, 'utf-8');
    const res = `
    const css = '${content.replace(/\n/g, "")}';
    let link = document.createElement('style');
    link.setAttribute('type', 'text/css');
    document.head.appendChild(link);
    link.innerHTML = css;
    export default css;
    `;
    ctx.type = 'application/javascript';
    ctx.body = res;
  }
});

app.listen(3000, () => {
  console.log('start at 3000');
});