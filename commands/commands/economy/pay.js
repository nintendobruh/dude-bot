const economy = require('@features/economy')

const language = require('@utilities/language')

module.exports = {
    commands: 'pay',
    minargs: 2,
    maxargs: 2,
    expectedArgs: "<Target user's @> <Amount of coins>",
    callback: async (message, arguments, text) => {
        const { guild, member } = message

        const target = message.mentions.users.first()
        if (!target) {
            message.reply(`${language(guild, 'MENTION_USER_TO_GIVE_COINS')}!`)
            return
        }

        const givenCoins = arguments[1]
        if (isNaN(givenCoins)) {
            message.reply(`${language(guild, 'PROVIDE_VALID_COIN_AMOUNT')}!`)
            return
        }

        const hasCoins = await economy.getCoins(guild.id, member.id)
        if (hasCoins < givenCoins) {
            message.reply(`${language(guild, 'YOU_DO_NOT_HAVE')} ${givenCoins} coins!`)
            return
        }

        const remainingCoins = await economy.addCoins(
            guild.id,
            member.id,
            givenCoins * -1
        )
        const newBalance = await economy.addCoins(
            guild.id,
            target.id,
            givenCoins
        )

        message.reply(`${language(guild, 'YOU_HAVE_GIVEN')} <@${target.id}> ${givenCoins} coins. ${language(guild, 'THEY_NOW_HAVE')} ${newBalance}! ${language(guild, 'YOU_NOW_HAVE')} ${remainingCoins} coins.`)
    }
}