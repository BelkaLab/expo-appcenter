import {
  AndroidConfig,
  ConfigPlugin,
  withStringsXml,
} from "@expo/config-plugins";

/**
 * Update `res/values/strings.xml` by adding appcenter config strings
 */
export const withAppCenterStringsXML: ConfigPlugin = (config) => {
  return withStringsXml(config, (config) => {
    config.modResults = setStrings(
      config.modResults,
      "appCenterCrashes_whenToSendCrashes",
      "DO_NOT_ASK_JAVASCRIPT"
    );
    config.modResults = setStrings(
      config.modResults,
      "appCenterAnalytics_whenToEnableAnalytics",
      "ALWAYS_SEND"
    );
    return config;
  });
};

function setStrings(
  strings: AndroidConfig.Resources.ResourceXML,
  name: string,
  value: string
) {
  // Helper to add string.xml JSON items or overwrite existing items with the same name.
  return AndroidConfig.Strings.setStringItem(
    [
      // XML represented as JSON
      //   { $: { name: 'expo_custom_value', translatable: 'false' }, _: value },
      { $: { name, translatable: "false" }, _: value },
    ],
    strings
  );
}
