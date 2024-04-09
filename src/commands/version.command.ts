import { Command } from "../types/command.types.ts";
import { green } from "deno/fmt/colors.ts";
import { config } from "../../config.ts";

export const versionCommand: Command = {
  name: "Version",
  description: "version command",

  alias: ["version", "--v"],

  help: () => "Receive the version of the cli",
  run: async (args) => {
    console.log(green(config.version));
  },
};
