const economy = require('../../economy')

const language = require('../../language')

module.exports = {
    commands: ['balance', 'bal'],
    maxArgs: 1,
    expectedArgs: "[Target user's @]",
    callback: async (message) => {
        const target = message.mentions.users.first() || message.author
        const targetId = target.id

        const { guild } = message

        const guildId = message.guild.id
        const userId = target.id

        const coins = await economy.getCoins(guildId, userId)

        message.reply(`${language(guild, 'THIS_USER_HAS')} ${coins} coins.`)
    },
}