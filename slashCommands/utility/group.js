const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
	name: 'group',
	description: 'Creates a hidden voice channel',
	userPermissions: ['ADMINISTRATOR'],
	/**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
	run: async (client, interaction) => {
		// This command requires that the server contains a category dedicated to housing spawned group channels.
		// The name of this category is defined as`serverGroupCategoryName` in the config.json file, in case it is ever changed. The category name is CASE SENSITIVE!
		const groupCategoryName = config.serverGroupCategoryName;
		const owner = interaction.user.id;
		console.log('ORIGINAL OWNER: ', owner);

		const category = await interaction.guild.channels.cache.find(c => c.name == groupCategoryName && c.type === 'GUILD_CATEGORY');
		const allRoles = await interaction.guild.roles.cache.find(role => role.name === '@everyone');

		const createChannel = await interaction.guild.channels.create(`${interaction.user.username}'s group`, {
			type: 'GUILD_VOICE',
			parent: category.id,
			permissionOverwrites: [
				{
					id: allRoles.id,
					deny: ['VIEW_CHANNEL'],
				},
				{
					id: interaction.user.id,
					allow: ['VIEW_CHANNEL'],
				},
			],
		});

		// This is probably an absolute hack, come back to this when its not 2am..
		const HACK_USER = owner;
		const HACK_CHANNEL = createChannel.id;

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(`joinGroup/${HACK_USER}/${HACK_CHANNEL}`)
					.setLabel('Join')
					.setStyle('SUCCESS'),
			);

		// eslint-disable-next-line no-unused-vars
		const inviteEmbed = new MessageEmbed()
			.setColor(config.color.info)
			.setTitle(`${interaction.user.username} has started a group!`)
			.setDescription('Its currently hidden, click the button to join');

		createChannel;
		await interaction.editReply({ embeds: [inviteEmbed], components: [row] });
	},
};