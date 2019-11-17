class Piece {
  constructor(is_white, x_coord, y_coord) {
    this._is_king = false;
    this._is_white = is_white;
    this._is_black = !is_white;
    this._x_coord = x_coord;
    this._y_coord = y_coord;
  }

  get x_coord() {
    return this._x_coord;
  }

  set x_coord(value) {
    this._x_coord = value;
  }

  get y_coord() {
    return this._y_coord;
  }

  set y_coord(value) {
    this._y_coord = value;
  }

  get square() {
    return this._square;
  }

  set square(value) {
    this._square = value;
  }

  get is_white() {
    return this._is_white;
  }

  set is_white(value) {
    this._is_white = value;
  }

  get is_king() {
    return this._is_king;
  }

  set is_king(value) {
    this._is_king = value;
  }

  get is_black() {
    return this._is_black;
  }

  set is_black(value) {
    this._is_black = value;
  }

  team() {
    if (this.is_white === true) {
      return 'white';
    } else {
      return 'black';
    }
  }
}

module.exports = Piece;