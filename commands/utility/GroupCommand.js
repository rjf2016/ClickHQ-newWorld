const config = require('../../config.json');
const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class GroupCommand extends BaseCommand {
	constructor() {
		super('group', 'utility', [], 'group', 'Creates a hidden voice channel, and puts a message in chat saying you just set up a group. When other users (react) with a 👋 they can view/join your group - keeping the Discord from getting cluttered.', 'ANY');
	}

	async run(client, message) {

		console.log('group command')
		// This command requires that the server contains a category dedicated to housing spawned group channels.
		// The name of this category is defined as`serverGroupCategoryName` in the config.json file, in case it is ever changed. The category name is CASE SENSITIVE!
		const groupCategory = config.serverGroupCategoryName;
		const category = message.guild.channels.cache.find(c => c.name == groupCategory && c.type === 'category');
		const allRoles = message.guild.roles.cache.find(role => role.name === '@everyone');

		const Filter = (reaction, user) => reaction.emoji.name === '👋';

		const inviteEmbed = new MessageEmbed()
			.setTitle(`${message.author.username} has started a group`)
			.setDescription('React to this message with a 👋 to join the group')
			.setColor(config.color.info)

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
			]
		})

		if (!category) {
			console.error(`Couldn't find the category ***${groupCategory}*** in this server.`);
			return
		}

		await inviteMessage.react('👋');

		const collector = inviteMessage.createReactionCollector(Filter, { time: 100000 });

		collector.on('collect', (reaction, user) => {
			createChannel.updateOverwrite(user, {
				VIEW_CHANNEL: true
			}).catch(console.error)
		})

		collector.on('end', collected => console.log(`COLLECTED ${collected.size} items`));

	};
}
