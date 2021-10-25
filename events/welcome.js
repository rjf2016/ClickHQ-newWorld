const client = require('../index');
const { MessageEmbed } = require('discord.js');

client.on('guildMemberAdd', async member => {
	const { id } = member;
	const rules = await member.send(`Hi ${member} this is just a test`);
	await rules.react('✅')
	console.log(`I just DM'd ${member.username} the server rules. Waiting on reply ...`)

	const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === id;

	rules.awaitReactions({ filter, max: 1})
		.then(collected => {
			const reaction = collected.first();
			console.log(`✅ ${member.username} has accepted the server rules! `)
		})
})