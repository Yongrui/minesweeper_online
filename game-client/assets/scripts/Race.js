var Arena = require('./Arena');
var utils = require('./module/utils');
var DataMng = require('./module/DataMng');

cc.Class({
	extends: Arena,

	properties: {
		userContainer: cc.Node,
		userItem: cc.Prefab,
		panelResult: cc.Node
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
		pomelo.on('race.onExploded', function(data) {
			cc.log('race.onExploded', data);
			if (data.uid === DataMng.getUserID()) {
				_this.removeEventListener();
				_this.board.explode(data.row, data.col);
			}
			_this.showUserResult(data.uid, false);
		});
		pomelo.on('race.onFinished', function(data) {
			cc.log('race.onFinished', data);
			if (data.uid === DataMng.getUserID()) {
				_this.removeEventListener();
				_this.board.uncoverAllMines();
			}
			_this.showUserResult(data.uid, true);
		});
	},

	init(arenaId, data) {
		var uid = DataMng.getUserID();
		this.arenaId = arenaId
		this.board.setBoardSize(data.rows, data.cols, data.mines);
		this.board.initialize();
		this.board.customizeMines(data.boards[uid].minesLocation);
		this.removeEventListener();
		this.addEventListener();

		var playerList = [];
		for (let uid in data.boards) {
			playerList.push(uid);
		}

		this.userItems = {};
		this.userContainer.removeAllChildren();
		for (let i = 0; i < playerList.length; i++) {
			let item = cc.instantiate(this.userItem).getComponent('RaceUserItem');
			this.userContainer.addChild(item.node);
			let uid = playerList[i];
			item.init(uid);
			this.userItems[uid] = item;
		}
	},

	showUserResult(uid, isWon) {
		this.userItems[uid].showResult(isWon);
	},

	gameOver(data) {
		this.removeEventListener();

		this.scheduleOnce(function() {
			this.panelResult.getComponent('PanelTransition').show();
			this.panelResult.getComponent('Result').showRaceResult(data, this.node);
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