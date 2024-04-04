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

		const isWindows = Deno.build.os === 'windows';

		const updateFilePath =
			path.join(dirPath, './void-update') + (isWindows ? '.ps1' : '.sh');

		// Download last version
		const response = await fetch(
			'https://api.github.com/repos/voidpixel/cli/releases/latest',
		);

		const execFile = getExecPath();
		const updatedFile = path.join(dirPath, 'void_win_2.exe');

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
			cmd: [isWindows ? 'powershell' : 'sh', updateFilePath],
			stdin: 'null',
			stdout: 'null',
			stderr: 'null',
			detached: true,
		});
	},
};
