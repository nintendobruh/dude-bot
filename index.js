const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('./config.json')
const firstMessage = require('./first-message')
const roleClaim = require('./role-claim')
const command = require('./command')

client.on('ready', () => {
    console.log('dude bot is online!')

    roleClaim(client)

    command(client, 'ping', message => {
        message.channel.send('Pong!')
    })

    command(client, 'servers', message => {
        client.guilds.cache.forEach(guild => {
            message.channel.send(`**${guild.name}** has a total of **${guild.memberCount} members.**`)
        })
    })

    command(client, ['cc', 'clearchannel'], message => {
        const { member } = message
        const tag = `<@${member.id}>`

        if (message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.messages.fetch().then(results => {
                message.channel.bulkDelete(results)
            })
        } else {
            message.channel.send(`${tag}, you don't have permission to use this command!`)
        }
    })

    command(client, 'ban', message => {
        const { member, mentions } = message

        const tag = `<@${member.id}>`

        if (member.hasPermission('ADMINISTRATOR') || member.hasPermission('BAN_MEMBERS')) {
            const target = mentions.users.first()

            if (target) {
                const targetMember = message.guild.members.cache.get(target.id)
                if (targetMember.bannable) {
                targetMember.ban()
                message.channel.send(`${tag}, ${targetMember} has been banned successfully.`)
             } else {
                 if (!targetMember.bannable) {
                 message.channel.send(`${tag}, I can't ban this user!`)
             }}} else {
                message.channel.send(`${tag}, please mention a user you wish to ban!`)
            }
        } else {  
            message.channel.send(
                `${tag}, you do not have permission to use this command!`
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
        .addFields({
            name: `Prefix: ${prefix}`,
            value: '- can be changed.'
        }, {
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