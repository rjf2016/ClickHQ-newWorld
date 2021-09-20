const { MessageEmbed } = require('discord.js');
const UserModel = require('../../models/user');
const { color } = require('../../config.json');
const moment = require('moment');
const today = moment().format('YYYY-MM-DD');
const todayStr = today.toString();

module.exports = {
	name: 'profile',
	description: 'View or Edit your New World profile',
	options: [
		{
			name: 'view',
			description: 'View New World profile',
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'target',
					description: 'Display a users profile',
					type: 'USER',
					require: false,
				},
			],
		},
		{
			name: 'edit',
			description: 'Edit your profile',
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'name',
					description: 'Your New World account name',
					type: 'STRING',
				},
				{
					name: 'lvl',
					description: 'Your New World account level',
					type: 'NUMBER',
				},
				{
					name: 'role',
					description: 'Your role in New World',
					type: 'STRING',
					choices: [
						{ name: 'Healer', value: 'Healer' },
						{ name: 'Tank', value: 'Tank' },
						{ name: 'DPS', value: 'DPS' },
						{ name: 'LGBTQ', value: 'Rather not say' },
					],
				},
				{
					name: 'favoriteweapon',
					description: 'Your favorite weapon in New World',
					type: 'STRING',
				},
			],
		},
	],

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */

	run: async (client, interaction) => {
		const sub = interaction.options.getSubcommand(['view', 'edit']);
		const target = interaction.options.getMember('target');
		const name = interaction.options.getString('name');
		const lvl = interaction.options.getNumber('lvl');
		const role = interaction.options.getString('role');
		const favoriteWeapon = interaction.options.getString('favoriteweapon');
		const info = {
			'newWorldProfile.accountName': name,
			'newWorldProfile.accountLevel': lvl,
			'newWorldProfile.accountClass': role,
			'newWorldProfile.favoriteWeapon': favoriteWeapon,
			'newWorldProfile.lastUpdated': todayStr,
		};
		const cleanData = Object.fromEntries(Object.entries(info).filter(([, v]) => v != null));

		if (sub === 'view') {
			const id = !target ? interaction.user.id : target.id;
			UserModel.findOne({ userID: id }, async (err, data) => {
				if (err) {
					console.error('You tried to view the profile of someone who doesnt exist in DB')
					return interaction.followUp('That person doesnt have a profile yet!')
				};
				if (data) {
					const profile = data.newWorldProfile;
					return interaction.followUp({
						embeds: [
							new MessageEmbed()
								.setTitle(`${profile.accountName.toUpperCase()}`)
								.setColor(color.info)
								.addFields(
									{ name: 'Level:', value: `${profile.accountLevel}` },
									{ name: 'Role:', value: `${profile.accountClass}` },
									{	name: 'Favorite weapon:', value: `${profile.favoriteWeapon}`},
								)
								.setFooter(`Last updated: ${profile.lastUpdated}`),
						],
					});
				}
			});
		}
		if (sub === 'edit') {
			UserModel.updateOne({ userID: interaction.user.id }, { $set: cleanData }, function(err, res) {
				if (err) {
					console.error(err);
					return interaction.followUp({ content: 'There was an error trying to update your profile. @Huge Dad#7707 ' });
				} else {
					console.log('New World profile has been updated successfully!\nResults: ', res);
					return interaction.followUp({ content: 'Your profile has been updated!' });
				}
			});
		}
	},
};
