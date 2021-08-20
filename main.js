require('dotenv').config();
const { Client } = require('discord.js');
const { prefix } = require('./config.json');
const { registerCommands, registerEvents } = require('./utils/registry');
const client = new Client({ partials: ['MESSAGE'] });

(async () => {
  client.commands = new Map();
  client.events = new Map();
  client.prefix = prefix;
  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await client.login(process.env.TOKEN);
})();
