// https://umijs.org/config/
// there should be only one setting, config/config.js OR /.umirc.js.
import { defineConfig } from 'umi';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  // locale: {
  //   default: 'en-US',
  //   antd: true,
  //   baseNavigator: false,
  // },
  // antd: {
  //   config: {
  //     locale: 'en-US',
  //     antd: true,
  //     baseNavigator: false,
  //     baseSeparator: '-',
  //   },
  // },
  // dva: {
  //   hmr: true,
  // },
  // layout: {
  //   // https://umijs.org/zh-CN/plugins/plugin-layout
  //   // locale: 'en-US',
  //   siderWidth: 208,
  //   ...defaultSettings,
  // },

  // https://umijs.org/config/#dynamicimport
  dynamicImport: {
    loading: '@/components/Loading/index',
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
    ]
  ],
  lessLoader: {
    javascriptEnabled: true,
  },
  // exportStatic: {},

  // publicPath: process.env.NODE_ENV === 'production' ? '/static/' : '/',

  // https://umijs.org/plugins/plugin-request#datafield
  // request: {
  //   dataField: '',
  // },
});
