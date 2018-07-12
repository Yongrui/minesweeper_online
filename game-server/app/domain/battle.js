var util = require('util');
var utils = require('../util/utils');
var Arena = require('./arena');
var Board = require('./board');
var Timer = require('./timer');
var pomelo = require('pomelo');
var consts = require('../consts/consts');
var channelUtil = require('../util/channelUtil');

var Battle = function(opts) {
	Arena.call(this, opts);

	this.arenaType = consts.ArenaType.BATTLE;
	this.playerMaxNum = 2;
	this.board = null;
	this.flags = {};
	this.timer = new Timer({
		arena: this,
		interval: 100
	});
};

util.inherits(Battle, Arena);
module.exports = Battle;

Battle.prototype.uncoverSquare = function(currUID, row, col) {
	if (currUID !== this.currentRoundUID) {
		return consts.ARENA.FAILED;
	}
	this.board.boardId = currUID;
	this.remarkPlayerFlags(currUID);

	var result = this.board.uncoverSquare(row, col);
	if (result === consts.ARENA.FAILED || result === consts.ARENA.EXPLODED) {
		return consts.ARENA.FAILED;
	}

	var _this = this;
	var msg = this.toJSON4UncoverSquare(currUID, row, col);
	this.pushMessage2All('battle.onUncoverSquare', msg, function(err) {
		_this.resetRound();
	});

	return consts.ARENA.OK;
};

Battle.prototype.clearAround = function(currUID, row, col) {
	if (currUID !== this.currentRoundUID) {
		return consts.ARENA.FAILED;
	}
	this.board.boardId = currUID;
	this.remarkPlayerFlags(currUID);

	if (!this.board.clearAround(row, col)) {
		return consts.ARENA.FAILED;
	}

	var _this = this;
	var msg = this.toJSON4UncoverSquare(currUID, row, col);
	this.pushMessage2All('battle.onClearAround', msg, function() {
		_this.resetRound();
	});
	return consts.ARENA.OK;
};

Battle.prototype.markWithFlag = function(currUID, row, col) {
	this.remarkPlayerFlags(currUID);

	var result = this.board.markWithFlag(row, col);
	if (result === consts.ARENA.FAILED) {
		return consts.ARENA.FAILED;
	}

	var mineLocation = utils.calculateMineLocation(this.board, row, col);
	if (result === consts.ARENA.MARK_FLAG) {
		this.flags[currUID][mineLocation] = true;
	} else {
		this.flags[currUID][mineLocation] = false;
	}

	var msg = this.toJSON4UncoverSquare(currUID, row, col);
	this.pushMessage2Player(currUID, 'battle.onMarkWithFlag', msg, null);

	return consts.ARENA.OK;
};

Battle.prototype.remarkPlayerFlags = function(uid) {
	var _this = this;
	this.board.visitSquares(function(square) {
		var location = utils.calculateMineLocation(_this.board, square.row, square.col);
		var result = square.markWithFlag(!!_this.flags[uid][location]);
		if (result === consts.ARENA.FAILED) {
			_this.flags[uid][location] = false;
		}
	});
};

Battle.prototype.openSquare = function(uid, row, col) {
	this.board.openSquare(row, col);
};

Battle.prototype.isPlaying = function() {
	return this.timer.isRunning();
};

Battle.prototype.resetRound = function() {
	this.timer.resetRound();
	var lastRound = this.currentRoundUID;
	for (var uid in this.players) {
		if (lastRound !== uid) {
			this.currentRoundUID = uid;
			break;
		}
	}
	this.pushMessage2All('battle.onChangeRound', {
		currentUID: this.currentRoundUID
	}, null);
};

Battle.prototype.gameOver = function(winUID, loseUID, isExplode, row, col) {
	this.timer.close();
	this.pushMessage2All('battle.gameOver', {
		win: winUID,
		lose: loseUID,
		isExplode: isExplode,
		row: row,
		col: col
	}, null);
};

Battle.prototype.explode = function(loseUID, row, col) {
	var winUID;
	for (var uid in this.players) {
		if (uid !== loseUID) {
			winUID = uid;
			break;
		}
	}
	this.gameOver(winUID, loseUID, true, row, col);
};

Battle.prototype.finish = function(winUID) {
	var loseUID;
	for (var uid in this.players) {
		if (uid !== winUID) {
			loseUID = uid;
			break;
		}
	}
	this.gameOver(winUID, loseUID, false);
};

Battle.prototype.regenerateMines = function() {
	var minesLocation = this.board.getMinesLocation();
	this.pushMessage2All('battle.onRegenerateMines', {minesLocation: minesLocation}, null);
};

Battle.prototype.start = function() {
	if (this.playerNum < this.playerMaxNum) {
		return consts.ARENA.NOT_ENOUGH_PLAYER;
	}

	if (this.isPlaying()) {
		return consts.ARENA.FAILED;
	}

	var rows = 15;
	var cols = 12;
	var mines = 25;
	var opts = {
		rows: rows,
		cols: cols,
		mines: mines,
		arena: this
	};
	var tmpBoard = new Board(opts);
	tmpBoard.initialize();
	tmpBoard.generateMines();
	this.board = tmpBoard;
	this.flags = {};
	var playerList = [];
	for (var uid in this.players) {
		playerList.push(uid);
		this.flags[uid] = {}
	}
	this.resetRound();
	this.timer.run();

	var msg = tmpBoard.toJSON();
	msg.playerList = playerList;
	msg.currentRound = this.currentRoundUID;
	this.pushMessage2All('battle.onStartGame', msg, null);

	return consts.ARENA.OK;
};

Battle.prototype.getPlayerFlagsLocation = function(currUID) {
	var flagsLocation = {};
	var flags = this.flags[currUID];
	for (var location in flags) {
		if (flags[location]) {
			flagsLocation[location] = true;
		}
	}
	return flagsLocation;
};

Battle.prototype.toJSON4UncoverSquare = function(currUID, row, col) {
	return {
		row: row,
		col: col,
		uid: currUID,
		flags: this.getPlayerFlagsLocation(currUID)
	};
};