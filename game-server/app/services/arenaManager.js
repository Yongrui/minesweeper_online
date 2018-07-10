var consts = require('../consts/consts');
var Battle = require('../domain/battle');
var Arena = require('../domain/arena');
var Race = require('../domain/race');

var gID = 0;
var gArenaObjDict = {};
var gUIDMap = {};

var exp = module.exports;

exp.createArena = function(data) {
	var result = consts.ARENA.FAILED;
	var arenaObj;
	if (data.arenaType === consts.ArenaType.BATTLE) {
		arenaObj = new Battle({arenaId: ++gID});
		result = arenaObj.addPlayer(data, true);
	} else if (data.arenaType == consts.ArenaType.RACE) {
		arenaObj = new Race({arenaId: ++gID});
		result = arenaObj.addPlayer(data, true);
	}
	if (result == consts.ARENA.OK) {
		gArenaObjDict[arenaObj.arenaId] = arenaObj;
		gUIDMap[data.uid] = arenaObj.arenaId;
	}
	return {result: result, arena: arenaObj};
};

exp.getArenaById = function(id) {
	var arenaObj = gArenaObjDict[id];
	return arenaObj || null;
};

exp.applyJoinArena = function(data) {
	var result = consts.ARENA.FAILED;
	if (!data.arenaId) {
		return {result: result};
	}
	var arenaObj = gArenaObjDict[data.arenaId];
	if (!!arenaObj && !arenaObj.isPlaying()) {
		result = arenaObj.addPlayer(data);
		if (result === consts.ARENA.OK) {
			gUIDMap[data.uid] = data.arenaId;
		}
	}
	return {result: result, arena: arenaObj};
};

exp.leaveArena = function(arenaId, uid) {
	var result = consts.ARENA.FAILED;
	if (!arenaId) {
		return {result: result};
	}
	var arenaObj = gArenaObjDict[arenaId];
	if (!!arenaObj) {
		result = arenaObj.removePlayer(uid);
		if (result === consts.ARENA.NEED_DISBAND) {
			delete gArenaObjDict[arenaId];
		}
		if (result !== consts.ARENA.FAILED) {
			delete gUIDMap[uid];
		}
	}
	return {result: result, arenaId: arenaId};
};

exp.kick = function(uid) {
	var arenaId = gUIDMap[uid];
	this.leaveArena(arenaId, uid);
};

exp.getArenasByType = function (arenaType) {
	var ret = [];
	for (var id in gArenaObjDict) {
		var obj = gArenaObjDict[id];
		if (arenaType == obj.arenaType && ret.length < 100) {
			ret.push(obj);
		}
		if (ret.length >= 100) {
			break;
		}
	}
	return ret;
};

exp.getAllArenas = function () {
	var ret = [];
	for (var id in gArenaObjDict) {
		var obj = gArenaObjDict[id];
		if (ret.length < 100) {
			ret.push(obj);
		}
		if (ret.length >= 100) {
			break;
		}
	}
	return ret;
};

exp.startGame = function (uid, arenaId) {
	var result = consts.ARENA.FAILED;
	var arenaObj = gArenaObjDict[arenaId];
	if (!arenaObj) {
		return {result: result};
	}
	if (!arenaObj.isArenaOwner(uid) || arenaObj.isPlaying()) {
		return {result: result};
	}
	result = arenaObj.start();
	return {result: result};
};

exp.openSquare = function (uid, arenaId, row, col) {
	var result = consts.ARENA.FAILED;
	var arenaObj = gArenaObjDict[arenaId];
	if (!arenaObj) {
		return {result: result};
	}
	if (!arenaObj.isPlayerInArena(uid) || !arenaObj.isPlaying()) {
		return {result: result};
	}
	result = arenaObj.openSquare(uid, row, col);
	return {result: result};
};

exp.uncoverSquare = function (uid, arenaId, row, col) {
	var result = consts.ARENA.FAILED;
	var arenaObj = gArenaObjDict[arenaId];
	if (!arenaObj) {
		return {result: result};
	}
	if (!arenaObj.isPlayerInArena(uid) || !arenaObj.isPlaying()) {
		return {result: result};
	}
	result = arenaObj.uncoverSquare(uid, row, col);
	return {result: result};
};

exp.clearAround = function (uid, arenaId, row, col) {
	var result = consts.ARENA.FAILED;
	var arenaObj = gArenaObjDict[arenaId];
	if (!arenaObj) {
		return {result: result};
	}
	if (!arenaObj.isPlayerInArena(uid) || !arenaObj.isPlaying()) {
		return {result: result};
	}
	result = arenaObj.clearAround(uid, row, col);
	return {result: result};
};

exp.markWithFlag = function (uid, arenaId, row, col) {
	var result = consts.ARENA.FAILED;
	var arenaObj = gArenaObjDict[arenaId];
	if (!arenaObj) {
		return {result: result};
	}
	if (!arenaObj.isPlayerInArena(uid) || !arenaObj.isPlaying()) {
		return {result: result};
	}
	result = arenaObj.markWithFlag(uid, row, col);
	return {result: result};
};