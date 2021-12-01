// https://umijs.org/config/
// there should be only one setting, config/config.js OR /.umirc.js.
import { defineConfig } from 'umi';
const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin');
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  alias: {
    public: '/public',
  },
  hash: true,
  // https://umijs.org/config/#dynamicimport
  dynamicImport: {
    loading: '@/components/CenteredSpinner/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  // theme: {
  //   'primary-color': defaultSettings.primaryColor,
  // },

  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  // esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  // proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  chainWebpack: (memo, { webpack }) => {
    memo.plugin('MomentTimezoneDataPlugin').use(MomentTimezoneDataPlugin, [
      {
        startYear: 1970,
        endYear: 2039,
        matchZones: 'UTC',
      },
    ]);
  },
  // https://github.com/umijs/umi/issues/917
  // https://github.com/mzohaibqc/antd-theme-webpack-plugin/blob/master/examples/customize-cra/config-overrides.js
  extraBabelPlugins: [
    [
      require.resolve('babel-plugin-import'),
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
  lessLoader: {
    javascriptEnabled: true,
  },
  // exportStatic: {},

  // publicPath: process.env.NODE_ENV === 'production' ? '/static/' : '/',
});
