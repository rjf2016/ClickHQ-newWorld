module.exports = {
	name: 'ping',
	description: 'returns websocket ping',
	userPermissions: ['ADMINISTRATOR'],
	/**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
	run: async (client, interaction) => {
		interaction.reply({ content: `${client.ws.ping}ms!` });
	},
};