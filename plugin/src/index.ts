import { ConfigPlugin, withPlugins } from "@expo/config-plugins";
import {
  AndroidProps,
  withAndroidAppCenterConfigFile,
  withAppCenterStringsXML,
} from "./android";

import { withAppCenterAppDelegate, withIosAppCenterConfigFile } from "./ios";

const DEFAULT_ANDROID_APP_CENTER_CONFIG_PATH =
  "appcenter/appcenter-config.json";
const DEFAULT_IOS_APP_CENTER_CONFIG_PATH = "appcenter/AppCenter-Config.plist";

interface PluginProps {
  /**
   * Custom location of `appcenter-config.json`,
   * relative to project root
   */
  androidAppCenterPath?: string;
  /**
   * Custom location of `AppCenter-Config.plist`,
   * relative to project root
   */
  iosAppCenterPath?: string;

  androidOptions?: AndroidProps;
}

/**
 * A config plugin for configuring `appcenter`
 */
const withAppCenter: ConfigPlugin<PluginProps> = (
  config,
  { androidAppCenterPath, iosAppCenterPath, androidOptions = {} } = {}
) => {
  const resolvedAndroidConfigPath =
    androidAppCenterPath || DEFAULT_ANDROID_APP_CENTER_CONFIG_PATH;

  const resolvedIosConfigPath =
    iosAppCenterPath || DEFAULT_IOS_APP_CENTER_CONFIG_PATH;

  return withPlugins(config, [
    // iOS
    withAppCenterAppDelegate,
    [
      withIosAppCenterConfigFile,
      {
        relativePath: resolvedIosConfigPath,
      },
    ],
    // Android
    [withAppCenterStringsXML, androidOptions],
    [
      withAndroidAppCenterConfigFile,
      {
        relativePath: resolvedAndroidConfigPath,
      },
    ],
  ]);
};

export default withAppCenter;
