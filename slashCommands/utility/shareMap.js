module.exports = {
	name: 'map',
	description: 'Send the link to New World map',
	category: 'utility',

	run: async ({ client, interaction }) => {
		interaction.followUp('https://www.newworld-map.com/#/');
	},
};