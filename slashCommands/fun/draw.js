const Canvas = require('canvas');
const { MessageAttachment } = require('discord.js');

module.exports = {
	name: 'draw',
	description: 'Internal command to test canvas',
	category: 'fun',

	run: async (client, interaction) => {
		const canvas = Canvas.createCanvas(1200, 517);
		const context = canvas.getContext('2d');

		const background = await Canvas.loadImage('./img/newWorldProfile.jpg');
		context.drawImage(background, 0, 0, canvas.width, canvas.height);

		context.fillStyle = 'rgba(0,0,0,.9)';
		context.fillRect(0, 0, canvas.width, canvas.height);

		// Full card
		// context.fillStyle = '#7289DA';
		// context.fillRect(0, 0, canvas.width, canvas.height);

		// Top bar background
		// context.fillStyle = '#23272A'
		// context.fillRect(0, 0, canvas.width, 120);


		context.font = '32px sans-serif';
		context.fillStyle = '#ffffff';
		context.fillText(`${interaction.member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

		context.beginPath();
		context.arc(100, 100, 80, 0, Math.PI * 2, true);
		context.closePath();
		context.clip();

		const avatar = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'jpg' }));
		context.drawImage(avatar, 20, 20, 160, 160);

		const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');

		interaction.followUp({ files: [attachment] })

	},
};
