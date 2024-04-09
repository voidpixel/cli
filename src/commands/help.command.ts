import { Command } from "../types/command.types.ts";

export const helpCommandFunction = (commandList: Command[]): Command => ({
  name: "Help",
  description: "Help command",

  alias: ["help", "--h"],

  help: () => "Help command",
  run: async () => {
    const commandFilterList = commandList.map(({ alias, name, help }) => [
      alias.join(", "),
      help(),
    ]);

    commandFilterList.push(["help, --h", "Help command"]);

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
});
