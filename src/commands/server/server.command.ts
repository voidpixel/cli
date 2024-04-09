import { Command } from "../../types/command.types.ts";
import { helpCommandFunction } from "../help.command.ts";
import { serverInitCommand } from "./init.command.ts";

export const serverCommandList: Command[] = [serverInitCommand];

export const serverCommand: Command = {
  name: "Server",
  description: "Server command",

  alias: ["server", "--s"],

  help: () => "Server command",
  run: async ([, ...args], force) => {
    const commandFound = serverCommandList.find(({ alias }) =>
      alias.includes(args[0])
    );

    if (commandFound) return await commandFound.run(args, force);
    return await helpCommandFunction(serverCommandList).run();
  },
};
