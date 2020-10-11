const { minArgs } = require("./add");

const mongo = require('../mongo')
const languageSchema = require('../schemas/language-schema')
const { languages } = require('../lang.json')
const { setLanguage } = require('../language')

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