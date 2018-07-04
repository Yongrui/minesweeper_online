cc.Class({
	extends: cc.Component,

	properties: {
		squarePrefab: cc.Prefab,
		rows: 10,
		cols: 10,
		mines: 10,
		squareSize: 35,
	},

	start() {
		this.setBoardSize(this.rows, this.cols, this.mines);
	},

	setBoardSize(rows, cols, mines) {
		this.rows = rows;
		this.cols = cols;
		this.mines = mines;
		this.squaresRevealed = 0;
		this.minesFlagged = 0;
		var width = this.cols * this.squareSize;
		var height = this.rows * this.squareSize;
		this.node.width = width;
		this.node.height = height;
	},

	clearAllSquares() {
		if (!this.map) {
			return;
		}
		for (var i = 0; i < this.map.length; i++) {
			for (var j = 0; j < this.map[i].length; j++) {
				this.node.removeChild(this.map[i][j].node);
			}
		}
	},

	initialize() {
		this.clearAllSquares();
		this.map = new Array(this.rows);
		for (var i = 0; i < this.rows; i++) {
			this.map[i] = new Array(this.cols);
		}
		var squareSize = this.squareSize;
		var width = this.cols * squareSize;
		var height = this.rows * squareSize;
		for (var i = 0; i < this.rows; i++) {
			for (var j = 0; j < this.cols; j++) {
				var square = cc.instantiate(this.squarePrefab).getComponent('Square');
				this.node.addChild(square.node);
				square.board = this;
				square.game = this.game;
				square.init(i, j, squareSize);
				var x = j * squareSize - width / 2 + squareSize / 2;
				var y = i * squareSize - height / 2 + squareSize / 2;
				square.node.setPosition(cc.p(x, y));
				this.map[i][j] = square;
			}
		}
		this.squaresRevealed = 0;
	},

	generateMines() {
		var n = this.mines;
		do {
			var mineLocation = Math.floor(Math.random(5000) * ((this.rows * this.cols) - 1))
			var row = Math.floor(mineLocation / this.cols);
			var col = mineLocation % this.cols;
			if (!this.map[row][col].RO.isMine) {
				this.map[row][col].RO.isMine = true;
				n -= 1;
			}
		} while (n > 0);
	},

	regenerate(currentSquare) {
		var row = currentSquare.RO.row;
		var col = currentSquare.RO.col;

		while (currentSquare.getSurroundingMineCount() > 0 || currentSquare.RO.isMine) {
			for (var i = 0; i < this.rows; i++) {
				for (var j = 0; j < this.cols; j++) {
					this.map[i][j].RO.isMine = false;
				}
			}
			this.generateMines();
			currentSquare = this.map[row][col];
		}
	},

	customizeMines(minesList) {
		for (var i = 0; i < minesList.length; i++) {
			var row = Math.floor(minesList[i] / this.cols);
			var col = minesList[i] % this.cols;
			this.map[row][col].RO.isMine = true;
		}
	},

	squaresRemaining() {
		return ((this.rows * this.cols) - this.mines) - this.squaresRevealed;
	},

	uncoverSquare(row, col) {
		if (!this.map[row]) {
			return;
		}
		var square = this.map[row][col];
		if (!square) {
			return;
		}
		if (!square.RO.isRevealed) {
			square.uncoverSquare();
		}
	},

	clearAround(row, col) {
		if (!this.map[row]) {
			return;
		}
		var square = this.map[row][col];
		if (!square) {
			return;
		}
		if (square.RO.isRevealed) {
			square.clearAround();
		}
	},

	markWithFlag(row, col, mark) {
		if (!this.map[row]) {
			return;
		}
		var square = this.map[row][col];
		if (!square) {
			return;
		}
		if (!square.RO.isRevealed) {
			square.markWithFlag(mark);
		}
	},

	toggleWithFlag(row, col) {
		if (!this.map[row]) {
			return;
		}
		var square = this.map[row][col];
		if (!square) {
			return;
		}
		if (!square.RO.isRevealed) {
			square.toggleWithFlag();
		}
	},

	uncoverAllMines(squareTriggered) {
		if (!!squareTriggered) {
			squareTriggered.drawMine(true);
		}

		var rows = this.rows;
		var cols = this.cols;
		for (var i = 0; i < rows; i++) {
			for (var j = 0; j < cols; j++) {
				var currentSquare = this.map[i][j];
				if (currentSquare.RO.isMine && !currentSquare.RO.flaggedAsMine && !(squareTriggered && squareTriggered.RO.row == currentSquare.RO.row && squareTriggered.RO.col == currentSquare.RO.col)) {
					currentSquare.RO.flaggedAsMine = true;
					if (!!squareTriggered) {
						currentSquare.drawMine();
					} else {
						currentSquare.drawFlag(true);
					}
					this.scheduleOnce(function() {
						this.uncoverAllMines(squareTriggered);
					}, 0);
					return;
				}
			}
		}
	},

	explode(row, col) {
		if (!this.map[row]) {
			return;
		}
		var square = this.map[row][col];
		if (!square) {
			return;
		}
		this.uncoverAllMines(square);
	},

	forEachSquare(cb) {
		var rows = this.rows;
		var cols = this.cols;
		for (var i = 0; i < rows; i++) {
			for (var j = 0; j < cols; j++) {
				cb(this.map[i][j]);
			}
		}
	}
});