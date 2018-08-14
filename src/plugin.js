const battery = require('@battery/core');
const config = require('../../config/dist/main')

class BatteryWebpackPlugin {
  constructor(options) {
    this.cacheObject = {}
    this.pluginName = 'battery-webpack-plugin',
    this.distillClassNames = this.distillClassNames.bind(this)
    this.finalCSS = []
  }

  distillClassNames(obj) {
    return Object.keys(obj).map(x => obj[x]).reduce((xs,x) => xs.concat(x),[])
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(this.pluginName,(compilation) => {
      compilation.hooks.normalModuleLoader.tap(this.pluginName,(loaderCtx) => {

        // loaderCtx is 'this' in the loader
        loaderCtx[this.pluginName] = {
          addClassNames: (resourcePath,classNamesArr) => {
            this.cacheObject[resourcePath] = classNamesArr
          }
        }
      })
    })

    compiler.hooks.done.tap(this.pluginName,() => {
      this.distilled = this.distillClassNames(this.cacheObject)
      // this.finalCSS = JSON.stringify(battery.geneateCSS(this.distilled,config));
      console.log('ARRAY',this.distilled);
      this.emitWarning(null,battery.generateCSS(this.distilled,config))
    })

    compiler.hooks.emit.tap(this.pluginName, (compilation, callback) => {
      const fileContent = this.finalCSS;

      compilation.assets['battery.css'] = {
        source: () => fileContent,
        size: () => fileContent.length,
      };

      if (callback) {
        callback();
      }
    })
  }
}

BatteryWebpackPlugin.loader = require.resolve('./loader');

module.exports = BatteryWebpackPlugin;