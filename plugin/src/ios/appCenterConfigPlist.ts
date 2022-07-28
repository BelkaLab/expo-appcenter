import {
  ConfigPlugin,
  withXcodeProject,
  XcodeProject,
} from "@expo/config-plugins";
import { getSourceRoot } from "@expo/config-plugins/build/ios/Paths";
import {
  addResourceFileToGroup,
  getProjectName,
} from "@expo/config-plugins/build/ios/utils/Xcodeproj";
import fs from "fs";
import path from "path";

export const withIosAppCenterConfigFile: ConfigPlugin<{
  relativePath: string;
}> = (config, { relativePath }) => {
  return withXcodeProject(config, (config) => {
    config.modResults = setAppCenterConfigFile({
      projectRoot: config.modRequest.projectRoot,
      project: config.modResults,
      appCenterConfigFileRelativePath: relativePath,
    });
    return config;
  });
};

export function setAppCenterConfigFile({
  projectRoot,
  project,
  appCenterConfigFileRelativePath,
}: {
  project: XcodeProject;
  projectRoot: string;
  appCenterConfigFileRelativePath: string;
}): XcodeProject {
  const appCenterConfigFilePath = path.resolve(
    projectRoot,
    appCenterConfigFileRelativePath
  );

  fs.copyFileSync(
    appCenterConfigFilePath,
    path.join(getSourceRoot(projectRoot), "AppCenter-Config.plist")
  );

  const projectName = getProjectName(projectRoot);
  const plistFilePath = `${projectName}/AppCenter-Config.plist`;
  if (!project.hasFile(plistFilePath)) {
    project = addResourceFileToGroup({
      filepath: plistFilePath,
      groupName: projectName,
      project,
      isBuildFile: true,
    });
  }
  return project;
}
