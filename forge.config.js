const path = require('path');
const { WebpackPlugin } = require('@electron-forge/plugin-webpack');

module.exports = {
  packagerConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {}
    }
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig: './webpack.main.config.js',
      renderer: {
        config: './webpack.renderer.config.js',
        entryPoints: [
          {
            html: './public/index.html',
            js: './src/renderer/index.tsx',
            name: 'main_window',
            preload: {
              js: './src/preload.ts'
            }
          }
        ]
      }
    })
  ]
};