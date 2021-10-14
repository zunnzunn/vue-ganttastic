module.exports = {
  publicPath: '',
  outputDir: process.env.NODE_ENV === 'production' ? 'dist/' : 'demo/',
  css: { extract: false },
  productionSourceMap: false,
}
