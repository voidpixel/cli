import { parseArgs } from "deno/cli/parse_args.ts";
import { commandList } from "./commands/commands.ts";
import { versionCommand } from "./commands/version.command.ts";
import { getTemporalUpdateFilePathname } from "./utils.ts";

// remove temporal files
{
  const updateFilePath = getTemporalUpdateFilePathname();
  try {
    await Deno.lstat(updateFilePath);
    Deno.remove(updateFilePath);
  } catch (err) {}
}

const helpCommand = commandList.find(({ alias }) => alias.includes("help"));
const { _, force, f, help, h, version, v, ...props } = parseArgs(Deno.args);

const isArgsEmpty = _.length === 0;

if (isArgsEmpty && (help || h)) {
  await helpCommand.run();
  Deno.exit(0);
}
if (isArgsEmpty && (version || v)) {
  await versionCommand.run();
  Deno.exit(0);
}

const command = commandList.find(({ alias }) =>
  alias.some((currentAlias: string) => _[0] === currentAlias.replace("--", ""))
);

if (!command) await helpCommand.run();
else command.run(_, force || f);
