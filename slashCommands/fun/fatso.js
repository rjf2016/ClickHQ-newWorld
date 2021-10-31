const { MessageAttachment } = require('discord.js')

module.exports = {
	name: 'fatso',
	description: 'Look at the fatso',

	run: async ({ client, interaction }) => {

		interaction.followUp( {content: 'If you see this fatso roaming Valgrind and you kill him & post a screenshot, <@237337390681686016> will send you 1,000g', files: ['img/fatty.png'] });
	},
};