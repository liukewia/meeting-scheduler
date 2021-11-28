module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'react-app',
  ],
  plugins: [
    '@typescript-eslint',
    'modules-newline',
    'newline-destructuring',
    'react',
  ],
  root: true,
  env: {
    browser: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  parserOptions: {
    files: ['*.ts', '*.tsx'],
    ecmaVersion: 2019,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: ['./tsconfig.eslint.json'],
  },
  rules: {
    '@typescript-eslint/naming-convention': [
      'off',
      {
        selector: 'variable',
        modifiers: ['const'],
        format: ['UPPER_CASE'],
      },
    ],
    // 在包含大于等于 2 项的单处导入导出中如果不换行则报错
    'object-curly-newline': [
      'error',
      {
        // 对象字面量的配置
        ObjectExpression: { multiline: true, minProperties: 2 },

        // 对象的解构赋值模式的配置
        ObjectPattern: { multiline: true, minProperties: 2 },
        ImportDeclaration: { multiline: true, minProperties: 2 },
        ExportDeclaration: { multiline: true, minProperties: 2 },
      },
    ],
    'eol-last': ['error', 'always'],
    'linebreak-style': ['error', 'unix'],
    quotes: [1, 'single'],
    'no-restricted-syntax': [
      'warn',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'ForOfStatement',
        message:
          'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.',
      },
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    'object-property-newline': [
      'error',
      {
        allowAllPropertiesOnSameLine: false,
      },
    ],

    // "eslint-plugin-modules-newline" plugin
    // https://github.com/gmsorrow/eslint-plugin-modules-newline#usage
    'modules-newline/import-declaration-newline': 'error',
    'modules-newline/export-declaration-newline': 'error',

    // "eslint-plugin-newline-destructuring" plugin
    // https://github.com/urielvan/eslint-plugin-newline-destructuring#usage
    'newline-destructuring/newline': [
      'error',
      {
        // 只解构出1个时不换行，2个开始换
        items: 1,
      },
    ],
  },
};
