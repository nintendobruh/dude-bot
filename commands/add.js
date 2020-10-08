module.exports = {
    commands: 'add',
    expectedArgs: '<num1> <num2>',
    permissionError: 'You do not have permission to run this command.',
    minArgs: 2,
    maxArgs: 2,
    callback: (message, arguments, text) => {
        const num1 = +arguments[0]
        const num2 = +arguments[1]

        message.reply(`That is ${num1 + num2}`)
    },
    permissions: [],
    requiredRoles: [],
}