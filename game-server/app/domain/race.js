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
	this.finished = {};
	this.finishedNum = 0;
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

	var msg = this.toJSON4UncoverSquare(currUID, row, col);
	this.pushMessage2Player(currUID, 'race.onUncoverSquare', msg, null);
	return consts.ARENA.OK;
};

Race.prototype.clearAround = function(currUID, row, col) {
	if (!this.boards[currUID].clearAround(row, col)) {
		return consts.ARENA.FAILED;
	}

	var msg = this.toJSON4UncoverSquare(currUID, row, col);
	this.pushMessage2Player(currUID, 'race.onClearAround', msg, null);
	return consts.ARENA.OK;
};

Race.prototype.markWithFlag = function(currUID, row, col) {
	var result = this.boards[currUID].markWithFlag(row, col);
	if (result === consts.ARENA.FAILED) {
		return consts.ARENA.FAILED;
	}

	var msg = this.toJSON4UncoverSquare(currUID, row, col);
	this.pushMessage2Player(currUID, 'race.onMarkWithFlag', msg, null);
	return consts.ARENA.OK;
};

Race.prototype.isPlaying = function() {
	return this.timer.isRunning();
};

Race.prototype.gameOver = function() {
	this.timer.close();
	this.pushMessage2All('race.gameOver', this.finished, null);
};

Race.prototype.explode = function(loseUID, row, col) {
	this.finishedNum++;
	var seconds = this.timer.tickDuration / 1000;
	this.finished[loseUID] = {second: seconds, result: 0};
	var msg = this.toJSON4UncoverSquare(loseUID, row, col);
	this.pushMessage2All('race.onExploded', msg, null);

	if (this.finishedNum == this.playerNum) {
		this.gameOver();
	}
};

Race.prototype.finish = function(winUID, row, col) {
	this.finishedNum++;
	var seconds = this.timer.tickDuration / 1000;
	this.finished[winUID] = {second: seconds, result: 1};
	var msg = this.toJSON4UncoverSquare(winUID, row, col);
	this.pushMessage2All('race.onFinished', msg, null);

	if (this.finishedNum == this.playerNum) {
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

	var rows = 15;
	var cols = 12;
	var mines = 25;
	var opts = {
		rows: rows,
		cols: cols,
		mines: mines,
		arena: this
	};
	this.finishedNum = 0;
	this.finished = {};
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
	msg.boards = {};
	for (var uid in this.boards) {
		msg.boards[uid] = this.boards[uid];
	}
	this.pushMessage2All('race.onStartGame', msg, null);

	return consts.ARENA.OK;
};

Race.prototype.toJSON4UncoverSquare = function(uid, row, col) {
	return {
		row: row,
		col: col,
		uid: uid
	};
};