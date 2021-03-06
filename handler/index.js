const { glob } = require('glob');
const { promisify } = require('util');
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require('discord.js');
const mongoose = require('mongoose');
const customCommandModel = require('../models/customCommand');

const globPromise = promisify(glob);

/**
 * @param {Client} client
 * @param {CommandInteraction} interaction
 */

module.exports = async (client) => {
	// Commands
	const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
	commandFiles.map((value) => {
		const file = require(value);
		const splitted = value.split('/');
		const directory = splitted[splitted.length - 2];

		if (file.name) {
			const properties = { directory, ...file };
			client.commands.set(file.name, properties);
		}
	});

	// Events
	const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
	eventFiles.map((value) => require(value));

	// Slash Commands
	const slashCommands = await globPromise(
		`${process.cwd()}/slashCommands/*/*.js`,
	);

	const arrayOfSlashCommands = [];
	slashCommands.map((value) => {
		const file = require(value);
		if (!file?.name) return;
		client.slashCommands.set(file.name, file);

		if (['MESSAGE', 'USER'].includes(file.type)) delete file.description;
		if (file.userPermissions) file.defaultPermission = false;
		arrayOfSlashCommands.push(file);
	});
	client.on('ready', async () => {
		// IMPORTANT !
		// currently the bot is registering commands for one server (for testing reasons) in the future it will register commands globally
		// so they can be used in any server the bot is in. When that day comes, these next few lines will need to be changed.
		const guild = client.guilds.cache.get('871582937391431681');
		await guild.commands.set(arrayOfSlashCommands).then((cmd) => {
			const getRoles = commandName => {
				const permissions = arrayOfSlashCommands.find(x => x.name === commandName).userPermissions;
				if (!permissions) return null;
				return guild.roles.cache.filter(x => x.permissions.has(permissions) && !x.managed);
			};
			const fullPermissions = cmd.reduce((acc, x) => {
				const roles = getRoles(x.name);
				if (!roles) return acc;

				const permissions = roles.reduce((a, v) => {
					return [
						...a,
						{
							id: v.id,
							type: 'ROLE',
							permission: true,
						},
					];
				}, []);
				return [
					...acc,
					{
						id: x.id,
						permissions,
					},
				];
			}, []);
			guild.commands.permissions.set({ fullPermissions });
		});

		customCommandModel.find().then((data) => {
			data.forEach((cmd) => {
				const guild = client.guilds.cache.get(cmd.guildId);
				guild?.commands.create({
					name: cmd.commandName,
					description: cmd.commandDescription,
				})
			})
		})
	});

	// mongoose
	const mongooseConnection = process.env.MONGODBSRV;
	if (!mongooseConnection) return console.error('Missing Mongoose connection');

	mongoose.connect(mongooseConnection, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	}).then(() => console.log('Connected to mongodb'));
};