const economy = require('@features/economy')
const language = require('@utilities/language')

module.exports = {
    commands: ['givebalance', 'givebal'],
    minArgs: 2,
    maxArgs: 2,
    expectedArgs: "<The target's @> <coin amount>",
    permissionError: 'you must be an administrator to use this command!',
    permissions: 'ADMINISTRATOR',
    callback: async (message, arguments) => {
        const mention = message.mentions.users.first()
        const { guild } = message

        if (!mention) {
            message.reply(`${language(guild, 'MENTION_USER_TO_ADD_COINS')}!`)
            return
        }

        const coins = arguments[1]
        if (isNaN(coins)) {
            message.reply(`${language(guild, 'PROVIDE_VALID_COIN_AMOUNT')}!`)
            return
        }

        const guildId = message.guild.id
        const userId = mention.id

        const newCoins = await economy.addCoins(guildId, userId, coins)

        message.reply(`${language(guild, 'YOU_HAVE_GIVEN')} <@${userId}> ${coins} coins(s). ${language(guild, 'THEY_NOW_HAVE')} ${newCoins} coin(s)!`)
    }
}