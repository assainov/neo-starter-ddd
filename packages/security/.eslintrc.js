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
};