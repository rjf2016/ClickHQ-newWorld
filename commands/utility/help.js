/* eslint-disable no-useless-escape */
const { prefix, color } = require('../../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'help',
	category: 'utility',
	aliases: ['commands'],
	usage: 'help or help [command]',
	description: 'Get a list of Click Bot commands or get help with a specific command',
	requiredPermission: 'ANY',

	run: async (client, message, args) => {
		const data = [];
		const { commands } = message.client;
		const commandHelperObj = {};

		const helpEmbed = {
			title: 'Click Bot\'s Commands',
			url: 'https://github.com/rjf2016/ClickHQ-newWorld',
			thumbnail: { url: 'https://cdn.discordapp.com/avatars/872627726098514020/6a82e78394a88dc7f75245e1eda1f50f.webp' },
			fields: [],
			color: color.info,
		};

		if (!args.length) {
			commands.forEach(o => {
				commandHelperObj[o.category] = commandHelperObj[o.category] || new Set();
				commandHelperObj[o.category].add(o.name);
			});

			for (const category in commandHelperObj) {
				const categoryCommands = [...commandHelperObj[category]].join(' , ');
				console.log(categoryCommands);
				helpEmbed.fields.push({ name: category, value: categoryCommands });
			}

			helpEmbed.fields.push({ name: '\u200B', value: 'Use ``!help [command]`` to get more info on a command!' });

			return message.author.send({ embed: helpEmbed })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you!');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

		message.channel.send(data, { split: true });
	},
};
