const Discord = require('discord.js');
const client = new Discord.Client();
const {token} = require('./config.json');
const Game = require('./classes/game.js');

let game = new Game();

// This array contains all users that the bot is waiting confirmation on, on who is going to be their opponent
var awaiting_opponent_queue = [];

var awaiting_opponent_to_accept_queue = ['hey'];

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.author.id != client.user.id && msg.content.startsWith('!cb ')) {
        let command = msg.content.replace('!cb ', '');
        if (command == 'start') {
            refresh_awaiting_opponent_queue();
            add_user_to_awaiting_opponent_queue(msg);
            msg.reply('Ok! with who do you want to start the game with?');
            awaiting_opponent_queue.push(msg);
        } else if (command == 'accept') {
            let invited_queue = check_invites(msg.author);
            if (invited_queue.length === 1) {
                msg.reply(`Ok! You have started a game with ${invited_queue.invitee}`);
            }
        } else if (command.includes('I want to play with myself')) {
            remove_user_from_awaiting_opponent_queue(msg.author);
            initiate_new_game(msg.author, msg.author);
            msg.reply('Ok! A game starting, please wait...');
        } else if (command.includes('with')) {
            let user_mentions = msg.mentions.users;
            // If the user was in the queue for awaiting an opponent...
            let user_awaiting = awaiting_opponent_queue.find(x => x.author.id === msg.author.id);
            user_awaiting = (user_awaiting != null) ? user_awaiting.author : null;
            let user_invited = user_mentions.first();
            if (user_awaiting == null) {
                msg.reply('You have to start the game first!. Type "!cb start" then type "!cb with *ping user*');
            } else if (user_mentions.size != 1) {
                msg.reply('You have either not mentioned an invited user or you have mentioned too many people!');
            } else if (user_invited.id == client.user.id) {
                msg.reply("I'm honoured you want me to play but I can't :(");
            } else if (user_awaiting !== null) {
                remove_user_from_awaiting_opponent_queue(user_awaiting);
                if (user_invited.id == user_awaiting.id) {
                    msg.reply('If you want to play checkers with yourself, enter "!cb I want to play with myself"');
                } else {
                    msg.channel.send(user_invited + ' ' + msg.author.username + ' has invited you to play checkers! Type !cb accept to play.');
                    add_user_to_awaiting_opponent_to_accept_queue(msg.author, user_invited);
                }
            }
        }
    }
    if (msg.content === 'ping') {
        msg.channel.send(game.print_game());
    }
});

client.login(token);

function refresh_awaiting_opponent_queue() {
    for (let i = 0; i < awaiting_opponent_queue.length; i++) {
        let date_message_sent = new Date(awaiting_opponent_queue[i].createdTimestamp);
        // get the date 30 mins before, compare it do how long the bot is awaiting
        let expiry_date = new Date();
        expiry_date.setMinutes(expiry_date.getMinutes() - 30);
        if (date_message_sent < expiry_date) {
            awaiting_opponent_queue[i].splice(i, 1);
        } else {
            break;
        }
    }
}

function add_user_to_awaiting_opponent_queue(user_awaiting) {
    awaiting_opponent_queue.push(user_awaiting);
}

function remove_user_from_awaiting_opponent_queue(user_awaiting) {
    let index = awaiting_opponent_queue.indexOf(user_awaiting);
    awaiting_opponent_queue.splice(index, 1);
}

function add_user_to_awaiting_opponent_to_accept_queue(invitee, invited) {
    awaiting_opponent_to_accept_queue.push({"invitee": invitee, "invited": invited});
}


function check_invites(invited) {
    return awaiting_opponent_queue.filter(x => x.invitee.id === invited.id);
}

function initiate_new_game(person_a, person_b) {

}