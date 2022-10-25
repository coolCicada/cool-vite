const plugins = [];

function addPlugin(...fn) {
  plugins.push(...fn);
}

function execute(url) {
  const first = plugins[0];
  let index = 0;
  function next () {
    index ++;
    if (index === plugins.length) return {};
    return plugins[index](url, next);
  }
  return first(url, next);
}

module.exports = {
  addPlugin,
  execute,
};