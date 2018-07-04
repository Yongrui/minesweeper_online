var channelUtil = require('../../../util/channelUtil');
var consts = require('../../../consts/consts');

module.exports = function(app) {
	return new ChannelHandler(app, app.get('chatService'));
};

var ChannelHandler = function(app, chatService) {
	this.app = app;
	this.chatService = chatService;
};

function setContent(str) {
	str = str.replace(/<\/?[^>]*>/g, '');
	str = str.replace(/[ | ]*\n/g, '\n');
	return str.replace(/\n[\s| | ]*\r/g, '\n');
}

ChannelHandler.prototype.send = function(msg, session, next) {
	var uid = session.uid;
	var channelName = getChannelName(msg);
	msg.content = setContent(msg.content);
	var content = {
		msg: msg.content,
		from: msg.from
	}
	this.chatService.pushByChannel(channelName, content, function(err, res) {
		if (err) {
			code = consts.CHAT.FAIL;
		} else if (res) {
			code = res;
		} else {
			code = consts.CHAT.OK;
		}

		next(null, {
			code: code
		});
	});
};

var getChannelName = function(msg) {
	if (!!msg.arenaId) {
		return channelUtil.getArenaChannelName(msg.arenaId);
	}
	return channelUtil.getGlobalChannelName();
};