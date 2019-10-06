const Discord = require('discord.js');
const client = new Discord.Client();
const {token} = require('./config.json');
const Game = require('./classes/game.js');

// This array contains all users that the bot is waiting confirmation on, who is going to be their opponent
let awaiting_opponent_queue = [];

// This array contains all users who invited other users for a game of checkers, could be made into class
let awaiting_opponent_to_accept_queue = [];

let all_games = [];

let player_base = [];
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  var test = all_games;
  var playerbase = player_base;
  if (msg.author.id != client.user.id && msg.content.startsWith('!cb ')) {
    let command = msg.content.replace('!cb ', '');
    if (command == 'start') {
      refresh_awaiting_opponent_queue();
      add_user_to_awaiting_opponent_queue(msg);
      msg.reply('Ok! with who do you want to start the game with?');
    } else if (command.includes('with')) {
      let user_mentions = msg.mentions.users;
      // If the user was in the queue for awaiting an opponent...
      let user_awaiting = awaiting_opponent_queue.find(
          x => x.author.id === msg.author.id);
      user_awaiting = (user_awaiting != null) ? user_awaiting.author : null;
      let user_invited = user_mentions.first();
      if (user_awaiting == null) {
        msg.reply(
            'You have to start the game first!. Type "!cb start" then type "!cb with *ping user*');
      } else if (user_mentions.size != 1) {
        msg.reply(
            'You have either not mentioned an invited user or you have mentioned too many people!');
      } else if (user_invited.id == client.user.id) {
        msg.reply('I\'m honoured you want me to play but I can\'t :(');
      } else if (user_awaiting !== null) {
        remove_user_from_awaiting_opponent_queue(user_awaiting);
        if (user_invited.id == user_awaiting.id) {
          msg.reply(
              'If you want to play checkers with yourself, enter "!cb I want to play with myself"');
        } else {
          msg.channel.send(user_invited + ', ' + msg.author.username +
              ' has invited you to play checkers! Type !cb accept to play.');
          add_user_to_awaiting_opponent_to_accept_queue(msg, user_invited);
        }
      }
    } else if (command.includes('I want to play with myself')) {
      remove_user_from_awaiting_opponent_queue(msg.author);
      let game = initiate_new_game(msg.author, msg.author);
      msg.reply('Ok! A game starting, please wait...');
      msg.reply(game.print_game());
    } else if (command == 'accept') {
      let invited_queue = check_invites(msg.author);
      // If the user has only one person that invited them...
      if (invited_queue.length === 1) {
        msg.reply(
            `Ok! You have started a game with ${invited_queue[0].invitee_message.author}, please wait...`);
        let game = initiate_new_game(invited_queue[0].invitee_message.author,
            msg.author);
        msg.channel.send(game.print_game());
      }
    } else if (command == 'move') {
      // get the user's primary game and execute their command
      all_games.filter(x => (x.white_piece_user.id === msg.author.id) ||
          (x.black_piece_user_piece_user.id === msg.author.id));
    }
  }
  if (msg.content === 'ping') {
    msg.channel.send(game.print_game());
  }
});

client.login(token);

// Check if the author of this message was invited for a game of checkers
function check_invites(invited) {
  return awaiting_opponent_to_accept_queue.filter(
      x => x.invited.id === invited.id);
}

// Awaiting opponent functions

// Remove all users that wanted to start a game but didn't specify with who
function refresh_awaiting_opponent_queue() {
  for (let i = 0; i < awaiting_opponent_queue.length; i++) {
    let date_message_sent = new Date(
        awaiting_opponent_queue[i].createdTimestamp);
    // get the date 30 mins before, compare it to how long the bot is awaiting
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
  let index = awaiting_opponent_queue.findIndex(
      x => x.author.id === user_awaiting.id);
  awaiting_opponent_queue.splice(index, 1);
}

// Awaiting opponent queue functions
function add_user_to_awaiting_opponent_to_accept_queue(invitee, invited) {
  awaiting_opponent_to_accept_queue.push(
      {'invitee_message': invitee, 'invited': invited});
}

function remove_user_to_awaiting_opponent_to_accept_queue(invitee, invited) {
  awaiting_opponent_to_accept_queue.push(
      {'invitee': invitee, 'invited': invited});
}

function initiate_new_game(person_a, person_b) {
  let game = new Game(person_a, person_b);
  add_game_to_all_games(game);
  update_player_base(person_a, game);
  update_player_base(person_b, game);
  return game;
}

function add_game_to_all_games(game) {
  all_games.push(game);
}

function update_player_base(person, game) {
  var player_index = player_base.indexOf(person);
  if(player_index !== -1) {
    player_base[player_index].games.push(game);
    player_base[player_index].primary_game_index = player_base[player_index].games.indexOf(game);
  } else {
    person.games = [game];
    person.primary_game_index = 0;
    player_base.push(person);
  }
}