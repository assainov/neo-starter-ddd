/* eslint-env node */
module.exports = {
  root: true,
  extends: [ '@neo/eslint-config/base.js' ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    projectService: {
      allowDefaultProject: [ '.eslintrc.js' ],
    },
    tsconfigRootDir: __dirname
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
