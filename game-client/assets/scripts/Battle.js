var Arena = require('./Arena');
var utils = require('./module/utils');
var DataMng = require('./module/DataMng');

cc.Class({
	extends: Arena,

	properties: {
		lblUser1: cc.Label,
		lblUser2: cc.Label,
		panelResult: cc.Node
	},

	start() {
		this._super();
		var _this = this;
		pomelo.on('battle.onUncoverSquare', function(data) {
			cc.log('battle.onUncoverSquare', data);
			var row = data.row;
			var col = data.col;
			_this.remarkWithFlags(data.flags);
			_this.board.uncoverSquare(row, col);
		});
		pomelo.on('battle.onClearAround', function(data) {
			cc.log('battle.onClearAround', data);
			var row = data.row;
			var col = data.col;
			_this.remarkWithFlags(data.flags);
			_this.board.clearAround(row, col);
		});
		pomelo.on('battle.onMarkWithFlag', function(data) {
			cc.log('battle.onMarkWithFlag', data);
			var row = data.row;
			var col = data.col;
			_this.remarkWithFlags(data.flags);
			var location = utils.calculateMineLocation(_this.board, row, col);
			_this.board.markWithFlag(row, col, !!data.flags[location]);
		});
		pomelo.on('battle.onChangeRound', function(data) {
			cc.log('battle.onChangeRound', data);
		});
		pomelo.on('battle.gameOver', function(data) {
			cc.log('battle.gameOver', data);
			_this.gameOver(data);
		});
		pomelo.on('battle.onRegenerateMines', function(data) {
			cc.log('battle.onRegenerateMines', data);
			_this.board.initialize();
			_this.board.customizeMines(data.minesLocation);
		});
	},

	init(arenaId, data) {
		this.arenaId = arenaId
		this.board.setBoardSize(data.rows, data.cols, data.mines);
		this.board.initialize();
		this.board.customizeMines(data.minesLocation);
		this.removeEventListener();
		this.addEventListener();

		var playerList = data.playerList;
		if (!!playerList[0]) {
			this.lblUser1.string = playerList[0];
		} else {
			this.lblUser1.string = '';
		}
		if (!!playerList[1]) {
			this.lblUser2.string = playerList[1];
		} else {
			this.lblUser2.string = '';
		}

		this.panelResult.getComponent('PanelTransition').hide();
	},

	remarkWithFlags(flagsLocation) {
		var _this = this;
		this.board.forEachSquare(function(square) {
			var location = utils.calculateMineLocation(_this.board, square.RO.row, square.RO.col);
			square.flaggedRO(!!flagsLocation[location]);
		});
	},

	gameOver(data) {
		this.removeEventListener();

		if (data.isExplode) {
			_this.board.explode(data.row, data.col);
		} else {
			this.board.uncoverAllMines();
		}

		var isWon = (data.win === DataMng.getUserID());
		this.scheduleOnce(function() {
			this.panelResult.getComponent('PanelTransition').show();
			this.panelResult.getComponent('Result').init(isWon, this.node);
		}, 0.2);
	},

	requestMarkWithFlag(row, col) {
		var _this = this;
		pomelo.notify('arena.arenaHandler.markWithFlag', {
			arenaId: this.arenaId,
			row: row,
			col: col
		});
	},

	requestUncoverSquare(row, col) {
		var _this = this;
		pomelo.notify('arena.arenaHandler.uncoverSquare', {
			arenaId: this.arenaId,
			row: row,
			col: col
		});
	},

	requestClearAround(row, col) {
		var _this = this;
		cc.log('arena.arenaHandler.clearAround', row, col);
		pomelo.notify('arena.arenaHandler.clearAround', {
			arenaId: this.arenaId,
			row: row,
			col: col
		});
	},

	_longTouch(touch) {
		var currentSquare = touch.detail.currentSquare;
		if (!currentSquare.RO.isRevealed) {
			this.requestMarkWithFlag(currentSquare.RO.row, currentSquare.RO.col);
		}
	},

	_shortTouch(touch) {
		var currentSquare = touch.detail.currentSquare;
		if (currentSquare.RO.flaggedAsMine) {
			this.requestMarkWithFlag(currentSquare.RO.row, currentSquare.RO.col);
		} else if (!currentSquare.RO.isRevealed) {
			this.requestUncoverSquare(currentSquare.RO.row, currentSquare.RO.col);
		} else {
			this.requestClearAround(currentSquare.RO.row, currentSquare.RO.col);
		}
	},
});