module.exports = (client) => {
    const inviteFromServer = async (guild, code) => {
        return await new Promise(resolve => {
            guild.fetchInvites().then((invites) => {
                for (const invite of invites) {
                    if (code === invite[0]) {
                        resolve(true)
                        return
                    }
                }

                resolve(false)
            })
        })
    }

    client.on('message', async (message) => {
        const { guild, member, content } = message

        const code = content.split('discord.gg/')[1]

        if (content.includes('discord.gg/')) {
            const isServerInvite = await inviteFromServer(guild, code)
            if (!isServerInvite) {
              message.delete()                
            }
        }
    })
}