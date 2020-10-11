const mongo = require('./mongo')
const profileSchema = require('./schemas/profile-schema')

const coinsCache = {}

module.exports = (client) => {}

module.exports.addCoins = async (guildId, userId, coins) => {
    const cachedValue = coinsCache[`${guildId}-${userId}`]
    if (cachedValue) {

    }

    return await mongo().then(async (mongoose) => {
        try {
            const result = await profileSchema.findOneAndUpdate({
                guildId,
                userId
            }, {
                guildId,
                userId,
                $inc: {
                    coins
                }
            }, {
                upsert: true,
                new: true
            })

            coinsCache[`${guildId}-${userId}`] = result.coins


            return result.coins
        } finally {

        }
    })
}



module.exports.getCoins = async (guildId, userId) => {
    return await mongo().then(async mongoose => {
        try {
            const result = await profileSchema.findOne({
                guildId,
                userId
            })

            let coins = 0
            if (result) {
                coins = result.coins
            } else {
                await new profileSchema({
                    guildId,
                    userId,
                    coins
                }).save()
            }

            coinsCache[`${guildId}-${userId}`] = coins

            return coins
        } finally {

        }
    })
}