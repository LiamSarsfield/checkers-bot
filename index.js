const Discord = require('discord.js');
const client = new Discord.Client();
const {token} = require('./config.json');
const Game = require('./classes/game.js');

var game = new Game();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if(msg.isMemberMentioned(msg.author)) {

    }
    if (msg.content === 'ping') {
        msg.channel.send(game.print_game());
    }
});

client.login(token);