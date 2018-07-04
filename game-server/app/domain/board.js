var Square = require('./square');
var utils = require('../util/utils');
var consts = require('../consts/consts');

var Board = function(opts) {
	this.boardId = opts.boardId;
	this.rows = opts.rows;
	this.cols = opts.cols;
	this.mines = opts.mines;
	this.arena = opts.arena;
	this.squaresRevealed = 0; //squares the user has uncovered.  The game ends when a mine is clicked or when ((rows * cols) - mines) == squaresRevealed
	this.minesFlagged = 0; //squares the user has flagged as a mine
	if (!!opts.minesLocation) {
		this.initialize();
		this.generateMines(opts.minesLocation);
	}
};

module.exports = Board;

Board.prototype.initialize = function() {
	this.map = new Array(this.rows);
	for (var i = 0; i < this.rows; i++) {
		this.map[i] = new Array(this.cols);
	}
	for (var i = 0; i < this.rows; i++) {
		for (var j = 0; j < this.cols; j++) {
			this.map[i][j] = new Square(i, j, this);
		}
	}
	this.squaresRevealed = 0;
};

Board.prototype.generateMines = function(minesList) {
	var n = this.mines;
	do {
		var mineLocation = !!minesList ? minesList[n - 1] :
			Math.floor(Math.random(5000) * ((this.rows * this.cols) - 1));
		var row = Math.floor(mineLocation / this.cols);
		var col = mineLocation % this.cols;
		if (!this.map[row][col].isMine) {
			this.map[row][col].isMine = true;
			n -= 1;
		}
	} while (n > 0);
};

Board.prototype.regenerate = function(currentSquare) {
	var row = currentSquare.row;
	var col = currentSquare.col;

	while (currentSquare.getSurroundingMineCount() > 0 || currentSquare.isMine) {
		this.initialize();
		this.generateMines();
		currentSquare = this.map[row][col];
	}
	this.arena.regenerateMines(this.boardId);
};

Board.prototype.copyMinesFromBoard = function(board) {
	for (var i = 0; i < this.rows; i++) {
		for (var j = 0; j < this.cols; j++) {
			this.map[i][j].isMine = board.map[i][j].isMine;
		}
	}
};

Board.prototype.squaresRemaining = function() {
	return ((this.rows * this.cols) - this.mines) - this.squaresRevealed;
};

Board.prototype.uncoverSquare = function(row, col) {
	if (!this.map[row]) {
		return consts.ARENA.FAILED;
	}
	var square = this.map[row][col];
	if (!square) {
		return consts.ARENA.FAILED;
	}
	if (!square.isRevealed) {
		return square.uncoverSquare();
	}
	return consts.ARENA.FAILED;
};

Board.prototype.clearAround = function(row, col) {
	if (!this.map[row]) {
		return false;
	}
	var square = this.map[row][col];
	if (!square) {
		return false;
	}
	if (square.isRevealed) {
		return square.clearAround();
	}
	return false;
};

Board.prototype.markWithFlag = function(row, col) {
	if (!this.map[row]) {
		return consts.ARENA.FAILED;
	}
	var square = this.map[row][col];
	if (!square) {
		return consts.ARENA.FAILED;
	}
	if (!square.isRevealed) {
		return square.markWithFlag(!square.flaggedAsMine);
	}
	return consts.ARENA.FAILED;
};

Board.prototype.openSquare = function(row, col) {
	if (!this.map[row]) {
		return;
	}
	var square = this.map[row][col];
	if (!square) {
		return;
	}
	if (square.isRevealed) {
		square.clearAround();
	} else {
		square.uncoverSquare();
	}
};

Board.prototype.getMinesLocation = function() {
	var rows = this.rows;
	var cols = this.cols;
	var mines = this.mines;
	var minesLocation = [];
	var total = rows * cols;
	var locate = 0;
	var n = mines;
	do {
		var row = Math.floor(locate / cols);
		var col = locate % cols;
		if (this.map[row][col].isMine) {
			minesLocation.push(locate);
			n--;
		}
		locate++;
	} while (locate < total && n > 0);
	return minesLocation;
};

Board.prototype.visitSquares = function(cb) {
	for (var i = 0; i < this.rows; i++) {
		for (var j = 0; j < this.cols; j++) {
			utils.invokeCallback(cb, this.map[i][j]);
		}
	}
};

Board.prototype.toJSON = function() {
	var rows = this.rows;
	var cols = this.cols;
	var mines = this.mines;
	var minesLocation = this.getMinesLocation();
	return {
		rows: rows,
		cols: cols,
		mines: mines,
		minesLocation: minesLocation
	};
};