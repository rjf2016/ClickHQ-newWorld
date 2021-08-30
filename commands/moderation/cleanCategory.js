/* eslint-disable no-unused-vars */
const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');


module.exports = {
	name: 'clean',
	aliases: ['cc'],

	run: async (client, message, args) => {

		const path = args.join(' ').split(' / ');
		const [ pathChannel, pathCategory ] = [ path[0], path[1] ];

		if (path.length !== 2 || !pathChannel || !pathCategory) return message.error;

		const countChannels = (channel, cat) => channel === '*' ? cat.children : cat.children.filter(c => c.name.toUpperCase() === channel.toUpperCase());

		const foundCategory = message.guild.channels.cache.find(c => (c.name.toUpperCase() === pathCategory.toUpperCase()) && c.type === 'category');
		const Filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;

		const occurances = countChannels(pathChannel, foundCategory);
		const deletedCountMessage = occurances.size < 2 ? 'one channel' : `${occurances.size} channels`;

		const confirmEmbed = new MessageEmbed()
			.setTitle(`This would delete ***${occurances.size} channel(s)*** from ***${pathCategory}***`)
			.setDescription('React with one of the following to proceed')
			.addFields({ name: '✅ = Continue   ', value: '\u200b', inline: true }, { name: '   ❌ = Marty I\'m scared', value: '\u200b', inline: true })
			.setFooter('If you don\'t answer in 15 seconds the command will be cancelled')
			.setColor(config.color.info);

		const successEmbed = new MessageEmbed()
			.setDescription(`🧹   ${message.author.username} just cleaned up ${deletedCountMessage}    🧹`)
			.setColor(config.color.success);

		const cancelEmbed = new MessageEmbed()
			.setDescription('👋   Cleanup has been cancelled  👋')
			.setColor(config.color.dark);

		const confirmationMessage = await message.channel.send(confirmEmbed);

		// If category doesnt exist in server OR the entered channel doesn't exist within the given category => return errorMessage
		if (!foundCategory || occurances.size < 1) return message.error;

		await confirmationMessage.react('✅');
		await confirmationMessage.react('❌');

		const collector = confirmationMessage.createReactionCollector(Filter, { time: 15000 });

		collector.on('collect', (reaction, user) => {
			if (reaction.emoji.name === '✅') {
				occurances.forEach(c => c.delete());
				confirmationMessage.edit(successEmbed);
			}
			else if (reaction.emoji.name === '❌') {
				confirmationMessage.edit(cancelEmbed);
			}
			return confirmationMessage.reactions.removeAll();
		});

		collector.on('end', collected => {
			console.log(collected.size);
			if (collected.size < 1) {
				confirmationMessage.edit(cancelEmbed);
				confirmationMessage.reactions.removeAll();
			}
		});
	},
};
