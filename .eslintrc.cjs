module.exports = {
  root: true,
  env: {
    node: true,
    commonjs: true,
    es2020: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'no-param-reassign': 'off',
    'no-await-in-loop': 'off',
    'no-plusplus': 'off',
    'no-continue': 'off',
    'max-len': ['error', { code: 120 }],
    'consistent-return': 'off',
    'no-restricted-syntax': 'off',
    'prefer-const': 'warn',
    'no-unused-vars': ['warn', { argsIgnorePattern: 'next' }],
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'never'],
    'no-console': 'off'
  },
}
