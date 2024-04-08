import { Command } from "../types/command.types.ts";
import { commandList } from "./commands.ts";

export const helpCommand: Command = {
  name: "Help",
  description: "Help command",

  alias: ["help", "--h"],

  help: () => "This is the help command!",
  run: async () => {
    const commandFilterList = commandList.map(
      ({ alias, name, description }) => [alias.join(", "), description],
    );

    let maxLengths = Object.keys(commandFilterList[0]).map((key) =>
      Math.max(...commandFilterList.map((obj) => String(obj[key]).length))
    );

    let table = commandFilterList
      .map((obj) =>
        obj.map((value, i) => String(value).padEnd(maxLengths[i])).join(" | ")
      )
      .join("\n");
    console.log("Available commands:");
    console.log(table);
  },
};
