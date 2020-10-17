const mongo = require('../../mongo')
const commandPrefixSchema = require('../../schemas/command-prefix-schema')
const commandBase = require('../command-base')

module.exports = {
    commands: 'setprefix',
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<prefix>',
    permissionError: 'You do not have permission to use this command.',
    permissions: 'ADMINISTRATOR',
    callback: async (message, arguments, text) => {
        await mongo().then(async mongoose => {
            try {
                const guildId = message.guild.id
                const prefix = arguments[0]

                await commandPrefixSchema.findOneAndUpdate({
                    _id: guildId
                }, {
                    _id: guildId,
                    prefix
                }, {
                    upsert: true
                })

                message.reply(`prefix set to: **${prefix}**`)

                commandBase.updateCache(guildId, prefix)
            } finally {

            }
        })
    }
}