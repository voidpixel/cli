import { Command } from '../types/command.types.ts';
import * as path from 'deno/path/mod.ts';
import { getExecPath, getPath } from '../utils.ts';

export const upgradeCommand: Command = {
	name: 'Upgrade',
	description: 'upgrade command',

	alias: ['upgrade'],

	help: () => 'This is the upgrade command!',
	run: async args => {
		const dirPath = getPath();

		const updateFilePath = path.join(dirPath, './void-update');

		const execFile = getExecPath().replace(/\\/g, '/');
		const updatedFile = path
			.join(dirPath, 'void_win_2.exe')
			.replace(/\\/g, '/');

		console.log(updatedFile, execFile);
		await Deno.writeTextFile(
			updateFilePath,
			`
			setTimeout(async () => {
				await Deno.remove('${execFile}')
				await Deno.rename('${updatedFile}', '${execFile}');
			}, 100);
			`,
		);

		Deno.run({
			cmd: ['deno', 'run', '--allow-write', '--allow-read', updateFilePath],
			stdout: 'piped',
			stderr: 'piped',
			stdin: 'piped',
			detached: true,
		});
	},
};
