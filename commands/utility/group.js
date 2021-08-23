const config = require('../../config.json');
const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class group extends BaseCommand {
	constructor() {
		super({
			name: 'group',
			category:'utility',
			description: 'Creates a hidden voice channel, and puts a message in chat saying you just set up a group. When other users (react) with a 👋 they can view/join your group',
			requiredPermission: 'ANY',
		});
	}

	async run(client, message) {
		if (message.guild === null) return message.reply('I cant run this command in a DM!');
		// This command requires that the server contains a category dedicated to housing spawned group channels.
		// The name of this category is defined as`serverGroupCategoryName` in the config.json file, in case it is ever changed. The category name is CASE SENSITIVE!
		const groupCategory = config.serverGroupCategoryName;
		const category = message.guild.channels.cache.find(c => c.name == groupCategory && c.type === 'category');
		const allRoles = message.guild.roles.cache.find(role => role.name === '@everyone');

		// eslint-disable-next-line no-unused-vars
		const Filter = (reaction, user) => reaction.emoji.name === '👋';

		const inviteEmbed = new MessageEmbed()
			.setTitle(`${message.author.username} has started a group`)
			.setDescription('React to this message with a 👋 to join the group')
			.setColor(config.color.info);

		const inviteMessage = await message.channel.send(inviteEmbed);

		const createChannel = await message.guild.channels.create(`${message.author.username}'s group`, {
			type: 'voice',
			parent: category.id,
			permissionOverwrites: [
				{
					id: allRoles.id,
					deny: ['VIEW_CHANNEL'],
				},
				{
					id: message.author.id,
					allow: ['VIEW_CHANNEL'],
				},
			],
		});

		if (!category) return message.channel.send('The category you gave me doesnt exist in this server!');

		await inviteMessage.react('👋');

		const collector = inviteMessage.createReactionCollector(Filter, { time: 100000 });

		collector.on('collect', (reaction, user) => {
			createChannel.updateOverwrite(user, {
				VIEW_CHANNEL: true,
			}).catch(console.error);
		});

		collector.on('end', collected => console.log(`COLLECTED ${collected.size} items`));

	}
};
