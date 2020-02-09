let Square = require('./square.js');
let Piece = require('./piece.js');

class Game {
  // Initialise the game structure
  constructor(person_a, person_b, is_debugging_game = false) {
    // spaces are needed for some characters as others take up 2 char spaces
    this._grid_alphabet = ['a', 'b', 'c', 'd', 'e ', 'f ', 'g', 'h ', 'i', 'j', 'k', 'l'];
    this._grid_numbers = [' 1 ', '2', '3 ', '4 ', '5', '6 ', '7 ', '8', '9', '10'];
    this._black_piece_user = person_a;
    this._white_piece_user = person_b;
    this._pieces = {'white': [], 'black': []};
    this._active_team_user = this._black_piece_user;
    this._active_piece = 'black';
    this._inactive_team = this._white_piece_user;
    this._debugging_game = is_debugging_game;
    this._game_information = [];
    this._completed = false;
    this._initialise_game_structure();
  }

  get game_structure() {
    return this._game_structure;
  }

  set game_structure(game_structure) {
    this._game_structure = game_structure;
  }

  get active_piece() {
    return this._active_piece;
  }

  set active_piece(value) {
    this._active_piece = value;
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

  get active_team_user() {
    return this._active_team_user;
  }

  set active_team_user(value) {
    this._active_team_user = value;
  }

  get inactive_team_user() {
    return this._inactive_team;
  }

  set inactive_team_user(value) {
    this._inactive_team = value;
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

  get game_information() {
    return this._game_information;
  }

  set game_information(value) {
    this._game_information = value;
  }

  get completed() {
    return this._completed;
  }

  set completed(value) {
    this._completed = value;
  }

  get pieces() {
    return this._pieces;
  }

  push_pieces(piece) {
    if (piece.team === 'black') {
      this.pieces.black.push(piece);
    } else if (piece.team === 'white') {
      this.pieces.white.push(piece);
    }
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
    // Game structure is currently hard-coded for 8x8 games, but shouldn't be difficult to make it 10x10
    if (this._debugging_game) {
      game_structure = [
        this.generate_row(true, 'empty'), this.generate_row(false, 'empty'),
        this.generate_row(true, 'empty'), this.generate_row(false, 'empty'),
        this.generate_row(true, 'empty'), this.generate_row(false, 'empty'),
        this.generate_row(true, 'empty'), this.generate_row(false, 'empty')];
    } else {
      game_structure = [
        this.generate_row(true, 'black'), this.generate_row(false, 'black'),
        this.generate_row(true, 'black'), this.generate_row(false, 'empty'),
        this.generate_row(true, 'empty'), this.generate_row(false, 'white'),
        this.generate_row(true, 'white'), this.generate_row(false, 'white')];
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
  }

  //Public functions
  // Prints the game, returns notifications to player if a move occured or other events
  print_game() {
    let return_string = this.game_information;
    this.game_information = [];
    let opponent = (this.active_piece === 'white') ? this.white_piece_user : this.black_piece_user;
    if (this, this.completed) {
      return_string.push(`Printing board now...`);
    } else {
      return_string.push(
          `It is the ${this.active_piece} player's turn (${this.active_team_user}). Printing board now...`);
    }

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
            if (structure[i][y].piece.is_king) {
              printer += ' 🔵  |';
            } else {
              printer += ' ⚪  |';
            }
          } else if (structure[i][y].piece_black === true) {
            if (structure[i][y].piece.is_king) {
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
    // printer += (include_active_team)
    //     ? `It is ${this.active_team_user}'s turn (${this.active_piece} team). Type !cb move (piece coordinate) to (desired coordinate). e.g. !cb move C2 to H3.`
    //     : '';
    return_string.push(printer);
    return return_string;
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

  move(old_square, new_square) {
    let opponent = this.inactive_team_user;
    let piece = old_square.remove_piece();
    new_square.assign_piece(piece);
    // if someone took out a piece, remove the piece from the board and check for a double jump opportunity.
    let extra_message_info = ``;
    let square_in_between = this.get_square_in_between(old_square, new_square);
    let switch_turn = true;
    if (typeof square_in_between !== 'undefined') {
      // this recursive function does the work if a double jump is a possibility
      let square_possibilities = this._piece_jump_processor(new_square, this.active_team_user);
      if (Array.isArray(square_possibilities)) {
        extra_message_info += `You have the option to jump your piece on ${square_possibilities[2].friendly_coord}` +
            ` to either ${square_possibilities[0].friendly_coord} or ${square_possibilities[1].friendly_coord}. \nPlease select one of these pieces to jump.`;
        switch_turn = false;
      } else if (square_possibilities !== new_square) {
        extra_message_info += `You have double jumped multiple ${square_in_between.piece.team} pieces!`;
      } else {
        extra_message_info += `You have jumped a ${square_in_between.piece.team} piece!`;
      }
      // remove the in-between piece from the board
      let piece_taken = square_in_between.remove_piece(true);
      this.check_game_completed();
    }

    // Don't switch turn if the game is completed, we are assuming the current person's turn has won
    if (switch_turn && this.completed === false) {
      this.active_piece = (this.active_piece == 'white') ? 'black' : 'white';
      this.inactive_team_user = this.active_team_user;
      this.active_team_user = opponent;
    }
    if (!piece.is_king && this.check_king_crowning(piece)) {
      extra_message_info += `Your piece is crowned king on ${new_square.friendly_coord}!`;
    }
    if (extra_message_info !== '') {
      this.game_information.push(extra_message_info);
    }
  }

  // returns true if the move is valid. Makes all confirmation checks
  confirm_valid_move(old_square, new_square, player) {
    if (!old_square) {
      return 'Error finding your first entered coordinate.';
    } else if (!new_square) {
      return 'Error finding your second entered coordinate.';
    }
    let move_signifier = this.check_valid_square_move(old_square, new_square, player);
    if (move_signifier !== true) {
      return move_signifier;
    }
    return true;
  }

// returns true if it is a valid move between squares, otherwise will return a string stating why it is invalid
  check_valid_square_move(old_square, new_square, player) {
    let piece_to_move = old_square.piece;
    // we now need to check if the coordinates entered are valid regarding the game rules.
    // 1. there needs to be a piece on the old square
    if (typeof piece_to_move === 'undefined') {
      return 'There is no piece on your first entered coordinate.';
    }

    let square_in_between = this.get_square_in_between(old_square, new_square);
    // 2. the piece needs to move diagonally either way (if king), down (if piece is black) or up (if piece is white)
    // First check the x coordinate, if it's okay, check the Y, if it's NOT okay, return the signifier
    if (this.active_piece !== piece_to_move.team && !this.debugging_game) {
      return `You do not own the piece you are trying to move or it is not that piece's turn!`;
    } else if (!check_valid_y_coordinates(old_square, new_square, square_in_between)) {
      return `Your desired alphabetical/Y coordinate is invalid or you cannot move an uncrowned ${piece_to_move.team} piece that way.`;
    } else if (!(new_square.y_coord !== old_square.y_coord - 1 || new_square.y_coord !== old_square.y_coord + 1)) {
      return `Your desired X coordinate is invalid.`;
    } else if (typeof new_square.piece !== 'undefined' && piece_to_move.team == new_square.piece.team) {
      return `You cannot move to a square where it has your own piece on it.`;
    } else if (typeof new_square.piece !== 'undefined') {
      return `You cannot move to a square that has another piece.`;
    } else if (new_square.black_square) {
      return `You cannot jump to a square that you cannot land on (AKA no black squares).`;
    } else if (typeof square_in_between !== 'undefined' && typeof square_in_between.piece !== 'undefined' &&
        piece_to_move.team == square_in_between.piece.team) {
      return `You cannot jump a piece that is your owned by the same team.`;
    } else if (typeof square_in_between !== 'undefined' && typeof square_in_between.piece === 'undefined') {
      return `You cannot jump over a square that has no piece.`;
    } else if (typeof this.restricted_square !== 'undefined' && old_square.friendly_coord !==
        this.restricted_square.friendly_coord) {
      return `You need to jump from the square ${this.restricted_square.friendly_coord}`;
    }
    return true;

    function check_valid_y_coordinates() {
      let piece_to_move = old_square.piece;
      let y_coord_delta = (piece_to_move.team === 'black' || piece_to_move.is_king) ? old_square.y_coord + 1 : old_square.y_coord - 1;
      let y_coord_delta_2 = (piece_to_move.team === 'black' || piece_to_move.is_king) ? old_square.y_coord + 2 : old_square.y_coord - 2;
      if (new_square.y_coord === y_coord_delta ||
          typeof square_in_between !== 'undefined' && new_square.y_coord == y_coord_delta_2) {
        return true;
      } else if (piece_to_move.is_king && old_square.y_coord - 1 === new_square.y_coord ||
          typeof square_in_between !== 'undefined' && old_square.y_coord - 2 === new_square.y_coord) {
        return true;
      } else {
        return false;
      }
    }
  }

  // returns the best square that be found from the possibilities on the board.
  // it can also return an array of possibilities if there are 2 squares of equal jump value
  // If there are is only one jump move, the player's piece is moved to that spot automatically
  _piece_jump_processor(square, player) {
    // if (false && typeof square.piece == 'undefined')
    //   return square;
    let y_differentiator = (square.piece.team === 'black') ? 2 : -2;
    let square_possibility_one = this.get_square(square.y_coord + y_differentiator, square.x_coord - 2);
    let square_possibility_two = this.get_square(square.y_coord + y_differentiator, square.x_coord + 2);
    let possibilities = [];
    if (square_possibility_one !== false &&
        this.check_valid_square_move(square, square_possibility_one, player) === true) {
      possibilities.push(square_possibility_one);
    }
    if (square_possibility_two !== false &&
        this.check_valid_square_move(square, square_possibility_two, player) === true) {
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
      return this._piece_jump_processor(possibilities[0], player);
    } else {
      return square;
    }
  }

  check_king_crowning(piece) {
    if (piece.team === 'white' && piece.y_coord === 0) {
      piece.is_king = true;
      return true;
    } else if (piece.team === 'black' && piece.y_coord === this.game_structure.length - 1) {
      piece.is_king = true;
      return true;
    } else {
      return false;
    }
  }

  check_game_completed() {
    let white_pieces_taken = this.pieces.white.filter(piece => piece.taken === true);
    let black_pieces_taken = this.pieces.black.filter(piece => piece.taken === true);
    if (this.pieces.white.length === white_pieces_taken.length || this.pieces.black.length ===
        black_pieces_taken.length) {
      this.game_information.push(
          `Congratulations ${this.active_team_user}! You, the ${this.active_piece} player has won the game! This game is now completed`);
      this.completed = true;
    }
    return this.completed;
  }

  debug_square(command, square) {
    if (command.includes('empty')) {
      square.piece = undefined;
      this.game_information.push(`That square is now empty`);
    } else {
      let team = command.includes('white') ? 'white' : 'black';
      square.piece = new Piece(team, square.x_coord, square.y_coord);
      this.pieces[team].push(square.piece);
      this.game_information.push(`Your ${square.piece.team} piece is now on ${square.friendly_coord}`);
    }
  }

  generate_row(is_odd, row_type) {
    let row = [];
    let divider = (is_odd) ? 0 : 1;
    for (let i = 0; i < 8; i++) {
      if (i % 2 === divider) {
        row.push(new Square(false));
      } else {
        if (row_type === 'black') {
          let black_piece = new Piece('black');
          this.push_pieces(black_piece);
          row.push(new Square(true, black_piece));
        } else if (row_type === 'empty') {
          row.push(new Square(true));
        } else if (row_type === 'white') {
          let white_piece = new Piece('white');
          this.push_pieces(white_piece);
          row.push(new Square(true, white_piece));
        }
      }
    }
    return row;
  }
}

Game._player_base = [];
module.exports = Game;