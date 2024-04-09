import { Command } from '../../types/command.types.ts';
import { red, yellow } from 'deno/fmt/colors.ts';
import yaml from 'npm:yaml';
import { getPath } from '../../utils.ts';
import * as path from 'deno/path/mod.ts';

const SEMANTIC_VERSION_REGEX =
	/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export const serverInitCommand: Command = {
	name: 'Init Server file',
	description: 'Server command',

	alias: ['init'],

	help: () => 'This is the help command!',
	run: async ([, ...args], force) => {
		const dirPath = getPath();
		const serverFilePath = path.join(dirPath, 'server.yml');

		//check if server.yml exists
		if (!force)
			try {
				await Deno.lstat(serverFilePath);
				console.log(
					yellow(
						'This folder already contains a "server.yml" file, use --force to overwrite it!',
					),
				);
				return;
			} catch (err) {}

		const response = await fetch(
			'https://api.voidpixel.net/api/collections/public_information/records/0',
		);
		const { release_version } = await response.json();

		let build;
		let hasErrors = false;
		do {
			build = prompt(`Build version (${release_version}):`);

			hasErrors = build.length && !build.match(SEMANTIC_VERSION_REGEX);

			if (hasErrors) {
				console.log(red(`"${build}" is not a valid build`));
			}
		} while (hasErrors);
		if (!build.length) build = release_version;

		let name = prompt(`Server name (My server name):`);
		if (!name.length) name = 'My server name';

		let description = prompt(`Server description (Welcome to my server!):`);
		if (!description.length) description = 'Welcome to my server!';

		let website = prompt(`Server website:`);

		let isPublic: 'y' | 'n' = 'n';
		hasErrors = false;
		do {
			isPublic = prompt(`Server is going to be public (y/N)?`) as any;

			hasErrors =
				isPublic.length &&
				isPublic.toLowerCase() !== 'y' &&
				isPublic.toLowerCase() !== 'n';
		} while (hasErrors);
		if (!isPublic.length) isPublic = 'n';

		const serverData = {
			version: 1,
			build,
			name,
			description,
			website,
			public: isPublic === 'y',
			offline: false,
			mods: [{ name: 'dummy', version: '1.2.3' }],
		};

		await Deno.writeTextFile(serverFilePath, yaml.stringify(serverData));
	},
};
