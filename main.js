require('dotenv').config();
const { Client } = require('discord.js');
const { prefix } = require('./config.json');
const { Logger } = require('./helpers/logger');
const { registerCommands, registerEvents } = require('./utils/registry');
const client = new Client({ partials: ['MESSAGE'] });

async function init() {
	client.commands = new Map();
	client.events = new Map();
	client.prefix = prefix;
	client.logger = Logger;
	await registerCommands(client, '../commands');
	await registerEvents(client, '../events');
	await client.login(process.env.TOKEN);
}

init();

process.on('unhandledRejection', err => {
	console.log('Unknown error occured:\n');
	console.log(err);
});