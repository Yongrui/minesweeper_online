cc.Class({
	extends: cc.Component,

	properties: {
		lblRoomName: cc.Label,
		lblPlayerNum: cc.Label,
		lblPlayerMaxNum: cc.Label,
		nodeStatus: cc.Node
	},

	init(room, panelRoom) {
		this.lblRoomName.string = room.owner;
		this.room = room;
		this.panelRoom = panelRoom;
		this.nodeStatus.active = room.playing;
		this.lblPlayerMaxNum.string = room.playerMaxNum;
		this.lblPlayerNum.string = room.players.length;
	},

	setRoomStatus(playing) {
		this.nodeStatus.active = playing;
	},

	applyJoinRoom() {
		if (!this.room) {
			return;
		}
		var msg = {
			arenaId: this.room.arenaId
		};
		var _this = this;
		pomelo.request('arena.arenaHandler.applyJoinArena', msg, function(data) {
			cc.log('arena.arenaHandler.applyJoinArena', data);
			if (data.result == 1) {
				_this.panelRoom.getComponent('PanelTransition').show();
				_this.panelRoom.getComponent('Room').init(data.arena);
			}
		});
	}
});