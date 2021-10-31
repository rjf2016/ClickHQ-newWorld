module.exports = {
	name: 'simjoin',
	description: 'dev testing command to simulate member join',

	run: async ({ client, interaction }) => {
		client.emit('guildMemberAdd', interaction.user)
		interaction.followUp({ content: 'Join simulated' });
	},
};