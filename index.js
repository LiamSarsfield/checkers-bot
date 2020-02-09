const Discord = require('discord.js');
const client = new Discord.Client();
const {token} = require('./config.json');
const Game = require('./classes/game.js');
const Piece = require('./classes/piece.js');

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
  if (msg.author.id != client.user.id && msg.content.startsWith('!cb ')) {
    let command = msg.content.replace('!cb ', '');
    if (command.startsWith('start')) {
      if (command.startsWith('start game with myself')) {
        msg.reply(`Ok! A game starting, please wait...`);
        let game = initiate_new_game(msg.author, msg.author, command.includes('debug'));
        game.print_game().forEach(function(item, index) {
          msg.channel.send(item);
        });
      } else if (command.startsWith('start game with')) {
        awaiting_opponent_queue_initiator(msg, true);
      } else {
        refresh_awaiting_opponent_queue();
        add_user_to_awaiting_opponent_queue(msg);
        msg.reply('Ok! with who do you want to start the game with?');
      }
    } else if (command.startsWith('debug')) {
      let player_games = find_player_games(msg.author);
      let coordinates = command.match(/[a-z]{1}[1-9]{1}(\s|$)/gi);
      if (typeof player_games.primary_game_index === 'undefined') {
        msg.reply(`You don't have any games!`);
      } else if (!player_games.games[player_games.primary_game_index].debugging_game) {
        msg.reply('You cannot debug a game that is not fit for that purpose');
      } else if (coordinates === null || coordinates.length !== 1) {
        msg.reply('Please enter a valid coordinate.');
      } else {
        let primary_game = player_games.games[player_games.primary_game_index];
        let coordinate = coordinates[0].split('');
        let square = primary_game.get_square(coordinate[0], coordinate[1]);
        primary_game.debug_square(command, square);
        primary_game.print_game().forEach(function(item, index) {
          msg.channel.send(item);
        });
      }
    } else if (command.startsWith('with')) {
      awaiting_opponent_queue_initiator(msg);
    } else if (command == 'accept') {
      let invited_queue = check_invites(msg.author);
      // If the user has only one person that invited them...
      if (invited_queue.length === 1) {
        msg.reply(`Ok! You have started a game with ${invited_queue[0].invitee_message.author}, please wait...`);
        let game = initiate_new_game(invited_queue[0].invitee_message.author, msg.author);
        game.print_game().forEach(function(item, index) {
          msg.channel.send(item);
        });
      }
    } else if (command.startsWith('move')) {
      let player_details = find_player_games(msg.author);
      // first check if you have a primary game. You can currently only move your primary game
      if (typeof player_details.primary_game_index === 'undefined') {
        let primary_game_undefined_message = (player_details.game.length > 0)
            ? `Your primary game is not defined. Type !cb my games` : `You don't have any games!`;
        msg.reply(primary_game_undefined_message);
      } else {
        let primary_game = player_details.games[player_details.primary_game_index];
        move_piece(command, msg, primary_game);
        if (primary_game.completed) {
          // If the game is completed, remove the player's game and their opponents game from the list
          archive_primary_game(player_details);
          if (primary_game.inactive_team_user.id !== primary_game.active_team_user.id) {
            let opponent_details = find_player_games(primary_game.inactive_team_user);
            archive_primary_game(opponent_details);
          }
        }
      }
    } else if (command == 'my games') {
      let player_games = find_player_games(msg.author);
      if (player_games.games.length === 0) {
        msg.reply('You have no games :(');
      } else {
        msg.reply('You have games with the following people:');
        let game_printer = '';
        for (i = 0; i < player_games.games.length; i++) {
          let primary_game = (player_games.primary_game_index == i) ? '(Your primary game)' : '';
          let other_player = player_games.games[i].inactive_team_user;
          game_printer += `Game ${i + 1} with ${other_player} ${primary_game} \n`;
        }
        game_printer += `Type !cb switch game and the game number to switch your game`;
        msg.channel.send(game_printer);
      }
    } else if (command.includes('print primary game')) {
      let player_info = find_player_games(msg.author);
      if(isNaN(player_info.primary_game_index)) {
        msg.reply('You have no games :(');
      } else {
        let game = player_info.games[player_info.primary_game_index];
        game.print_game().forEach(function(item, index) {
          msg.channel.send(item);
        });
      }
    } else if (command.includes('switch game') || command.includes('print game')) {
      let game_number = command.split('switch game').pop().split('print game').pop();
      // check if the game wasn't defined or it wasn't a number
      if (game_number == '' || isNaN(game_number)) {
        msg.reply('Please enter a correct game number. (e.g. !cb switch game 2 but not !cb switch game two)');
      } else {
        let player_info = find_player_games(msg.author);
        if (typeof player_info.games === 'undefined' || player_info.games.length == 0) {
          msg.reply('You have no games!');
        } else if (typeof player_info.games[game_number - 1] === 'undefined') {
          msg.reply(`You have no game in game slot ${game_number}`);
        } else if (command.includes('switch game') && player_info.primary_game_index == game_number - 1) {
          msg.reply(`Game ${game_number.trim()} is already your primary game.`);
        } else {
          // we're assuming at this point a valid game was found so we can print it no matter the outcome
          let game_selected = player_info.games[game_number - 1];
          let opponent = (game_selected.black_piece_user == msg.author) ? game_selected.white_piece_user
              : game_selected.black_piece_user;
          if (command.includes('switch game')) {
            player_info.primary_game_index = game_number - 1;
            player_base[player_base.indexOf(player_info)] = player_info;
            msg.reply(
                `You have successfully switched your primary game to your game number ${game_number.trim()} with ${opponent.username}. Game printing please wait...`);
          } else if (command.includes('print game')) {
            msg.reply(`Game ${game_number.trim()} with ${opponent.username} printing. Please wait...`);
          }
          game_selected.print_game().forEach(function(item, index) {
            msg.channel.send(item);
          });
        }
      }
    }
  }
});

client.login(token);

// Check if the author of this message was invited for a game of checkers
/**
 * Checks if the user was invited to a game from someone else.
 * @param invited
 * @returns {*[]}
 */
function check_invites(invited) {
  return awaiting_opponent_to_accept_queue.filter(x => x.invited.id === invited.id);
}

/**
 * Refreshes the awaiting opponent queue so old waiting list items are not still in the system.
 */
function refresh_awaiting_opponent_queue() {
  for (let i = 0; i < awaiting_opponent_queue.length; i++) {
    let date_message_sent = new Date(awaiting_opponent_queue[i].createdTimestamp);
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

/**
 * Adds a user to the awaiting for an opponent queue.
 * @param user_awaiting
 */
function add_user_to_awaiting_opponent_queue(user_awaiting) {
  awaiting_opponent_queue.push(user_awaiting);
}

/**
 * Removes the user from the awaiting for an opponent queue
 * @param user_awaiting
 */
function remove_user_from_awaiting_opponent_queue(user_awaiting) {
  let index = awaiting_opponent_queue.findIndex(x => x.author.id === user_awaiting.id);
  awaiting_opponent_queue.splice(index, 1);
}

// Awaiting opponent queue functions

/**
 * If a user wants to start a game, they have to invite someone, this method generates an invite to be sent to the
 * other user.
 * @param {Message} msg
 * @param bypass_awaiting_opponent_queue
 */
function awaiting_opponent_queue_initiator(
    msg, bypass_awaiting_opponent_queue = false) {
  let user_mentions = msg.mentions.users;
  // If the user was in the queue for awaiting an opponent...
  let user_awaiting = awaiting_opponent_queue.find(x => x.author.id === msg.author.id);
  user_awaiting = (user_awaiting != null) ? user_awaiting.author : null;
  let user_invited = user_mentions.first();
  if (user_awaiting == null && bypass_awaiting_opponent_queue === false) {
    msg.reply('You have to start the game first!. Type "!cb start" then type "!cb with *ping user*');
  } else if (user_mentions.size != 1) {
    msg.reply('You have either not mentioned an invited user or you have mentioned too many people!');
  } else if (user_invited.id == client.user.id) {
    msg.reply('I\'m honoured you want me to play but I can\'t :(');
  } else {
    remove_user_from_awaiting_opponent_queue(user_awaiting);
    if (user_invited.id == msg.author.id) {
      msg.reply('If you want to play checkers with yourself, enter "!cb start game with myself"');
    } else {
      let player_base_index = find_game(msg.author, user_invited);
      if (player_base_index !== false) {
        msg.reply(`You already have a game with ${user_invited.username} in your game slot ${player_base_index + 1}`);
      } else {
        msg.channel.send(user_invited + ', ' + msg.author.username + ' has invited you to play checkers! Type !cb' +
            ' accept to play.');
        add_user_to_awaiting_opponent_to_accept_queue(msg, user_invited);
      }
    }
  }
}

function add_user_to_awaiting_opponent_to_accept_queue(invitee, invited) {
  awaiting_opponent_to_accept_queue.push({'invitee_message': invitee, 'invited': invited});
}

function remove_user_to_awaiting_opponent_to_accept_queue(invitee, invited) {
  awaiting_opponent_to_accept_queue.push({'invitee': invitee, 'invited': invited});
}

function initiate_new_game(person_a, person_b, is_debugging_game = false) {
  let game = new Game(person_a, person_b, is_debugging_game);
  add_game_to_all_games(game);
  if (person_a.id === person_b.id) {
    update_player_base(person_a, game);
  } else {
    update_player_base(person_a, game);
    update_player_base(person_b, game);
  }

  return game;
}

function add_game_to_all_games(game) {
  all_games.push(game);
}

// player base functions
function update_player_base(person, game) {
  var player_index = player_base.indexOf(person);
  if (player_index !== -1) {
    player_base[player_index].games.push(game);
    player_base[player_index].primary_game_index = player_base[player_index].games.indexOf(
        game);
  } else {
    person.games = [game];
    person.primary_game_index = 0;
    player_base.push(person);
  }
}

function find_player_games(person) {
  let players_base_index = player_base.indexOf(person);
  return (players_base_index !== -1) ? player_base[players_base_index] : [];
}

/**
 * Returns index of the game in person a's player base if a game with person a and person b exists.
 * @param person_a
 * @param person_b
 * @returns {boolean|number}
 */
function find_game(person_a, person_b) {
  let players_game = find_player_games(person_a);
  if (typeof players_game.games === 'undefined' || players_game.games.length === 0) {
    return false;
  } else {
    let index = players_game.games.findIndex(x => (x.white_piece_user === person_a && x.black_piece_user === person_b)
        || (x.white_piece_user === person_b && x.black_piece_user === person_a));
    if (index === -1) {
      return false;
    } else {
      return index;
    }
  }
}

function move_piece(command, msg, game) {
  // get the coordinates through a regex
  let coordinates = command.match(/[a-z]{1}[1-9]{1}(\s|$)/gi);
  if (coordinates === null || coordinates.length !== 2) {
    msg.reply('Please enter 2 valid coordinates for your move.');
  } else {
    let old_coordinates = coordinates[0].split('');
    let new_coordinates = coordinates[1].split('');
    let old_square = game.get_square(old_coordinates[0], old_coordinates[1]);
    let new_square = game.get_square(new_coordinates[0], new_coordinates[1]);
    let move_response = game.confirm_valid_move(old_square, new_square, msg.author);
    if (move_response === true) {
      let piece = new_square.piece;
      // move is valid
      game.move(old_square, new_square);
      game.print_game().forEach(function(item, index) {
        msg.channel.send(item);
      });
    } else {
      msg.reply(`Your move is invalid! Reason stated: ${move_response}`);
    }
  }
}

function archive_primary_game(player_details) {
  player_details.games.splice(player_details.primary_game_index, 1);
  if (player_details.games.length > 0) {
    player_details.primary_game_index = player_details.games.length - 1;
  } else {
    delete player_details.primary_game_index;
  }
}