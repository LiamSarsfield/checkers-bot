var Square = require('./square.js');

class Game {
  // Initialise the game structure
  constructor(person_a, person_b) {
    this._black_piece_user = person_a;
    this._white_piece_user = person_b;
    this._players_turn = this._black_piece_user;
    this._initialise_game_structure();
  }

  get game_structure() {
    return this._game_structure;
  }

  set game_structure(game_structure) {
    this._game_structure = game_structure;
  }

  get black_piece_user() {
    return this._black_piece_user;
  }

  set black_piece_user(black_piece_user) {
    this._black_piece_user = black_piece_user;
  }

  get white_piece_user() {
    return this._white_piece_user;
  }

  set white_piece_user(white_piece_user) {
    this._white_piece_user = white_piece_user;
  }

  get players_turn() {
    return this._players_turn;
  }

  set players_turn(value) {
    this._players_turn = value;
  }

  _initialise_game_structure() {
    var square_white_black_piece = new Square(true, true, false);
    var square_white_white_piece = new Square(true, true, true);
    var square_black = new Square(false, false);
    var square_white = new Square(true, false);
    var black_piece_row_odd = [
      square_black,
      square_white_black_piece,
      square_black,
      square_white_black_piece,
      square_black,
      square_white_black_piece,
      square_black,
      square_white_black_piece];
    var black_piece_row_even = [
      square_white_black_piece,
      square_black,
      square_white_black_piece,
      square_black,
      square_white_black_piece,
      square_black,
      square_white_black_piece,
      square_black];
    var white_piece_row_odd = [
      square_white_white_piece,
      square_black,
      square_white_white_piece,
      square_black,
      square_white_white_piece,
      square_black,
      square_white_white_piece,
      square_black];
    var white_piece_row_even = [
      square_black,
      square_white_white_piece,
      square_black,
      square_white_white_piece,
      square_black,
      square_white_white_piece,
      square_black,
      square_white_white_piece];
    var empty_row_even_even = [
      square_white, square_black, square_white,
      square_black, square_white, square_black, square_white,
      square_black];
    var empty_row_even_odd = [
      square_black, square_white, square_black,
      square_white, square_black, square_white, square_black,
      square_white];
    this._game_structure = [
      black_piece_row_odd,
      black_piece_row_even,
      black_piece_row_odd,
      empty_row_even_even,
      empty_row_even_odd,
      white_piece_row_odd,
      white_piece_row_even,
      white_piece_row_odd];

  }

  print_game() {
    var structure = this.game_structure;
    var printer = '';
    // spaces are needed for some characters as others take up 2 char spaces
    var grid_alpabet = [
      'a',
      'b',
      'c',
      'h',
      'i ',
      'j ',
      'k',
      'l ',
      'm',
      'n',
      'o',
      'p'];
    var grid_numbers = [
      ' 1 ',
      '2',
      '3 ',
      '4 ',
      '5',
      '6 ',
      '7 ',
      '8',
      '9',
      '10'];
    printer += ':\t |';
    for (var i = 0; structure.length > i; i++) {
      printer += '   ' + grid_numbers[i] + '   |';
    }
    printer += '\n';
    // use nested for loop to print the game
    for (var i = 0; structure.length > i; i++) {
      printer += grid_alpabet[i] + '\t|';
      for (var y = 0; structure[i].length > y; y++) {
        if (structure[i][y].white_square === true) {
          if (structure[i][y].piece_white === true) {
            printer += ' ⚪  |';
          } else if (structure[i][y].piece_black === true) {
            printer += ' ⚫  |';
          } else {
            printer += ' ⏹️  |';
          }
        } else {
          printer += ' 🔲  |';
        }
      }
      printer += '\n';
    }
    printer += `It is ${this._players_turn}'s turn. Type !cb move (piece coordinate) to (desired coordinate). e.g. !cb move !cb move C2 to H3.`;
    return printer;
  }
};
Game._player_base = [];
module.exports = Game;