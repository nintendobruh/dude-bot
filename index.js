const path = require('path')
const fs = require('fs')
const Discord = require('discord.js')
const client = new Discord.Client()
const language = require('./language')
client.defaultMaxListeners = 25

const config = require('./config.json')
const { loadLanguages } = require('./language')
const mongo = require('./mongo')
const firstMessage = require('./first-message')
const roleClaim = require('./role-claim')
const welcome = require('./welcome')
const command = require('./command')
const { prependListener } = require('./schemas/welcome-schema')
const messageCount = require('./message-counter')

client.on('ready', async () => {
    console.log('dude bot is online!')

    const baseFile = 'command-base.js'
    const commandBase = require(`./commands/${baseFile}`)

    const readCommands = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if (stat.isDirectory()) {
                readCommands(path.join(dir, file))
            } else if (file !== baseFile) {
                const option = require(path.join(__dirname, dir, file))
                commandBase(client, option)
            }
        }
    }

    readCommands('commands')

    await mongo().then((mongoose) => {
        try {
            
        } finally {
            mongoose.connection.close()
        }
    })

    welcome(client)
    roleClaim(client)
    messageCount(client)
    loadLanguages(client)
    

    command(client, 'servers', message => {
        client.guilds.cache.forEach(guild => {
            message.channel.send(`**${guild.name}** has a total of **${guild.memberCount} members.**`)
        })
    })

    command(client, ['cc', 'clearchannel'], message => {
        const { member, guild } = message
        const tag = `<@${member.id}>`

        if (message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.messages.fetch().then(results => {
                message.channel.bulkDelete(results)
            })
        } else {
            message.channel.send(`${tag}, ${language(guild, 'YOU_DO_NOT_HAVE_PERMISSION_TO_USE_COMMAND')}!`)
        }
    })

    command(client, 'ban', message => {
        const { member, mentions, guild } = message

        const tag = `<@${member.id}>`

        if (member.hasPermission('ADMINISTRATOR') || member.hasPermission('BAN_MEMBERS')) {
            const target = mentions.users.first()

            if (target) {
                const targetMember = message.guild.members.cache.get(target.id)
                if (targetMember.bannable) {
                targetMember.ban()
                message.channel.send(`${tag}, ${targetMember} ${language(guild, 'HAS_BEEN_BANNED_SUCCESSFULLY')}.`)
             } else {
                 if (!targetMember.bannable) {
                 message.channel.send(`${tag}, ${language(guild, 'I_CANT_BAN_THIS_USER')}!`)
             }}} else {
                message.channel.send(`${tag}, ${language(guild, 'MENTION_USER_TO_BAN')}!`)
            }
        } else {  
            message.channel.send(
                `${tag}, ${language(guild, 'YOU_DO_NOT_HAVE_PERMISSION_TO_USE_COMMAND')}!`
            )
        }
    })

    command(client, 'kick', message => {
        const { member, mentions } = message

        const tag = `<@${member.id}>`

        if (member.hasPermission('ADMINISTRATOR') || member.hasPermission('KICK_MEMBERS')) {
            const target = mentions.users.first()

            if (target) {
                const targetMember = message.guild.members.cache.get(target.id)
                if (targetMember.kickable) {
                targetMember.kick()
                message.channel.send(`${tag}, ${targetMember} has been kicked successfully.`)
             } else {
                 if (!targetMember.kickable) {
                 message.channel.send(`${tag}, I can't kick this user!`)
             }}} else {
                message.channel.send(`${tag}, please mention a user you wish to kick!`)
             }
        } else {  
            message.channel.send(
                `${tag}, you do not have permission to use this command!`
            )
        }
    })

    command(client, 'serverinfo', (message) => {
        const { guild } = message

        const { name, region, memberCount, owner, afkTimeout, createdAt, rulesChannel } = guild
        const icon = guild.iconURL()

        const embed = new Discord.MessageEmbed()
            .setColor(3447003)
            .setTitle(`Server info for **${name}**`)
            .setThumbnail(icon)
            .addFields({
                name: 'Created on',
                value: createdAt
            }, {
                name: 'Region',
                value: region
            }, {
                name: 'Owner',
                value: owner
            }, {
                name: 'Rules Channel',
                value: rulesChannel
            }, {
                name: 'Member Count',
                value: memberCount
            }, {
                name: 'AFK Timeout',
                value: afkTimeout
            })

        message.channel.send(embed)
    })

    command(client, 'help', message => {
        const prefix = (config.prefix)
        const helpembed = new Discord.MessageEmbed()
        .setColor(3447003)
        .setTitle(`dude bot commands`)
        .setDescription(`Prefix: ${prefix}`)
        .addFields({
            name: 'General Commands:',
            value: `
            ping
            `
        }, {
            name: 'Help Commands:',
            value: `
            help, serverinfo
            `
        }, {
            name: 'Administrative Commands:',
            value: `
            ban, cc/clearchannel, kick
            `
        })

        message.channel.send(helpembed)
    })
})

client.login(config.token)