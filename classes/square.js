class Square {
  constructor(is_white_square, piece) {
    if (is_white_square) {
      this._white_square = true;
      this._black_square = false;
      this._piece = piece;
    } else {
      this._white_square = false;
      this._black_square = true;
    }

  }

  get x_coord() {
    return this._x_coord;
  }

  set x_coord(value) {
    this._x_coord = value;
    if (this.has_piece) {
      this._piece.x_coord = value;
    }
  }

  get y_coord() {
    return this._y_coord;
  }

  set y_coord(value) {
    this._y_coord = value;
    if (this.has_piece) {
      this._piece.y_coord = value;
    }
  }

  get friendly_coord() {
    return this._friendly_coord;
  }

  set friendly_coord(value) {
    this._friendly_coord = value;
  }

  get black_square() {
    return this._black_square;
  }

  get white_square() {
    return this._white_square;
  }

  get has_piece() {
    return (typeof this._piece !== 'undefined');
  }

  get piece() {
    return this._piece;
  }

  set piece(piece) {
    this._piece = piece;
  }

  get piece_white() {
    if (typeof this._piece == 'undefined' || this._piece.constructor.name != 'Piece') {
      return false;
    } else {
      return this._piece.is_white;
    }
  }

  get piece_black() {
    if (typeof this._piece == 'undefined' || this._piece.constructor.name != 'Piece') {
      return false;
    } else {
      return this._piece.is_black;
    }
  }

  remove_piece() {
    let return_piece = this.piece;
    this.piece = undefined;
    return return_piece;
  }

  assign_piece(piece) {
      piece.x_coord = this.x_coord;
      piece.y_coord = this.y_coord;
      this.piece = piece;
  }
}

module.exports = Square;