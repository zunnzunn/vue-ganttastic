const isBuildLib =
  (process.env.npm_lifecycle_script || '').indexOf('--target lib') > 0

module.exports = {
  publicPath: '',
  outputDir: isBuildLib ? 'dist' : 'demo',
  css: { extract: true },
  productionSourceMap: false,
  chainWebpack: config => {
    if (process.env.VUE_CLI_BUILD_TARGET === 'lib') {
      config.externals({
        ...config.get('externals'),
        moment: 'moment'
      })
    }
  }
}
