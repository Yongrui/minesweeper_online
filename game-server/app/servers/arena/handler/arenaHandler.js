var utils = require('../../../util/utils');
var consts = require('../../../consts/consts');
var dispatcher = require('../../../util/dispatcher');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

Handler.prototype.createArena = function(msg, session, next) {
	var uid = session.uid;
	var sid = getSidByUid(uid, this.app);
	if (!sid) {
		next(null, {
			code: 500,
			result: consts.ARENA.FAILED
		});
		return;
	}
	var data = {
		uid: uid,
		sid: sid,
		arenaType: msg.arenaType
	};
	var arenaManager = this.app.arenaManager;
	var ret = arenaManager.createArena(data);
	next(null, {
		code: 200,
		result: ret.result,
		arena: ret.arena
	});
};

Handler.prototype.applyJoinArena = function(msg, session, next) {
	var uid = session.uid;
	var sid = getSidByUid(uid, this.app);
	if (!sid) {
		next(null, {
			code: 500,
			result: consts.ARENA.FAILED
		});
		return;
	}
	var data = {
		uid: uid,
		sid: sid,
		arenaId: msg.arenaId
	};
	var arenaManager = this.app.arenaManager;
	var ret = arenaManager.applyJoinArena(data);
	next(null, {
		code: 200,
		result: ret.result,
		arena: ret.arena
	});
};

Handler.prototype.leaveArena = function(msg, session, next) {
	var uid = session.uid;
	var arenaManager = this.app.arenaManager;
	var ret = arenaManager.leaveArena(msg.arenaId, uid);
	next(null, {
		code: 200,
		result: ret.result,
		arenaId: ret.arenaId
	});
};

Handler.prototype.getArenasByType = function(msg, session, next) {
	var arenaManager = this.app.arenaManager;
	var ret = arenaManager.getArenasByType(msg.arenaType);
	next(null, {
		code: 200,
		arenas: ret
	});
};

Handler.prototype.getAllArenas = function(msg, session, next) {
	var arenaManager = this.app.arenaManager;
	var ret = arenaManager.getAllArenas();
	next(null, {
		code: 200,
		arenas: ret
	});
};

Handler.prototype.startGame = function(msg, session, next) {
	var uid = session.uid;
	var arenaId = msg.arenaId;
	if (!arenaId) {
		next(null, {
			code: 500,
			result: consts.ARENA.FAILED
		});
		return;
	}
	var arenaManager = this.app.arenaManager;
	var ret = arenaManager.startGame(uid, arenaId);
	next(null, {
		code: 200,
		result: ret.result
	});
};

Handler.prototype.openSquare = function(msg, session, next) {
	var uid = session.uid;
	var arenaId = msg.arenaId;
	var row = msg.row;
	var col = msg.col;
	if (!!arenaId && utils.isNNINT(row) && utils.isNNINT(row)) {}
	next();
};

Handler.prototype.uncoverSquare = function(msg, session, next) {
	var uid = session.uid;
	var arenaId = msg.arenaId;
	var row = msg.row;
	var col = msg.col;
	if (!!arenaId && utils.isNNINT(row) && utils.isNNINT(col)) {
		this.app.arenaManager.uncoverSquare(uid, arenaId, row, col);
	}
	next();
};

Handler.prototype.clearAround = function(msg, session, next) {
	var uid = session.uid;
	var arenaId = msg.arenaId;
	var row = msg.row;
	var col = msg.col;
	if (!!arenaId && utils.isNNINT(row) && utils.isNNINT(col)) {
		this.app.arenaManager.clearAround(uid, arenaId, row, col);
	}
	next();
};

Handler.prototype.markWithFlag = function(msg, session, next) {
	var uid = session.uid;
	var arenaId = msg.arenaId;
	var row = msg.row;
	var col = msg.col;
	if (!!arenaId || utils.isNNINT(row) && utils.isNNINT(col)) {
		this.app.arenaManager.markWithFlag(uid, arenaId, row, col);
	}
	next();
};

/**
 * Get the connector server id assosiated with the uid
 */
var getSidByUid = function(uid, app) {
	var connector = dispatcher.dispatch(uid, app.getServersByType('connector'));
	if (connector) {
		return connector.id;
	}
	return null;
};