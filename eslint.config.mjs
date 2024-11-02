import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginNode from 'eslint-plugin-node';
import eslintPluginPromise from 'eslint-plugin-promise';
import eslintConfigGoogle from 'eslint-config-google';
import globals from 'globals';

export default [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      import: eslintPluginImport,
      node: eslintPluginNode,
      promise: eslintPluginPromise,
    },
    rules: {
      ...eslintConfigGoogle.rules,
      'import/no-unresolved': 'error',
      'node/no-extraneous-require': 'off',
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'indent': ['error', 2],
      'valid-jsdoc': 'off',
      'require-jsdoc': 'off',
      'max-len': ['error', {code: 200}],
      'prefer-promise-reject-errors': 'off',
      'no-unused-vars': 'off',
    },
  },
];
