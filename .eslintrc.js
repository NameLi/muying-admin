module.exports = {
  // root: true,
  env: {
    // node: true
  },
  'extends': [
    // 'plugin:vue/essential',
    // '@vue/prettier'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // "quotes": [1, "single"],
    // 'semi': "off"
    'space-before-function-paren': 0
  },
  parserOptions: {
    // parser: 'babel-eslint'
  }
}
