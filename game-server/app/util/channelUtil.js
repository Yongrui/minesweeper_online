var ChannelUtil = module.exports;

var GLOBAL_CHANNEL_NAME = 'pomelo';
var ARENA_CHANNEL_PREFIX = 'arena_';

ChannelUtil.getGlobalChannelName = function() {
	return GLOBAL_CHANNEL_NAME;
};

ChannelUtil.getArenaChannelName = function(arenaId) {
	return ARENA_CHANNEL_PREFIX + arenaId;
};