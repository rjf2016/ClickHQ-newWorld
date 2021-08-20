// const Discord = require('discord.js');
// const { prefix, token, MONGODBSRV } = require('./config.json');
// // Hard Coding the rules message for now - come back to this hack
// const rulesMessage = '873699101508788235'
// const mongoose = require('mongoose')

// const Intss = new Discord.Intents(Discord.Intents.ALL)

// const client = new Discord.Client({ partials: ['MESSAGES', 'CHANNEL', 'REACTION'], ws: { intents: Intss } })
// client.commands = new Discord.Collection();
// client.events = new Discord.Collection();
// client.cooldowns = new Discord.Collection();

// const commandFolders = fs.readdirSync('./commands');

// for (const folder of commandFolders) {
// 	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
// 	for (const file of commandFiles) {
// 		const command = require(`./commands/${folder}/${file}`);
// 		client.commands.set(command.name, command);
// 	}
// }

// // Connect to MongoDB
// mongoose.connect(MONGODBSRV, {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// 	useFindAndModify: false
// }).then(() => {
// 	console.log('Connected to DB !')
// }).catch((err) => {
// 	console.error(err)
// })

// client.once('ready', () => {
// 	console.log('Ready!');
// });

// client.on('ready', () => {
// 	// Cache the rules message
// 	client.channels.cache.get('873332579309326426').messages.fetch(rulesMessage)
// })

// client.on('message', message => {
// 	if (!message.content.startsWith(prefix) || message.author.bot) return;

// 	const args = message.content.slice(prefix.length).trim().split(/ +/);
// 	const commandName = args.shift().toLowerCase();

// 	const command = client.commands.get(commandName)
// 		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

// 	if (!command) return;

// 	if (command.guildOnly && message.channel.type === 'dm') {
// 		return message.reply('I can\'t execute that command inside DMs!');
// 	}

// 	if (command.permissions) {
// 		const authorPerms = message.channel.permissionsFor(message.author);
// 		if (!authorPerms || !authorPerms.has(command.permissions)) {
// 			return message.reply('You can not do this!');
// 		}
// 	}

// 	if (command.args && !args.length) {
// 		let reply = `You didn't provide any arguments, ${message.author}!`;

// 		if (command.usage) {
// 			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
// 		}

// 		return message.channel.send(reply);
// 	}

// 	const { cooldowns } = client;

// 	if (!cooldowns.has(command.name)) {
// 		cooldowns.set(command.name, new Discord.Collection());
// 	}

// 	const now = Date.now();
// 	const timestamps = cooldowns.get(command.name);
// 	const cooldownAmount = (command.cooldown || 3) * 1000;

// 	if (timestamps.has(message.author.id)) {
// 		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

// 		if (now < expirationTime) {
// 			const timeLeft = (expirationTime - now) / 1000;
// 			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
// 		}
// 	}

// 	timestamps.set(message.author.id, now);
// 	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

// 	try {
// 		command.execute(message, args);
// 	} catch (error) {
// 		console.error(error);
// 		message.reply('there was an error trying to execute that command!');
// 	}
// });

// // client.on('messageReactionAdd', (reaction, user) => {
// // 	const message = reaction.message, emoji = reaction.emoji;
// // 	if (emoji.name == '✅') {
// // 		console.log(`${user.username} has accepted`);
// // 		const role = reaction.message.guild.roles.cache.find(r => r.id === '871585575986147339')
// // 		const { guild } = reaction.message
// // 		const member = guild.members.cache.find(member => member.id === user.id)
// // 		member.roles.add(role)
// // 	} else if (emoji.name == '❎') {
// // 		console.log(`Declined D:`)
// // 	}

// // })



// client.login(token);