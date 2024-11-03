/* eslint-env node */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict-type-checked',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    projectService: {
      allowDefaultProject: [ '.eslintrc.js' ],
    },
    tsconfigRootDir: __dirname
  },
  plugins: [ '@typescript-eslint', 'import' ],
  root: true,
  rules: {
    semi: [ 'error', 'always' ],
    quotes: [ 'error', 'single' ],
    'indent': [ 'error', 2 ],
    'no-multiple-empty-lines': [ 'error', { 'max': 1, 'maxEOF': 0 } ],
    'no-multi-spaces': 'error',
    'arrow-body-style': 'warn',
    'prefer-arrow-callback': [
      'warn',
      {
        allowNamedFunctions: true,
      },
    ],
    'no-trailing-spaces': [ 'error', { 'ignoreComments': true } ],
    'no-unused-vars': 'error',
    'import/no-dynamic-require': 'error',
    'object-curly-spacing': [ 'error', 'always' ],
    'array-bracket-spacing': [ 'error', 'always' ],
    '@typescript-eslint/explicit-member-accessibility': 'error'
  }
};