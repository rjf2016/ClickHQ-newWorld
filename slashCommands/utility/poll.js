const { MessageEmbed } = require('discord.js');
const emojiCharacters = require('../../helpers/emojiCharacters.js');
const { color } = require('../../config.json');
const { channelMention } = require('@discordjs/builders');

/* @TODO:
	1) This file/command can probably be shortened to 1/3 of it's size and use 80% less resources:
			a) It creates a lot of temporary objects & allocates memory to objects that may not get used (eg `ChoiceSlots`)
			b) Iterates over objects way more than it has to (eg. pretty much every `reduce` / `filter`)
	2) Polls should be saved to DB which will further optimize this command & allow us to set the pollTime to much longer durations
*/

module.exports = {
	name: 'poll',
	description: 'Create a poll and allow others to vote',
	category: 'utility',
	options: [
		{
			name: 'question',
			description: 'The question that others will vote on',
			required: true,
			type: 'STRING',
		},
		{
			name: 'choice-a',
			description: 'The first option',
			required: true,
			type: 'STRING',
		},
		{
			name: 'choice-b',
			description: 'The second option',
			required: true,
			type: 'STRING',
		},
		{
			name: 'choice-c',
			description: 'The third option',
			required: false,
			type: 'STRING',
		},
		{
			name: 'choice-d',
			description: 'The fourth option',
			required: false,
			type: 'STRING',
		},
		{
			name: 'choice-e',
			description: 'The fifth option',
			required: false,
			type: 'STRING',
		},
		{
			name: 'time',
			description: 'How long the poll will stay open, defaults to 10 minutes. Currently limited to 10 minutes',
			required: false,
			type: 'NUMBER',
					choices: [
						{ name: '10 seconds', value: 10000 },
						{ name: '1 minute', value: 60000 },
						{ name: '10 minutes', value: 600000 },
					],
		}
	],


	run: async ({ client, interaction }) => {
		const question = interaction.options.getString('question');
		let choiceSlots = [
			{ name: 'a', value: interaction.options.getString('choice-a'), emojiChar: emojiCharacters['a'], votes: 0 },
			{ name: 'b', value: interaction.options.getString('choice-b'), emojiChar: emojiCharacters['b'], votes: 0 },
			{ name: 'c', value: interaction.options.getString('choice-c'), emojiChar: emojiCharacters['c'], votes: 0 },
			{ name: 'd', value: interaction.options.getString('choice-d'), emojiChar: emojiCharacters['d'], votes: 0 },
			{ name: 'e', value: interaction.options.getString('choice-e'), emojiChar: emojiCharacters['e'], votes: 0 },
		];

		const pollTime = interaction.options.getNumber('time') || 10000;

		// Filter out null values just to be safe
		let availableChoices = choiceSlots.filter(choice => choice.value !== null)
		// Build & format the description for our embed. Lists each choice & corresponding emoji to vote
		const embedDescription = availableChoices.reduce((_descriptionString, choice) => _descriptionString + `\n${choice.emojiChar}  -  ${choice.value}\n`, "")

		// Keeps track of who voted, to be used in the reactionFilter
		let hasVoted = [];

		// This will hold all of our accepted Emojis, to be used in the reactionFilter
		const acceptedEmojiArr = availableChoices.reduce((acc, choice) => acc.concat(choice.emojiChar), [])

		// Only allow our choice corresponding emojis to be used as reactions & make sure user hasn't already reacted
		const filter = (reaction, user) => acceptedEmojiArr.includes(reaction.emoji.name) && !hasVoted.includes(user.id)

		// Author's avatar picture, to display it in the pollEmbed
		const userPic = interaction.user.displayAvatarURL({ format: 'png'})

		const pollEmbed = {
			color: color.info,
			title: question,
			author: {
				name: '\t Vote!',
				icon_url: userPic,
			},
			description: embedDescription,
		}

		const pollMessage = await interaction.followUp({ embeds: [pollEmbed] })

		// This loops through the choices so the bot can react with each emoji
		for (const choice of availableChoices) {
			await pollMessage.react(choice.emojiChar)
		}

		console.log(`${interaction.user.tag} has started a poll!\n Question:`, question, '\n Choices: ', availableChoices)

		const collector = pollMessage.createReactionCollector({ filter, time: pollTime });

		collector.on('collect', (reaction, user) => {
			console.log(`${user.tag} just voted for ${reaction.emoji}`)
			let choiceIndex = availableChoices.findIndex(choice => choice.emojiChar == `${reaction.emoji}`)
			hasVoted.push(user.id)
			console.log('hasVoted :>> ', hasVoted);
			availableChoices[choiceIndex].votes += 1;
			return availableChoices;
		})


		collector.on('end', collected => {
			const resultDescription = availableChoices.sort((a, b) => b.votes - a.votes).reduce((_descriptionString, choice) => _descriptionString + `\n ${choice.value}: **${choice.votes}** vote(s)\n`, "");
			const resultEmbed = {
				color: color.success,
				title: question,
				author: {
					name: 'Poll complete',
					icon_url: userPic,
				},
				description: resultDescription,
			}
			pollMessage.edit({ embeds: [resultEmbed] })
		})
	},
};