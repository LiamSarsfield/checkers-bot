let Square = require('./square.js');
let Piece = require('./piece.js');

class Game {
  get inactive_team() {
    return this._inactive_team;
  }

  set inactive_team(value) {
    this._inactive_team = value;
  }
  // Initialise the game structure
  constructor(person_a, person_b, is_debugging_game = false) {
    // spaces are needed for some characters as others take up 2 char spaces
    this._grid_alphabet = ['a', 'b', 'c', 'h', 'i ', 'j ', 'k', 'l ', 'm', 'n', 'o', 'p'];
    this._grid_numbers = [' 1 ', '2', '3 ', '4 ', '5', '6 ', '7 ', '8', '9', '10'];
    this._black_piece_user = person_a;
    this._white_piece_user = person_b;
    this._active_team = this._black_piece_user;
    this._inactive_team = this._white_piece_user;
    this._debugging_game = is_debugging_game;
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

  get active_team() {
    return this._active_team;
  }

  set active_team(value) {
    this._active_team = value;
  }

  get restricted_square() {
    return this._restricted_square;
  }

  set restricted_square(value) {
    this._restrictied_square = value;
  }

  get debugging_game() {
    return this._debugging_game;
  }

  set debugging_game(value) {
    this._debugging_game = value;
  }

  _initialise_game_structure() {
    let square_white_with_black_piece = new Square(true);
    square_white_with_black_piece.piece = new Piece(false);
    let square_white_with_white_piece = new Square(true);
    square_white_with_white_piece.piece = new Piece(true);
    let square_black = new Square(false);
    let square_white = new Square(true);
    let black_piece_row_odd = [];
    let game_structure = [];
    if(this._debugging_game) {
       game_structure = [
        generate_row(true, 'empty'), generate_row(false, 'empty'),
        generate_row(true, 'empty'), generate_row(false, 'empty'),
        generate_row(true, 'empty'), generate_row(false, 'empty'),
        generate_row(true, 'empty'), generate_row(false, 'empty')];
    } else {
       game_structure = [
        generate_row(true, 'black'), generate_row(false, 'black'),
        generate_row(true, 'black'), generate_row(false, 'empty'),
        generate_row(true, 'empty'), generate_row(false, 'white'),
        generate_row(true, 'white'), generate_row(false, 'white')];
    }
    // use nested for loop to initialise the piece's coords
    for (let y = 0; game_structure.length > y; y++) {
      for (let x = 0; game_structure[y].length > x; x++) {
        game_structure[y][x].x_coord = x;
        game_structure[y][x].y_coord = y;
        game_structure[y][x].friendly_coord = this._grid_alphabet[y].trim().toUpperCase() + (x + 1);
      }
    }

    this._game_structure = game_structure;

    function generate_row(is_odd, row_type) {
      let row = [];
      let divider = (is_odd) ? 0 : 1;
      for (let i = 0; i < 8; i++) {
        if (i % 2 === divider) {
          row.push(new Square(false));
        } else {
          if (row_type == 'black') {
            row.push(new Square(true, new Piece(false)));
          } else if (row_type == 'empty') {
            row.push(new Square(true));
          } else if (row_type == 'white') {
            row.push(new Square(true, new Piece(true)));
          }
        }
      }
      return row;
    }
  }

  print_game(include_active_team = false) {
    let structure = this.game_structure;
    let printer = '';
    // spaces are needed for some characters as others take up 2 char spaces
    let grid_alphabet = this._grid_alphabet;
    let grid_numbers = this._grid_numbers;
    printer += ':\t |';
    for (let i = 0; structure.length > i; i++) {
      printer += '   ' + grid_numbers[i] + '   |';
    }
    printer += '\n';
    // use nested for loop to print the game
    for (let i = 0; structure.length > i; i++) {
      printer += grid_alphabet[i] + '\t|';
      for (let y = 0; structure[i].length > y; y++) {
        if (structure[i][y].white_square === true) {
          if (structure[i][y].piece_white === true) {
            if (structure[i][y].is_king) {
              printer += ' 🔵  |';
            } else {
              printer += ' ⚪  |';
            }
          } else if (structure[i][y].piece_black === true) {
            if (structure[i][y].is_king) {
              printer += ' 🔴  |';
            } else {
              printer += ' ⚫  |';
            }
          } else {
            printer += ' ⏹️  |';
          }
        } else {
          printer += ' 🔲  |';
        }
      }
      printer += '\n';
    }
    printer += (include_active_team)
        ? `It is ${this._active_team}'s turn. Type !cb move (piece coordinate) to (desired coordinate). e.g. !cb move C2 to H3.`
        : '';
    return printer;
  }

// returns the square object
  get_square(y, x) {
    let y_coord = (!Number.isInteger(y)) ? this._grid_alphabet.findIndex(i => i.trim() === y.toLowerCase()) : y;
    let x_coord = (!Number.isInteger(x)) ? x - 1 : x;
    if (typeof this._game_structure[x_coord] === 'undefined' || typeof this._game_structure[x_coord][y_coord] ===
        'undefined' || this._game_structure[x_coord][y_coord].constructor.name !== 'Square') {
      return false;
    } else {
      return this._game_structure[y_coord][x_coord];
    }
  }

  get_square_in_between(old_square, new_square) {
    if (Math.round((new_square.y_coord + old_square.y_coord) / 2) !== new_square.y_coord &&
        Math.round((new_square.y_coord + old_square.y_coord) / 2) !== old_square.y_coord) {
      return this.get_square(Math.round((new_square.y_coord + old_square.y_coord) / 2),
          Math.round((new_square.x_coord + old_square.x_coord) / 2));
    }
  }

  // returns true if the move is valid
  move(old_square, new_square, player) {
    if (!old_square) {
      return 'Error finding your first entered coordinate.';
    } else if (!new_square) {
      return 'Error finding your second entered coordinate.';
    }
    let move_signifier = this.check_valid_move(old_square, new_square, player);
    if (move_signifier !== true) {
      return move_signifier;
    } else if (typeof this.restricted_square !== 'undefined' && this.restricted_square.friendly_coord ===
        old_square.friendly_coord) {
      this.restricted_square = undefined;
    }
    let piece = old_square.remove_piece();
    new_square.assign_piece(piece);
    return true;
  }

// returns true if it is a valid move, otherwise will return a string stating why it is invalid
  check_valid_move(old_square, new_square, player) {
    let piece_to_move = old_square.piece;
    // we now need to check if the coordinates entered are valid regarding the game rules.
    // 1. there needs to be a piece on the old square
    if (typeof piece_to_move === 'undefined') {
      return 'There is no piece on your first entered coordinate.';
    }

    let square_in_between = this.get_square_in_between(old_square, new_square);
    // 2. the piece needs to move diagonally either way (if king), down (if piece is black) or up (if piece is white)
    // First check the x coordinate, if it's okay, check the Y, if it's NOT okay, return the signifier
    if ((piece_to_move.is_white && this.white_piece_user.id !== player.id) ||
        (piece_to_move.is_black && this.black_piece_user.id !== player.id)) {
      return `You do not own the piece you are trying to move!`;
    } else if ((piece_to_move.is_black && !(new_square.y_coord === old_square.y_coord + 1 ||
        typeof square_in_between !== 'undefined' && new_square.y_coord === old_square.y_coord + 2)) ||
        (piece_to_move.is_white && !(new_square.y_coord === old_square.y_coord - 1 ||
            typeof square_in_between !== 'undefined' && new_square.y_coord === old_square.y_coord - 2))) {
      return `Your desired alphabetical/Y coordinate is invalid.`;
    } else if (!(new_square.y_coord !== old_square.y_coord - 1 || new_square.y_coord !== old_square.y_coord + 1)) {
      return `Your desired X coordinate is invalid.`;
    } else if (typeof new_square.piece !== 'undefined' &&
        (piece_to_move.is_black == new_square.piece.is_black && piece_to_move.is_white == new_square.piece.is_white)) {
      return `You cannot move to a square where it has your own piece on it.`;
    } else if (typeof new_square.piece !== 'undefined') {
      return `You cannot move to a square that has another piece.`;
    } else if (new_square.black_square) {
      return `You cannot jump to a square that you cannot land on (AKA no black squares).`;
    } else if (typeof square_in_between !== 'undefined' && typeof square_in_between.piece !== 'undefined' &&
        (piece_to_move.is_black == square_in_between.piece.is_black && piece_to_move.is_white ==
            square_in_between.piece.is_white)) {
      return `You cannot jump a piece that is your own piece.`;
    } else if (typeof square_in_between !== 'undefined' && typeof square_in_between.piece === 'undefined') {
      return `You cannot jump over a square that has no piece.`;
    } else if (typeof this.restricted_square !== 'undefined' && old_square.friendly_coord !==
        this.restricted_square.friendly_coord) {
      return `You need to jump from the square ${this.restricted_square.friendly_coord}`;
    }
    return true;
  }

  // returns the best square that be found from the possibilities on the board.
  // it can also return an array of possibilities if there are 2 squares
  double_jump_initiator(square, player) {
    if (false && typeof square.piece == 'undefined')
      return square;
    let y_differentiator = (square.piece.is_black) ? 2 : -2;
    let square_possibility_one = this.get_square(square.y_coord + y_differentiator, square.x_coord - 2);
    let square_possibility_two = this.get_square(square.y_coord + y_differentiator, square.x_coord + 2);
    let possibilities = [];
    if (square_possibility_one !== false && this.check_valid_move(square, square_possibility_one, player) === true) {
      possibilities.push(square_possibility_one);
    }
    if (square_possibility_two !== false && this.check_valid_move(square, square_possibility_two, player) === true) {
      possibilities.push(square_possibility_two);
    }
    if (possibilities.length >= 2) {
      this.restricted_square = square;
      // third element in array will be the square the piece is on
      possibilities.push(square);
      return possibilities;
    } else if (possibilities.length === 1) {
      let piece = square.piece;
      square.piece = undefined;
      possibilities[0].piece = piece;
      let get_square_in_between = this.get_square_in_between(square, possibilities[0]);
      get_square_in_between.piece = undefined;
      return this.double_jump_initiator(possibilities[0], player);
    } else {
      return square;
    }
  }

  check_king_crowning(piece) {
    if (piece.is_white && piece.y_coord === 0) {
      piece.is_king = true;
      return true;
    } else if (piece.is_black && piece.y_coord === this._grid_alphabet.length) {
      piece.is_king = true;
      return true;
    } else {
      return false;
    }
  }
}

Game._player_base = [];
module.exports = Game;