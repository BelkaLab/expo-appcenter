import {
  ConfigPlugin,
  ModPlatform,
  withDangerousMod,
} from "@expo/config-plugins";
import { ExpoConfig } from "@expo/config-types";
import fs from "fs/promises";
import path from "path";

interface CopyFileProps {
  platform: ModPlatform;
  from: string;
  to: string;
}

export const withCopyFile: ConfigPlugin<CopyFileProps> = (
  config: ExpoConfig,
  { platform, from, to }
) =>
  withDangerousMod(config, [
    platform,
    async (config) => {
      const srcPath = path.resolve(config.modRequest.projectRoot, from);
      const destPath = path.resolve(config.modRequest.platformProjectRoot, to);

      const folder = path.dirname(destPath);
      const folderExists = await fileExists(folder);
      if (!folderExists) {
        await fs.mkdir(folder, { recursive: true });
      }
      await fs.copyFile(srcPath, destPath);
      return config;
    },
  ]);

type AccessError = {
  code: string;
};

async function fileExists(filename: string) {
  try {
    await fs.access(filename);
    return true;
  } catch (err) {
    if ((err as AccessError).code === "ENOENT") {
      return false;
    } else {
      throw err;
    }
  }
}
