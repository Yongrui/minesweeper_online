var util = require('util');
var utils = require('../util/utils');
var Arena = require('./arena');
var Board = require('./board');
var Timer = require('./timer');
var pomelo = require('pomelo');
var consts = require('../consts/consts');
var channelUtil = require('../util/channelUtil');

var Race = function(opts) {
	Arena.call(this, opts);

	this.arenaType = consts.ArenaType.RACE;
	this.playerMaxNum = 6;
	this.boards = {};
	this.finish = {};
	this.finishNum = 0;
	this.timer = new Timer({
		arena: this,
		interval: 100
	});
};

util.inherits(Race, Arena);
module.exports = Race;

Race.prototype.uncoverSquare = function(currUID, row, col) {
	var result = this.boards[currUID].uncoverSquare(row, col);
	if (result === consts.ARENA.FAILED || result === consts.ARENA.EXPLODED) {
		return consts.ARENA.FAILED;
	}

	var msg = this.toJSON4UncoverSquare(row, col);
	this.pushMessage2Player(currUID, 'race.onUncoverSquare', msg, null);
	return consts.ARENA.OK;
};

Race.prototype.clearAround = function(currUID, row, col) {
	if (!this.boards[currUID].clearAround(row, col)) {
		return consts.ARENA.FAILED;
	}

	var msg = this.toJSON4UncoverSquare(row, col);
	this.pushMessage2Player(currUID, 'race.onClearAround', msg, null);
	return consts.ARENA.OK;
};

Race.prototype.markWithFlag = function(currUID, row, col) {
	var result = this.boards[currUID].markWithFlag(row, col);
	if (result === consts.ARENA.FAILED) {
		return consts.ARENA.FAILED;
	}

	var msg = this.toJSON4UncoverSquare(row, col);
	this.pushMessage2Player(currUID, 'race.onMarkWithFlag', msg, null);
	return consts.ARENA.OK;
};

Race.prototype.isPlaying = function() {
	return this.timer.isRunning();
};

Race.prototype.gameOver = function() {
	this.timer.close();
	this.pushMessage2All('race.gameOver', {
	}, null);
};

Race.prototype.explode = function(loseUID, row, col) {
	this.finishNum++;
	this.finish[loseUID] = {second: 1, result: 0};
	var msg = this.toJSON4UncoverSquare(loseUID, row, col);
	this.pushMessage2Player(loseUID, 'race.onExploded', msg, null);
};

Race.prototype.win = function(winUID) {
	this.finishNum++;
	this.finish[winUID] = {second: 1, result: 1};
	var msg = this.toJSON4UncoverSquare(loseUID, row, col);
	this.pushMessage2Player(loseUID, 'race.onWin', msg, null);

	if (this.finishNum == this.playerNum) {
		this.gameOver();
	}
};

Race.prototype.regenerateMines = function(currUID) {
	var minesLocation = this.boards[currUID].getMinesLocation();
	this.pushMessage2Player(currUID, 'race.onRegenerateMines', {minesLocation: minesLocation}, null);
};

Race.prototype.start = function() {
	// if (this.playerNum < 2) {
	// 	return consts.ARENA.NOT_ENOUGH_PLAYER;
	// }

	if (this.isPlaying()) {
		return consts.ARENA.FAILED;
	}

	var rows = 12;
	var cols = 10;
	var mines = 12;
	var opts = {
		rows: 12,
		cols: 10,
		mines: 12,
		arena: this
	};
	this.finishNum = 0;
	this.finish = {};
	this.boards = {};
	for (var uid in this.players) {
		opts.boardId = uid;
		var tmpBoard = new Board(opts);
		tmpBoard.initialize();
		tmpBoard.generateMines();
		this.boards[uid] = tmpBoard;
	}
	this.timer.run();
	var msg = {
		rows: rows,
		cols: cols,
		mines: mines
	}
	for (var uid in this.boards) {
		msg[uid] = this.boards[uid];
	}
	this.pushMessage2All('race.onStartGame', msg, null);

	return consts.ARENA.OK;
};

Race.prototype.toJSON4UncoverSquare = function(row, col) {
	return {
		row: row,
		col: col,
	};
};