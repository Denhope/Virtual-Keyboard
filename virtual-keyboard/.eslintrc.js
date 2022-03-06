module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['import'],
  ignorePatterns: ['dist', 'node_modules'],
  rules: {
    'linebreak-style': ['error', 'windows'],
    'import/prefer-default-export': off,
  },
};
