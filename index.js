require('dotenv').config();
const { Client, Collection } = require('discord.js');

const client = new Client({
	intents: 32767,
});

module.exports = client;

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.handlers = new Collection();
client.config = require('./config.json');

// Initializing the project
require('./handler')(client);

try {
	client.login(process.env.TOKEN);
} catch (error) {
	console.error(error);
}
