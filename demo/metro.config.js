const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const libraryRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Watch the library source so local changes hot-reload in the demo.
config.watchFolders = [libraryRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(libraryRoot, 'node_modules'),
];

// Prefer the demo's copies of react / react-native / expo packages.
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
