function rewriteImport(content) {
  return content.replace(/ from ['|"]([^'"]+)['|"]/g, function(s0, s1) {
    if (s1[0] !== '.' && s1[0] !== '/') {
      return ` from '/@modules/${s1}'`;
    } else {
      return s0;
    }
  });
}

module.exports = {
  rewriteImport,
};