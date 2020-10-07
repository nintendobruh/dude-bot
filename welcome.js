module.exports = client => {
    const channelId = '762414876726525953'
    const rulesId = '762412313415385138' 

    client.on('guildMemberAdd', member => {
        const message = `Welcome, <@${
            member.id
        }>! Please read ${member.guild.channels.cache
            .get(rulesId)
            .toString()}, and proceed at your own risk.`

        const channel = member.guild.channels.cache.get(channelId)
        channel.send(message)
    })
}