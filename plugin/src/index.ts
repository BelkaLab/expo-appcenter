import { ConfigPlugin, StaticPlugin, withPlugins } from "@expo/config-plugins";
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
  /**
   * Disable iOS App Center integration
   * @default false
   */
  disableiOS?: boolean;
  /**
   * Disable Android App Center integration
   * @default false
   */
  disableAndroid?: boolean;
}

/**
 * A config plugin for configuring `appcenter`
 */
const withAppCenter: ConfigPlugin<PluginProps> = (
  config,
  {
    androidAppCenterPath,
    iosAppCenterPath,
    androidOptions = {},
    disableiOS = false,
    disableAndroid = false,
  } = {}
) => {
  if (disableiOS && disableAndroid) {
    return config;
  }
  const resolvedAndroidConfigPath =
    androidAppCenterPath || DEFAULT_ANDROID_APP_CENTER_CONFIG_PATH;

  const resolvedIosConfigPath =
    iosAppCenterPath || DEFAULT_IOS_APP_CENTER_CONFIG_PATH;

  const iosPlugins = disableiOS
    ? []
    : [
        withAppCenterAppDelegate,
        [
          withIosAppCenterConfigFile,
          {
            relativePath: resolvedIosConfigPath,
          },
        ],
      ];

  const androidPlugins = disableAndroid
    ? []
    : [
        [withAppCenterStringsXML, androidOptions],
        [
          withAndroidAppCenterConfigFile,
          {
            relativePath: resolvedAndroidConfigPath,
          },
        ],
      ];

  return withPlugins(config, [
    ...(iosPlugins as StaticPlugin[]),
    ...(androidPlugins as StaticPlugin[]),
  ]);
};

export default withAppCenter;
