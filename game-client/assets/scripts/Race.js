var Arena = require('./Arena');
var utils = require('./module/utils');
var DataMng = require('./module/DataMng');

cc.Class({
	extends: Arena,

	properties: {
	},

	start() {
		this._super();
		var _this = this;
		pomelo.on('race.onUncoverSquare', function(data) {
			cc.log('race.onUncoverSquare', data);
			var row = data.row;
			var col = data.col;
			_this.board.uncoverSquare(row, col);
		});
		pomelo.on('race.onClearAround', function(data) {
			cc.log('race.onClearAround', data);
			var row = data.row;
			var col = data.col;
			_this.board.clearAround(row, col);
		});
		pomelo.on('race.onMarkWithFlag', function(data) {
			cc.log('race.onMarkWithFlag', data);
			var row = data.row;
			var col = data.col;
			_this.board.toggleWithFlag(row, col);
		});
		pomelo.on('race.gameOver', function(data) {
			cc.log('race.gameOver', data);
			_this.gameOver(data);
		});
		pomelo.on('race.onRegenerateMines', function(data) {
			cc.log('race.onRegenerateMines', data);
			_this.board.initialize();
			_this.board.customizeMines(data.minesLocation);
		});
	},

	init(arenaId, data) {
		var uid = DataMng.getUserID();
		this.arenaId = arenaId
		this.board.setBoardSize(data.rows, data.cols, data.mines);
		this.board.initialize();
		this.board.customizeMines(data[uid].minesLocation);
		this.removeEventListener();
		this.addEventListener();

		var playerList = data.playerList;
	},

	gameOver(data) {
		this.removeEventListener();
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