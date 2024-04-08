import * as path from "deno/path/mod.ts";

export const getExecPath = () => Deno.execPath();
export const getPath = () => path.dirname(getExecPath());

export const getOSName = () => {
  const { os } = Deno.build;
  switch (os) {
    case "darwin":
    case "windows":
      return os;
    default:
      return "linux";
  }
};

export const getTemporalUpdateFilePathname = () => {
  const dirPath = getPath();
  const isWindows = Deno.build.os === "windows";

  return path.join(dirPath, "./.void-update") + (isWindows ? ".ps1" : ".sh");
};
