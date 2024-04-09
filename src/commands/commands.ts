import { helpCommandFunction } from "./help.command.ts";
import { versionCommand } from "./version.command.ts";
import { upgradeCommand } from "./upgrade.command.ts";
import { serverCommand } from "./server/server.command.ts";

const initialCommandList = [versionCommand, upgradeCommand, serverCommand];

export const commandList = [
  helpCommandFunction(initialCommandList),
  ...initialCommandList,
];
