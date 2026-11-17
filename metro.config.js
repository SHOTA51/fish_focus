const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add 'riv' to asset extensions for Rive animations
config.resolver.assetExts.push("riv");

module.exports = withNativeWind(config, { input: "./global.css" });
