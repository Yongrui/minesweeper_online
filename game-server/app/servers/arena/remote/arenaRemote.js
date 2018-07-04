module.exports = function(app) {
	return new ArenaRemote(app);
};

var ArenaRemote = function(app) {
	this.app = app;
};

/**
 * kick out user
 *
 */
ArenaRemote.prototype.kick = function(uid, cb){
	this.app.arenaManager.kick(uid);
	cb();
};
