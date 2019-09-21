class Square {
    get black_square() {
        return this._black_square;
    }

    get white_square() {
        return this._white_square;
    }
    get has_piece() {
        return this._has_piece;
    }
    get piece_white() {
        return this._piece_white;
    }
    get piece_black() {
        return this._piece_black;
    }
    constructor(is_white_square, has_piece, is_white_piece_type) {
        if (is_white_square) {
            this._white_square = true;
            this._black_square = false;
            this._has_piece = (has_piece === true);
            // There's a piece on the square, must be either black or white
            if (has_piece === true) {
                if (is_white_piece_type === true) {
                    this._piece_white = true;
                    this._piece_black = false;
                } else {
                    this._piece_white = false;
                    this._piece_black = true;
                }
            } else {
                this._has_piece = false;
                this._piece_white = false;
            }

        } else {
            // Only white squares can have a black/white piece
            this._white_square = false;
            this._black_square = true;
            this._has_piece = false;
            this._piece_white = false;
        }
    }
};

module.exports = Square;