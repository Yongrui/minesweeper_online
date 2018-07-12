var SquareRO = require('./module/SquareRO');

cc.Class({
	extends: cc.Component,

	properties: {
		texFlag: cc.SpriteFrame,
		texSquare: cc.SpriteFrame,
		texRedMine: cc.SpriteFrame,
		texBlackMine: cc.SpriteFrame,
		texNumber: {
			default: [],
			type: cc.SpriteFrame
		},
		spCover: cc.Sprite,
	},

	init(row, col, squareSize) {
		this.node.width = squareSize;
		this.node.height = squareSize;
		this.RO = new SquareRO(row, col);
		this.isDraw = false;
	},

	playUncoverAnim() {
		this.spCover.node.getComponent('cc.Animation').play('UncoverSquare');
	},

	drawSquareNumber(n) {
		this.isDraw = true;
		var sprite = this.getComponent('cc.Sprite');
		sprite.spriteFrame = this.texNumber[n];
		this.playUncoverAnim();
	},

	drawFlag(visible) {
		// var sprite = this.getComponent('cc.Sprite');
		var sprite = this.spCover;
		if (visible) {
			sprite.spriteFrame = this.texFlag;
		} else {
			sprite.spriteFrame = this.texSquare;
		}
	},

	drawMine(triggered) {
		if (this.isDraw) {
			return;
		}
		this.isDraw = true;
		var sprite = this.getComponent('cc.Sprite');
		if (!triggered) {
			sprite.spriteFrame = this.texBlackMine;
		} else {
			sprite.spriteFrame = this.texRedMine;
		}
		this.playUncoverAnim();
	},

	getSurroundingMineCount() {
		var currentSquare = this;
		return this.visitSurrounding(function(currentSquare) {
			return currentSquare.RO.isMine;
		})
	},

	getSurroundingFlaggedCount() {
		var currentSquare = this;
		return this.visitSurrounding(function(currentSquare) {
			return currentSquare.RO.flaggedAsMine;
		})
	},

	getSurroundingUnrevealedCount() {
		var currentSquare = this;
		return this.visitSurrounding(function(currentSquare) {
			return !currentSquare.RO.isRevealed;
		})
	},

	visitSurrounding(propertySelector) {
		var row = this.RO.row;
		var col = this.RO.col;
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
	},

	//Count methods
	countAbove(propertySelector) {
		return propertySelector(this.board.map[this.RO.row - 1][this.RO.col]) ? 1 : 0;
	},

	countAboveRight(propertySelector) {
		return propertySelector(this.board.map[this.RO.row - 1][this.RO.col + 1]) ? 1 : 0;
	},

	countAboveLeft(propertySelector) {
		return propertySelector(this.board.map[this.RO.row - 1][this.RO.col - 1]) ? 1 : 0;
	},

	countBelow(propertySelector) {
		return propertySelector(this.board.map[this.RO.row + 1][this.RO.col]) ? 1 : 0;
	},

	countBelowRight(propertySelector) {
		return propertySelector(this.board.map[this.RO.row + 1][this.RO.col + 1]) ? 1 : 0;
	},

	countBelowLeft(propertySelector) {
		return propertySelector(this.board.map[this.RO.row + 1][this.RO.col - 1]) ? 1 : 0;
	},

	countRight(propertySelector) {
		return propertySelector(this.board.map[this.RO.row][this.RO.col + 1]) ? 1 : 0;
	},

	countLeft(propertySelector) {
		return propertySelector(this.board.map[this.RO.row][this.RO.col - 1]) ? 1 : 0;
	},

	//Uncover* methods
	uncoverAbove() {
		return this.board.map[this.RO.row - 1][this.RO.col].uncoverSquare();
	},

	uncoverAboveRight() {
		return this.board.map[this.RO.row - 1][this.RO.col + 1].uncoverSquare();
	},

	uncoverAboveLeft() {
		return this.board.map[this.RO.row - 1][this.RO.col - 1].uncoverSquare();
	},

	uncoverBelow() {
		return this.board.map[this.RO.row + 1][this.RO.col].uncoverSquare();
	},

	uncoverBelowRight() {
		return this.board.map[this.RO.row + 1][this.RO.col + 1].uncoverSquare();
	},

	uncoverBelowLeft() {
		return this.board.map[this.RO.row + 1][this.RO.col - 1].uncoverSquare();
	},

	uncoverRight() {
		return this.board.map[this.RO.row][this.RO.col + 1].uncoverSquare();
	},

	uncoverLeft() {
		return this.board.map[this.RO.row][this.RO.col - 1].uncoverSquare();
	},

	doOpening() {
		var row = this.RO.row;
		var col = this.RO.col;
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
	},

	flaggedRO(mark) {
		if (!this.RO.isRevealed && mark !== this.RO.flaggedAsMine) {
			var board = this.board;
			this.RO.flaggedAsMine = mark;
			if (this.RO.flaggedAsMine) {
				board.minesFlagged++;
			} else {
				board.minesFlagged--;
			}
		}
		return this.RO.flaggedAsMine;
	},

	markWithFlag(mark) {
		if (this.RO.isRevealed) return;
		var flagged = this.flaggedRO(mark);
		this.drawFlag(flagged);
	},

	toggleWithFlag() {
		if (this.RO.isRevealed) return;
		var flagged = this.flaggedRO(!this.RO.flaggedAsMine);
		this.drawFlag(flagged);
	},

	uncoverSquare() {
		var currentSquare = this;
		var row = currentSquare.RO.row;
		var col = currentSquare.RO.col;
		var board = currentSquare.board;

		if (currentSquare.RO.flaggedAsMine) return;
		if (currentSquare.RO.isRevealed) return;

		if (board.squaresRevealed == 0) {
			if (currentSquare.getSurroundingMineCount() > 0 || currentSquare.RO.isMine) {
				board.regenerate(currentSquare);
			}
			currentSquare = board.map[row][col];
		}

		currentSquare.RO.isRevealed = true;
		if (currentSquare.RO.isMine) {
			// console.log("loseGame");
			currentSquare.game.loseGame(currentSquare);
			return;
		}

		var n = currentSquare.getSurroundingMineCount();
		board.squaresRevealed++;
		currentSquare.drawSquareNumber(n);

		if (n === 0) {
			currentSquare.scheduleOnce(function() {
				currentSquare.doOpening();
			}, 0);
		}

		if (board.squaresRemaining() === 0) {
			console.log("winGame", board.squaresRevealed);
			currentSquare.game.winGame();
			return;
		}
	},

	clearAround() {
		var surroundingMines = this.getSurroundingMineCount();
		var surroundingFlagged = this.getSurroundingFlaggedCount();
		if (surroundingMines == surroundingFlagged && surroundingFlagged > 0) {
			var callback = this.uncoverSquare;
			this.visitSurrounding(function(currentSquare) {
				if (!currentSquare.RO.isRevealed && !currentSquare.RO.flaggedAsMine) {
					callback.call(currentSquare);
					return true;
				}
			});
		}
	},

	equal(currentSquare) {
		return currentSquare.RO.row === this.RO.row && currentSquare.RO.col === this.RO.col;
	},

});