module.exports = {
	name: 'prune',
	description: 'Deletes previous messages in current text channel',
	userPermissions: ['ADMINISTRATOR'],
	category: 'moderation',
	options: [
		{
			name: 'amount',
			description: 'Amount of messages to delete',
			type: 'NUMBER',
			required: true,
		},
	],

	run: async (client, interaction) => {
		const Amount = interaction.options.getNumber('amount');
		if (isNaN(Amount)) return interaction.followUp('Thats not a number!');
		if (Amount <= 1 || Amount > 500) return interaction.followUp('The number of messages must be between 1 and 499!');
		try {
			await interaction.channel.bulkDelete(Amount, true);
		} catch (err) {
			console.error(err);
		}
	},
};
