// Adopts the UIScene life cycle, which apps built with the iOS 27 SDK need to launch at all
// ("UIScene life cycle is required for apps built with this SDK"). Expo ships the scene delegate
// (ExpoAppSceneDelegate) but the SDK 57 prebuild template still starts React Native from the app
// delegate, so this plugin wires it up: the scene delegate creates the window and starts React Native
// with the factory the app delegate exposes through ExpoReactNativeFactoryProvider.
const { withAppDelegate, withInfoPlist } = require('expo/config-plugins');

const WINDOW_START = /\n#if os\(iOS\) \|\| os\(tvOS\)\n\s*window = UIWindow\(frame: UIScreen\.main\.bounds\)\n\s*factory\.startReactNative\([\s\S]*?\n#endif\n/;

function withSceneManifest(config) {
  return withInfoPlist(config, (cfg) => {
    cfg.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: 'Default Configuration',
            UISceneDelegateClassName: 'EXExpoAppSceneDelegate',
          },
        ],
      },
    };
    return cfg;
  });
}

function withSceneAppDelegate(config) {
  return withAppDelegate(config, (cfg) => {
    if (cfg.modResults.language !== 'swift') {
      throw new Error('withSceneDelegate only supports a Swift AppDelegate.');
    }
    let src = cfg.modResults.contents;
    if (!src.includes('ExpoReactNativeFactoryProvider')) {
      if (!src.includes('class AppDelegate: ExpoAppDelegate {') || !WINDOW_START.test(src)) {
        throw new Error('withSceneDelegate: AppDelegate.swift does not match the expected Expo template.');
      }
      src = src
        .replace('class AppDelegate: ExpoAppDelegate {', 'class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {')
        // The window now belongs to the scene; ExpoAppSceneDelegate starts React Native in it.
        .replace(WINDOW_START, '\n');
    }
    cfg.modResults.contents = src;
    return cfg;
  });
}

module.exports = function withSceneDelegate(config) {
  return withSceneAppDelegate(withSceneManifest(config));
};
