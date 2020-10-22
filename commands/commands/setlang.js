const { minArgs } = require("@commands/misc/add");

const mongo = require('@utilities/mongo')
const languageSchema = require('@schemas/language-schema')
const { languages } = require('@root/lang.json')
const { setLanguage } = require('@utilities/language')

module.exports = {
    commands: ['setlang', 'setlanguage'],
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<language>',
    permissions: 'ADMINISTRATOR',
    callback: async (message, arguments) => {
        const { guild } = message

        const targetLanguage = arguments[0].toLowerCase()
        if (!languages.includes(targetLanguage)) {
            message.reply('that is an unsupported language!')
            return
        }

        setLanguage(guild, targetLanguage)

        await mongo().then(async (mongoose) => {
            try {
                await languageSchema.findOneAndUpdate({
                    _id: guild.id
                }, {
                    _id: guild.id,
                    language: targetLanguage
                }, {
                    upsert: true
                })

                message.reply('language set!').then((message) => {
                    const seconds = 3
                    message.delete({
                        timeout: 1000 * seconds
                    })
                })
            } finally {

            }
        })
    }
}