import { Command } from "../types/command.types.ts";
import * as path from "deno/path/mod.ts";
import {
  getExecPath,
  getOSName,
  getPath,
  getTemporalUpdateFilePathname,
} from "../utils.ts";
import { config } from "../../config.ts";
import { green } from "deno/fmt/colors.ts";

export const upgradeCommand: Command = {
  name: "Upgrade",
  description: "upgrade command",

  alias: ["upgrade"],

  help: () => "This is the upgrade command!",
  run: async (args, force) => {
    const updateFilePath = getTemporalUpdateFilePathname();

    // Download last version
    let response = await fetch(
      "https://api.github.com/repos/voidpixel/cli/releases/latest",
    );
    const { tag_name, assets } = await response.json();

    const [oldMajor, oldMinor, oldPatch] = config.version
      .split(".")
      .map((e: string) => parseInt(e));
    const [newMajor, newMinor, newPatch] = tag_name
      .split(".")
      .map((e: string) => parseInt(e));

    if (
      !force &&
      oldMajor >= newMajor &&
      oldMinor >= newMinor &&
      oldPatch >= newPatch
    ) {
      return args.silence || console.log(green("Your land is up to date!"));
    }

    const osName = getOSName();

    let fileName = `void_${osName}`;
    if (osName === "windows") fileName += ".exe";

    const buildAsset = assets.find(({ name }: any) => name === fileName);

    response = await fetch(buildAsset.browser_download_url);

    const execFile = getExecPath();
    const updatedFile = path.join(dirPath, `_${fileName}`);

    await Deno.writeFile(
      updatedFile,
      new Uint8Array(await response.arrayBuffer()),
    );

    const bash = `#! /bin/bash
			sleep 0.5
			rm ${execFile}
			mv ${updatedFile} ${execFile}`;

    const ps1 = `#!/usr/bin/env pwsh
			Start-Sleep -Milliseconds 500
			Remove-Item ${execFile}
			Move-Item ${updatedFile} ${execFile}
		`;

    await Deno.writeTextFile(updateFilePath, isWindows ? ps1 : bash);

    Deno.run({
      cmd: [isWindows ? "powershell" : "sh", updateFilePath],
      stdin: "null",
      stdout: "null",
      stderr: "null",
      detached: true,
    });
  },
};
