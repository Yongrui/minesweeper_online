var utils = require('../util/utils');
var consts = require('../consts/consts');

var Square = function(row, col, board) {
	this.isRevealed = false;
	this.flaggedAsMine = false;
	this.isMine = false;
	this.number = 0;
	this.row = row;
	this.col = col;
	this.board = board;
}

module.exports = Square;

Square.prototype.drawSquareNumber = function(n) {

}

Square.prototype.getSurroundingMineCount = function() {
	var currentSquare = this;
	return this.visitSurrounding(function(currentSquare) {
		return currentSquare.isMine;
	});
}

Square.prototype.getSurroundingFlaggedCount = function(uid) {
	var currentSquare = this;
	return this.visitSurrounding(function(currentSquare) {
		return currentSquare.flaggedAsMine;
	});
}

Square.prototype.getSurroundingUnrevealedCount = function() {
	var currentSquare = this;
	return this.visitSurrounding(function(currentSquare) {
		return !currentSquare.isRevealed;
	});
}

Square.prototype.visitSurrounding = function(propertySelector) {
	var count;
	var row = this.row;
	var col = this.col;
	var rows = this.board.rows;
	var cols = this.board.cols;

	//Corners
	if (row == 0 && col == 0) {
		return this.countBelow(propertySelector) + this.countRight(propertySelector) + this.countBelowRight(propertySelector);
	}
	if (row == 0 && col == cols - 1) {
		return this.countLeft(propertySelector) + this.countBelowLeft(propertySelector) + this.countBelow(propertySelector);
	}
	if (row == rows - 1 && col == 0) {
		return this.countRight(propertySelector) + this.countAboveRight(propertySelector) + this.countAbove(propertySelector);
	}
	if (row == rows - 1 && col == cols - 1) {
		return this.countLeft(propertySelector) + this.countAboveLeft(propertySelector) + this.countAbove(propertySelector);
	}

	//First and last row
	if (row == 0) {
		return this.countLeft(propertySelector) + this.countRight(propertySelector) + this.countBelowLeft(propertySelector) + this.countBelowRight(propertySelector) +
			this.countBelow(propertySelector);
	}
	if (row == rows - 1) {
		return this.countLeft(propertySelector) + this.countRight(propertySelector) + this.countAboveLeft(propertySelector) + this.countAboveRight(propertySelector) +
			this.countAbove(propertySelector);
	}

	//First and last column
	if (col == 0) {
		return this.countRight(propertySelector) + this.countAboveRight(propertySelector) + this.countAbove(propertySelector) + this.countBelow(propertySelector) +
			this.countBelowRight(propertySelector);

	}
	if (col == cols - 1) {
		return this.countLeft(propertySelector) + this.countAboveLeft(propertySelector) + this.countAbove(propertySelector) + this.countBelow(propertySelector) +
			this.countBelowLeft(propertySelector);
	}

	return this.countLeft(propertySelector) + this.countRight(propertySelector) + this.countAboveLeft(propertySelector) + this.countAboveRight(propertySelector) +
		this.countAbove(propertySelector) + this.countBelow(propertySelector) + this.countBelowLeft(propertySelector) + this.countBelowRight(propertySelector);
}

//Count methods
Square.prototype.countAbove = function(propertySelector) {
	return propertySelector(this.board.map[this.row - 1][this.col]) ? 1 : 0;
}

Square.prototype.countAboveRight = function(propertySelector) {
	return propertySelector(this.board.map[this.row - 1][this.col + 1]) ? 1 : 0;
}

Square.prototype.countAboveLeft = function(propertySelector) {
	return propertySelector(this.board.map[this.row - 1][this.col - 1]) ? 1 : 0;
}

Square.prototype.countBelow = function(propertySelector) {
	return propertySelector(this.board.map[this.row + 1][this.col]) ? 1 : 0;
}

Square.prototype.countBelowRight = function(propertySelector) {
	return propertySelector(this.board.map[this.row + 1][this.col + 1]) ? 1 : 0;
}

Square.prototype.countBelowLeft = function(propertySelector) {
	return propertySelector(this.board.map[this.row + 1][this.col - 1]) ? 1 : 0;
}

Square.prototype.countRight = function(propertySelector) {
	return propertySelector(this.board.map[this.row][this.col + 1]) ? 1 : 0;
}

Square.prototype.countLeft = function(propertySelector) {
	return propertySelector(this.board.map[this.row][this.col - 1]) ? 1 : 0;
}

//Uncover* methods
Square.prototype.uncoverAbove = function() {
	return this.board.map[this.row - 1][this.col].uncoverSquare();
}

Square.prototype.uncoverAboveRight = function() {
	return this.board.map[this.row - 1][this.col + 1].uncoverSquare();
}

Square.prototype.uncoverAboveLeft = function() {
	return this.board.map[this.row - 1][this.col - 1].uncoverSquare();
}

Square.prototype.uncoverBelow = function() {
	return this.board.map[this.row + 1][this.col].uncoverSquare();
}

Square.prototype.uncoverBelowRight = function() {
	return this.board.map[this.row + 1][this.col + 1].uncoverSquare();
}

Square.prototype.uncoverBelowLeft = function() {
	return this.board.map[this.row + 1][this.col - 1].uncoverSquare();
}

Square.prototype.uncoverRight = function() {
	return this.board.map[this.row][this.col + 1].uncoverSquare();
}

Square.prototype.uncoverLeft = function() {
	return this.board.map[this.row][this.col - 1].uncoverSquare();
}

Square.prototype.doOpening = function() {
	var row = this.row;
	var col = this.col;
	var rows = this.board.rows;
	var cols = this.board.cols;

	//Corners
	if (row == 0 && col == 0) {
		this.uncoverBelow();
		this.uncoverRight();
		this.uncoverBelowRight();
		return;
	}
	if (row == 0 && col == cols - 1) {
		this.uncoverLeft();
		this.uncoverBelowLeft();
		this.uncoverBelow();
		return;
	}
	if (row == rows - 1 && col == 0) {
		this.uncoverRight();
		this.uncoverAboveRight();
		this.uncoverAbove();
		return;
	}
	if (row == rows - 1 && col == cols - 1) {
		this.uncoverLeft();
		this.uncoverAboveLeft();
		this.uncoverAbove();
		return;
	}

	//First and last row
	if (row == 0) {
		this.uncoverLeft();
		this.uncoverRight();
		this.uncoverBelowLeft();
		this.uncoverBelowRight();
		this.uncoverBelow();
		return;
	}
	if (row == rows - 1) {
		this.uncoverLeft();
		this.uncoverRight();
		this.uncoverAboveLeft();
		this.uncoverAboveRight();
		this.uncoverAbove();
		return;
	}

	//First and last column
	if (col == 0) {
		this.uncoverRight();
		this.uncoverAboveRight();
		this.uncoverAbove();
		this.uncoverBelow();
		this.uncoverBelowRight();
		return;
	}
	if (col == cols - 1) {
		this.uncoverLeft();
		this.uncoverAboveLeft();
		this.uncoverAbove();
		this.uncoverBelow();
		this.uncoverBelowLeft();
		return;
	}

	this.uncoverRight();
	this.uncoverAboveLeft();
	this.uncoverAboveRight();
	this.uncoverAbove();
	this.uncoverBelow();
	this.uncoverBelowRight();
	this.uncoverBelowLeft();
	this.uncoverLeft();
}

Square.prototype.markWithFlag = function(mark) {
	if (this.isRevealed) {
		return consts.ARENA.FAILED;
	}

	if (mark !== this.flaggedAsMine) {
		this.flaggedAsMine = mark;
		if (this.flaggedAsMine) {
			this.board.minesFlagged++;
			return consts.ARENA.MARK_FLAG;
		} else {
			this.board.minesFlagged--;
			return consts.ARENA.CLEAR_FLAG;
		}
	}
	return consts.ARENA.OK;
}

Square.prototype.uncoverSquare = function() {
	var currentSquare = this;
	var row = currentSquare.row;
	var col = currentSquare.col;
	var board = currentSquare.board;
	if (currentSquare.flaggedAsMine) {
		return consts.ARENA.FAILED;
	}
	if (currentSquare.isRevealed) {
		return consts.ARENA.FAILED;
	}
	if (board.squaresRevealed == 0) {
		if (currentSquare.getSurroundingMineCount() > 0 || currentSquare.isMine) {
			board.regenerate(currentSquare);
		}
		currentSquare = board.map[row][col];
	}

	if (currentSquare.isMine) { //Player loses
		utils.requestAnimFrame(function() {
			board.arena.explode(board.boardId, row, col);
		});
		return consts.ARENA.EXPLODED;
	}

	var n = currentSquare.getSurroundingMineCount();
	currentSquare.isRevealed = true;
	board.squaresRevealed++;
	currentSquare.drawSquareNumber(n);
	if (n == 0) {
		utils.requestAnimFrame(function() {
			currentSquare.doOpening();
		});
	}

	if (board.squaresRemaining() == 0) { // Player win
		utils.requestAnimFrame(function() {
			board.arena.finish(board.boardId, row, col);
		});
		return consts.ARENA.VICTORY;
	}
	return consts.ARENA.OK;
}

Square.prototype.clearAround = function() {
	var surroundingMines = this.getSurroundingMineCount();
	var surroundingFlagged = this.getSurroundingFlaggedCount();
	if (surroundingMines == surroundingFlagged && surroundingFlagged > 0) {
		var callback = this.uncoverSquare;
		this.visitSurrounding(function(currentSquare) {
			if (!currentSquare.isRevealed && !currentSquare.flaggedAsMine) {
				callback.call(currentSquare);
				return true;
			}
		});
		return true;
	}
	return false;
}