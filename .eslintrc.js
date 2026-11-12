module.exports = {
  root: true,
  extends: '@react-native',
  ignorePatterns: ['lib/', 'demo/', 'node_modules/', 'coverage/'],
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
};
