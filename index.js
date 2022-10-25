#!/usr/bin/env node
const Koa = require('koa');
const app = new Koa();

const { addPlugin, execute } = require('./lib/plugins');
addPlugin(
  require('./lib/plugin/htmlPlugin'),
  require('./lib/plugin/jsPlugin'),
  require('./lib/plugin/modulePlugin'),
  require('./lib/plugin/vuePlugin'),
  require('./lib/plugin/cssPlugin'),
);

app.use(async (ctx) => {
  const { url } = ctx.request;
  const { content, type } = execute(url);
  ctx.type = type ? type : 'application/javascript';
  ctx.body = content;
});

app.listen(3000, () => {
  console.log('start at 3000');
});