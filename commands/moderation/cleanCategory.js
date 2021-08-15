const { MessageEmbed } = require('discord.js');
const config = require('../../config.json')

module.exports = {
	name: 'clean',
	description: 'Delete channels within category',
  aliases: ['wipe'],
  cooldown: 5,
  guildOnly: true,
	execute(message, args) {

    const path = args.join(" ").split(" / ")
    const [ pathChannel, pathCategory ] = [ path[0], path[1] ]

    if (!pathChannel || !pathCategory) {
      message.react('❓')
      message.channel.send(errorEmbedMessage)
      return
    }

    const msgEmbed = new MessageEmbed()

    const countChannels = (channel, cat) => channel === "*" ? cat.children : cat.children.filter(c => c.name.toUpperCase() === channel.toUpperCase())

    const foundCategory = message.guild.channels.cache.find(c => (c.name.toUpperCase() === pathCategory.toUpperCase()) && c.type === 'category')

    const errorEmbedMessage = new MessageEmbed()
      .setTitle('What did you want me to clean?')
      .setDescription("You are either missing an argument, or you gave one that doesn't exist")
      .addFields({name: "\u200b", value: "\u200b"}, {name: "!clean  <CHANNEL or *> / <PARENT CATEGORY>", value: "\u200b"})
      .setFooter("If youre still confused, dont run the command - you might delete the server")
      .setColor(config.color.err)

    // If user doesnt have admin perm => return noPermMessage
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      message.react('❌')
      message.channel.send(msgEmbed.setTitle('This command is only for admins \:eyes:').setColor(config.color.err))
      return
    }

    const occurances = countChannels(pathChannel, foundCategory)

    // If category doesnt exist in server OR the entered channel doesn't exist within the given category => return errorMessage
    if (!foundCategory || occurances.size < 1) {
        message.react('❓')
        message.channel.send(errorEmbedMessage)
        return;
    } else {
        message.channel.send(msgEmbed
          .setTitle(`This would delete ${occurances.size} channel(s) from ${pathCategory}`)
          .setDescription('React with one of the following to proceed')
          .addFields( {name: '✅ Continue   ', value: '\u200b', inline: true}, { name: "   ❌ Marty I'm scared", value: '\u200b', inline: true} )
          .setFooter("If you don't answer in 10 seconds the command will be cancelled")
          .setColor(config.color.info)
        )
        .then(confirmationMessage => {
          const decisionFilter = (reaction, user) => {
            return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id
          };
          confirmationMessage.react('✅')
            .then(() => confirmationMessage.react('❌'))
            .then(() => {
              confirmationMessage.awaitReactions(decisionFilter, { max: 1, time: 15000}).then(collected => {

                const decisionReaction = collected.first();

                if (decisionReaction.emoji.name === '✅') {
                  occurances.forEach(c => c.delete())
                  return message.channel.send('🧹  Clean Complete   🧹')
                } else if (decisionReaction.emoji.name === '❌') {
                  return message.channel.send('👋  Seeya  👋')
                }
              })
              .catch(collected => {
                message.reply('👋  Command cancelled. Take more time to think about it.  👋')
              })
            })
        })
    }
  }
};