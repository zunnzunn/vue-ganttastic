module.exports = {
  publicPath: '',
  outputDir: process.env.NODE_ENV === 'production' ? 'dist/' : 'demo/',
  css: { extract: false },
  productionSourceMap: false,
  chainWebpack: config => {
    if (process.env.VUE_CLI_BUILD_TARGET === 'lib') {
      config.externals({
        ...config.get('externals'),
        moment: 'moment',
      })
    }
  },
}
