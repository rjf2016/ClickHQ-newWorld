module.exports = {
    name: 'Group',
    description: 'Create a group',
    aliases: ['group'],
    execute(message){
        let user = message.author
            message.reply(`${user.username} has started a group. React to this message with a wave (:wave:) to join the group`)
                .then(message => {
                    const filter = (reaction) => {
                        return reaction.emoji.name === '👋';
                    };

                    const collector = message.createReactionCollector(filter, { time: 600000 });

                    collector.on('collect', (reaction, user) => {
                        console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
                    });

                    collector.on('end', collected => {
                        console.log(`Collected ${collected.size} items`);
                    });


                });
        //let member = message.member
        let allrole = message.guild.roles.cache.find(r => r.name === '@everyone')
        let groupStarter = message.author.id
        console.log(`${user.username} has started a group`)
        message.guild.channels.create(`Group ${user.username}`, {
            type: 'voice',
            permissionOverwrites: [
                {
                    id: allrole.id,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: message.author.id,
                    allow: ['VIEW_CHANNEL'],
                },
            ],
        });
    }
}
