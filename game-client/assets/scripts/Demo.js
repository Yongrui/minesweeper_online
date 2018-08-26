var Arena = require('./Arena');

cc.Class({
	extends: Arena,

	properties: {
		btnNewGame: cc.Node
	},

	start() {
		this._super();
		this.seconds = -1;
		this.newGame();
	},

	newGame() {
		this.seconds = -1;
		this.removeEventListener();
		this.addEventListener();
		this.board.initialize();
		this.board.generateMines();
		this.btnNewGame.active = false;
	},

	loseGame(currentSquare) {
		this.seconds = -1;
		this.removeEventListener();
		this.board.uncoverAllMines(currentSquare);
		this.btnNewGame.active = true;
	},

	winGame() {
		this.seconds = -1;
		this.removeEventListener();
		this.board.uncoverAllMines();
		this.btnNewGame.active = true;
	},

	_longTouch(touch) {
		if (this.seconds < 0) {
			this.seconds = 0;
		}

		var currentSquare = touch.currentSquare;
		if (!currentSquare.RO.isRevealed) {
			currentSquare.toggleWithFlag();
		}
	},

	_shortTouch(touch) {
		if (this.seconds < 0) {
			this.seconds = 0;
		}

		var currentSquare = touch.currentSquare;
		if (!currentSquare.RO.isRevealed) {
			currentSquare.uncoverSquare();
		} else {
			currentSquare.clearAround();
		}
	},

	update(dt) {
		if (this.seconds > -1) {
			this.seconds += dt;
		}
	}
});