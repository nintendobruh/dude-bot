module.exports = {
    commands: 'invite',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments, text) => {
        message.channel.send(`**If you would like to invite dude bot to your server, use this link:**\n
https://discord.com/oauth2/authorize?client_id=755769003804328076&permissions=2146565879&scope=bot`)
    },
}