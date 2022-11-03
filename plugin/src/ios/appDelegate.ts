import {
  ConfigPlugin,
  IOSConfig,
  withDangerousMod,
} from "@expo/config-plugins";
import fs from "fs/promises";

const methodInvocationBlock = `[AppCenterReactNative register];
  [AppCenterReactNativeAnalytics registerWithInitiallyEnabled:true];
  [AppCenterReactNativeCrashes registerWithAutomaticProcessing];`;

export function modifyObjcAppDelegate(contents: string): string {
  // Add import
  if (!contents.includes("#import <AppCenterReactNative.h>")) {
    contents = contents.replace(
      /#import "AppDelegate.h"/g,
      `#import "AppDelegate.h"
#import <AppCenterReactNative.h>
#import <AppCenterReactNativeAnalytics.h>
#import <AppCenterReactNativeCrashes.h>`
    );
  }

  // Add invocation
  if (!contents.includes(methodInvocationBlock)) {
    contents = contents.replace(
      /\[super application\:application didFinishLaunchingWithOptions\:launchOptions\]/g,
      `${methodInvocationBlock}
      
[super application:application didFinishLaunchingWithOptions:launchOptions]`
    );
  }

  return contents;
}

export const withAppCenterAppDelegate: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const fileInfo = IOSConfig.Paths.getAppDelegate(
        config.modRequest.projectRoot
      );
      let contents = await fs.readFile(fileInfo.path, "utf-8");
      if (fileInfo.language === "objc" || fileInfo.language === "objcpp") {
        contents = modifyObjcAppDelegate(contents);
      } else {
        // TODO: Support Swift
        throw new Error(
          `Cannot add AppCenter code to AppDelegate of language "${fileInfo.language}"`
        );
      }
      await fs.writeFile(fileInfo.path, contents);

      return config;
    },
  ]);
};
