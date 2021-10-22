const { MessageEmbed } = require('discord.js');
const UserModel = require('../../models/user');
const { color } = require('../../config.json');
const moment = require('moment');
const { guilds } = require('../..');
const today = moment().format('YYYY-MM-DD');
const todayStr = today.toString();
const formatDate = require('../../helpers/formatDate.js');


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
					name: 'company',
					description: 'Your company',
					type: 'STRING',
					choices: [
						{ name: 'Click HQ', value: '🥇 Click HQ 🥇' },
						{ name: 'Prime Apes', value: 'Prime Apes 🦍' },
						{ name: 'Respect Women', value: 'Respect Women 💃' },
						{ name: 'Lag Detected', value: 'Fag Detected 💩' },
						{ name: 'Bussy Bandits', value: 'Bussy Bandits 🐱‍👤' },
						{ name: 'Sentinels of Light', value: 'Sentinels of Light 💡' },
						{ name: 'Unified Effort', value: 'Unified Effort ✊' },
						{ name: 'Order of the Coin', value: 'Order of the Coin 💰' },
						{ name: 'Negative Karma', value: 'Negative Karma ➖' },
						{ name: 'Bison Supply Co.', value: 'Bison Supply Co. 🐂'},
						{ name: 'PKHood', value: 'PKHood 📹' },
						{ name: 'Evans Guild', value: 'Evans Guild 👱‍♂️' },
						{ name: 'Bessie Milk', value: 'Bessie Milk 🥛' },
						{ name: 'Other', value: 'Other' },
					]
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
					choices: [
						{ name: 'Sword', value: 'Sword' },
						{ name: 'Rapier', value: 'Rapier' },
						{ name: 'Hatchet', value: 'Hatchet' },
						{ name: 'Spear', value: 'Spear' },
						{ name: 'Great Axe', value: 'Great Axe' },
						{ name: 'War Hammer', value: 'War Hammer' },
						{ name: 'Bow', value: 'Bow' },
						{ name: 'Musket', value: 'Musket' },
						{ name: 'Fire Staff', value: 'Fire Staff' },
						{ name: 'Life Staff', value: 'Life Staff' },
						{ name: 'Ice Gauntlet', value: 'Ice Gauntlet' },
					]
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
		const target = interaction.options.getMember('target') || await interaction.guild.members.fetch(interaction.user)
		const name = interaction.options.getString('name');
		const company = interaction.options.getString('company')
		const lvl = interaction.options.getNumber('lvl');
		const role = interaction.options.getString('role');
		const favoriteWeapon = interaction.options.getString('favoriteweapon');
		const info = {
			'newWorldProfile.accountName': name,
			'newWorldProfile.company': company,
			'newWorldProfile.accountLevel': lvl,
			'newWorldProfile.accountClass': role,
			'newWorldProfile.favoriteWeapon': favoriteWeapon,
			'newWorldProfile.lastUpdated': todayStr,
		};
		const cleanData = Object.fromEntries(Object.entries(info).filter(([, v]) => v != null));

		if (sub === 'view') {
			const id  = target.user.id;
			console.log('TARGET: ', target)
			console.log('ID: ', id)
			try {
				UserModel.findOne({ userID: id }, async (err, data) => {
					if (err) {
						console.error('You tried to view the profile of someone who doesnt exist in DB')
						return interaction.followUp('That person doesnt have a profile yet!')
					};
					if (data) {
						const profile = data.newWorldProfile;
						const relative = moment(profile.lastUpdated, 'YYYY-MM-DD').fromNow();
						console.log(relative)
						const profileEmbed = new MessageEmbed()
							.setAuthor(target.user.tag, target.user.displayAvatarURL())
							.setTitle(`\t**${profile.accountName.toUpperCase()}**`)
							.setDescription(`${profile.company}`)
							.setColor(color.info)
							.addFields(
								{ name: 'Level:', value: `${profile.accountLevel}` },
								{ name: 'Role:', value: `${profile.accountClass}` },
								{	name: 'Favorite weapon:', value: `${profile.favoriteWeapon}` },
							)
							.setFooter(`last updated: ${formatDate(profile.lastUpdated)}`);

						return interaction.followUp({ embeds: [profileEmbed] });
					}
				});
			} catch (error) {
				interaction.followUp("😥 I didn't find that user in my database. Tell him to type something (anything) in the discord channel and I'll create an entry for him.")
			}

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
