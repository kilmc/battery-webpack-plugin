const battery = require('@battery/core');

class BatteryWebpackPlugin {
  constructor(options) {
    this.cacheObject = {};
    this.pluginName = 'battery-webpack-plugin';
    this.distillClassNames = this.distillClassNames.bind(this);
    this.config = options.config;
  }

  distillClassNames(obj) {
    return Object.keys(obj)
      .map(x => obj[x])
      .reduce((xs, x) => xs.concat(x), []);
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(this.pluginName, compilation => {
      compilation.hooks.normalModuleLoader.tap(this.pluginName, loaderCtx => {
        loaderCtx[this.pluginName] = {
          addClassNames: (resourcePath, classNamesArr) => {
            this.cacheObject[resourcePath] = classNamesArr;
          }
        };
      });
    });

    compiler.hooks.emit.tap(this.pluginName, (compilation, callback) => {
      const fileContent = battery.generateCSS(
        this.distillClassNames(this.cacheObject),
        this.config
      );

      compilation.assets['battery.css'] = {
        source: () => fileContent,
        size: () => fileContent.length
      };

      if (callback) {
        callback();
      }
    });
  }
}

BatteryWebpackPlugin.loader = require.resolve('./loader.js');

module.exports = BatteryWebpackPlugin;
