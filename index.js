#!/usr/bin/env node
const Koa = require('koa');
const app = new Koa();

const { addPlugin, execute } = require('./plugins');
addPlugin(
  require('./plugin/htmlPlugin'),
  require('./plugin/jsPlugin'),
  require('./plugin/modulePlugin'),
  require('./plugin/vuePlugin'),
  require('./plugin/cssPlugin'),
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