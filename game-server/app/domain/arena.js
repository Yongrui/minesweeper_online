var pomelo = require('pomelo');
var channelUtil = require('../util/channelUtil');
var consts = require('../consts/consts');

var Arena = function(opts) {
	this.arenaId = opts.arenaId;
	this.channel = null;
	this.boards = {};
	this.players = {};
	this.playerMaxNum = 0;
	this.playerNum = 0;
	// this.owner = "owner " + this.arenaId;
	this.createChannel();
}

module.exports = Arena;

Arena.prototype.createChannel = function() {
	if (this.channel) {
		return this.channel;
	}
	var channelName = channelUtil.getArenaChannelName(this.arenaId);
	this.channel = pomelo.app.get('channelService').getChannel(channelName, true);
	if (this.channel) {
		return this.channel;
	}
	return null;
};

Arena.prototype.addPlayer = function(data, isOwner) {
	if (!this.isArenaHasPosition()) {
		return consts.ARENA.NO_POSITION;
	}

	if (this.isPlayerInArena(data.uid)) {
		return consts.ARENA.ALREADY_IN_ARENA;
	}

	this.players[data.uid] = data.sid;
	this.channel.add(data.uid, data.sid);
	this.playerNum++;
	if (!!isOwner) {
		this.owner = data.uid;
	}

	if (this.playerNum > 1) {
		var msg = {
			player: data.uid
		};
		this.pushMessage2All('onAddRoomMember', msg, null);
	}

	return consts.ARENA.OK;
};

Arena.prototype.removePlayer = function(removeUID) {
	if (!this.players[removeUID]) {
		return consts.ARENA.FAILED;
	}
	var sid = this.players[removeUID];
	delete this.players[removeUID];
	this.channel.leave(removeUID, sid);
	this.playerNum--;
	if (!!this.boards[removeUID]) {
		delete this.boards[removeUID];
	}
	if (this.playerNum < 1) {
		this.disbandArena();
		return consts.ARENA.NEED_DISBAND;
	}
	var msg = {
		player: removeUID
	}
	if (this.isArenaOwner(removeUID)) {
		for (var uid in this.players) {
			this.owner = uid;
			msg.owner = uid;
			break;
		}
	}
	this.pushMessage2All('onRemoveRoomMember', msg, null);

	return consts.ARENA.OK;
};

Arena.prototype.disbandArena = function() {

};

Arena.prototype.isArenaHasPosition = function() {
	return this.playerNum < this.playerMaxNum;
};

Arena.prototype.isPlayerInArena = function(uid) {
	return !!this.players[uid];
};

Arena.prototype.isArenaOwner = function(uid) {
	return uid == this.owner;
};

Arena.prototype.isPlaying = function() {
	return false;
};

Arena.prototype.pushMessage2All = function(route, msg, cb) {
	if (!this.channel) {
		return;
	}
	this.channel.pushMessage(route, msg, cb);
};

Arena.prototype.pushMessage2Player = function(uid, route, msg, cb) {
	var sid = this.players[uid];
	pomelo.app.get('channelService').pushMessageByUids(route, msg, [{
		uid: uid,
		sid: sid
	}], cb);
};

Arena.prototype.start = function() {};

Arena.prototype.openSquare = function() {};

Arena.prototype.clearAround = function() {};

Arena.prototype.markWithFlag = function() {};

Arena.prototype.uncoverSquare = function() {};

Arena.prototype.explode = function() {};

Arena.prototype.finish = function() {};

Arena.prototype.resetRound = function() {};
Arena.prototype.onTick = function() {};

Arena.prototype.toJSON = function() {
	var players = [];
	for (var id in this.players) {
		players.push(id);
	}
	return {
		arenaId: this.arenaId,
		arenaType: this.arenaType,
		owner: this.owner,
		players: players,
		playing: this.isPlaying(),
		playerMaxNum: this.playerMaxNum
	};
};