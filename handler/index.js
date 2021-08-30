const { glob } = require('glob');
const { promisify } = require('util');
// eslint-disable-next-line no-unused-vars
const { Client } = require('discord.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const globPromise = promisify(glob);

/**
 * @param {Client} client
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
		`${process.cwd()}/SlashCommands/*/*.js`,
	);

	const arrayOfSlashCommands = [];
	slashCommands.map((value) => {
		const file = require(value);
		if (!file?.name) return;
		client.slashCommands.set(file.name, file);

		if (['MESSAGE', 'USER'].includes(file.type)) delete file.description;
		arrayOfSlashCommands.push(file);
	});
	client.on('ready', async () => {
		await client.application.commands.set(arrayOfSlashCommands);
	});

	// mongoose
	const mongooseConnection = process.env.MONGODBSRV;
	if (!mongooseConnection) return console.error('Missing Mongoose connection');

	mongoose.connect(mongooseConnection, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	}).then(() => console.log('Connected to mongodb'));
};