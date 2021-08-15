const { VoiceChannel, TeamMember } = require("discord.js");

module.exports = {
    name: 'Group',
    description: 'Create a group',
    aliases: ['group'],
    execute(message)  {

        const createVoiceChannel = message.guild.channels.create(`${message.author.username}'s group`)


        const author = message.author

        // const User = await client.users.fetch(id);
        // const member = await guild.members.fetch(User);

        const allRoles = message.guild.roles.cache.find(role => role.name === '@everyone')
        let voiceChannelIDArr = [];

        // Reply to command - acknowledge that user started group
        const reply = message.reply(`${message.author.username} has started a group. React to this message with a wave (:wave:) to join the group`)
        const channel = message.guild.channels.create(`${message.author.username}'s group`, {
                            type: 'voice',
                            permissionOverwrites: [
                                {
                                    id: allRoles.id,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: message.author.id,
                                    allow: ['VIEW_CHANNEL'],
                                },
                            ]
                        })



        // const member = message.guild.members.cache.find(member => member.id === author.id)

        //             member.voice.setChannel(channel.id)
        //             voiceChannelIDArr.push(channel.id)

                    console.log(channel)
    }

}

        // const filter = (reaction) => {
        //     return reaction.emoji.name === '👋';
        // };

        // console.log(`MSG: ${msg}`)
        // const collector = msg.createReactionCollector(filter, { time: 600000 });

        // collector.on('collect', (reaction, user) => {
        //     const reactor = msg.guild.members.cache.find(member => member.id === user.id)
        //     let voiceChannelID = voiceChannelID[0]
        //     let voiceChannel = msg.guild.channels.cache.get(voiceChannelID)
        //     voiceChannel.updateOverwrite(reactor, { VIEW_CHANNEL: true })
        //     reactor.voice.setChannel(voiceChannelID)

        //     console.log(`message: ${msg}`)
        // });

        // collector.on('end', collected => {
        //     console.log(`Collected ${collected.size} items`);
        // });
