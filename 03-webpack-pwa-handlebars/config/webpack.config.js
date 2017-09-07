const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SplitWebpackPlugin = require('split-webpack-plugin');
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const {
  HotModuleReplacementPlugin,
  NoEmitOnErrorsPlugin,
  LoaderOptionsPlugin,
  EnvironmentPlugin,
  ProvidePlugin,
  DefinePlugin,
  optimize
} = require('webpack');

const {
  AggressiveSplittingPlugin,
  AggressiveMergingPlugin,
  CommonsChunkPlugin,
  UglifyJsPlugin,
} = optimize;

const { join } = require('path');
const resolve = rel => join(process.cwd(), rel);

const { version } = require('../package.json');

const babel = {
  "presets": [
    [
      "env",
      {
        "targets": {
          "chrome": 52,
          "node": "current",
          "browsers": [
            "last 2 versions",
            "safari >= 7",
          ],
        },
      },
    ],
  ],
};

module.exports = env => ({

  context: resolve('./'),

  entry: {
    //'service-worker-register': './src/service-worker-register.js',
    polyfills: './src/polyfills.js',
    vendors: './src/vendors.js',
    app: './src/main.js',
  },

  output: {
    jsonpFunction: 'w',
    path: resolve('./dist'),
    filename: `[name]-${env}.js?v=${version}`,
    publicPath: env === 'gh-pages' ? '/pwa-examples/' : '/',
  },

  module: {
    rules: [

      {
        test: /\.(hbs|handlebars)$/i,
        loader: 'handlebars-loader',
        include: [
          resolve('./src'),
        ],
      },

      {
        test: /\.(es6|jsx?)$/i,
        loader: 'babel-loader',
        options: babel,
        include: [
          resolve('./src'),
        ],
      },

      {
        test: /\.s?css$/i,
        use: ExtractTextWebpackPlugin.extract({
          use: [
            {
              loader: 'exports-loader',
              options: {
                module: {
                  exports: toString,
                }
              },
            },
            {
              loader: 'css-loader',
              options: {
                module: true,
                importLoaders: 1,
                minimize: env !== 'development',
                sourceMap: env === 'development',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: (loader) => [
                  require('postcss-smart-import'),
                  require('autoprefixer'),
                ],
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
          fallback: 'style-loader',
          publicPath: env === 'gh-pages' ? '/pwa-examples/' : '/',
        }),
        include: [
          resolve('./src'),
          resolve('./node_modules/bootstrap/dist/css'),
        ],
      },

      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/i,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: `[name]-${env}.[ext]?v=${version}`,
        },
      },

      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: `[name]-${env}.[ext]?v=${version}`,
        },
      },

      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: `[name]-${env}.[ext]?v=${version}`,
        },
      },
    ],
  },

  plugins: [
/*
    new SplitWebpackPlugin({
      chunks: ['polyfills'],
      size: 128, // kb
    }),

    new SplitWebpackPlugin({
      chunks: ['vendors'],
      size: 128, // kb
      // divide: 2,
    }),

    new SplitWebpackPlugin({
      chunks: ['app'],
      size: 128, // kb
    }),
*/
    ...(env !== 'development' ? ['app', 'vendors', 'polyfills'] : [])
      .map(chunk => new SplitWebpackPlugin({
        chunks: [chunk],
        size: 256, // kb,
        // divide: 2,
      })),
/*
    new CommonsChunkPlugin({
      names: [
        'app',
        'vendors',
        'polyfills',
        'manifest',
        // 'service-worker-register',
      ],
    }),
*/
    new HtmlWebpackPlugin({
      cache: true,
      showErrors: true,
      excludeChunks: [],
      xhtml: true,
      template: './src/index.hbs',
      favicon: './src/favicon.ico',
      minify: env !== 'development' ? {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
      } : false,
    }),

    new BaseHrefWebpackPlugin({
      baseHref: env === 'gh-pages' ? '/pwa-examples/' : '/',
    }),

    new ExtractTextWebpackPlugin(`[name]-${env}.css?v=${version}`),

    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    env === 'development' ? undefined : new OptimizeCssAssetsWebpackPlugin({
      cssProcessorOptions: {
        safe: true,
      },
    }),

    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer',
    }),

    new CopyWebpackPlugin([
      { from: './static' }
    ]),

    new ProvidePlugin({
      'jQuery': 'jquery', // bootstrap@4
      'Popper': 'popper.js', // bootstrap@4
    }),

    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env === 'development' ? env : 'production'),
      },
    }),

    // Alternatively, the EnvironmentPlugin supports an object, which maps keys to their default values.
    // The default value for a key is taken if the key is undefined in process.env.
    new EnvironmentPlugin({
      'NODE_ENV': 'development',
    }),

    env === 'development' ? new NoEmitOnErrorsPlugin() : undefined,

    env !== 'development' ? new AggressiveMergingPlugin() : undefined,

    env !== 'development' ? new HotModuleReplacementPlugin() : undefined,

    new CompressionWebpackPlugin({
      asset: '[path].gz?[query]', // default: [path].gz[query]
      algorithm: 'gzip', // zlib, zopfli, function(buf, callback)
      // test: /\.(js|css|html)$/i, // default: every assets
      threshold: 10240, // default: 0
      minRatio: 0.8 // default: Only assets that compress better that ratio: 0.8
    }),

  ].filter(p => !!p),

  resolve: {
    extensions: [
      '.js',
      '.css',
      '.hbs',
    ],
  },

  devServer: {
    port: 8000,
    compress: env !== 'development',
    inline: env === 'development',
    stats: 'minimal',

    contentBase: resolve('./dist'),

    historyApiFallback: {
      index: env === 'gh-pages' ? '/pwa-examples/' : '/',
    },

    proxy: {
      '/api': () => ({
        target: 'http://localhost:8080',
        changeOrign: false,
        secure: false,
      }),
    },
  },

});
