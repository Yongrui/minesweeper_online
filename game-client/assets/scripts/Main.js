var consts = require('./module/consts');

cc.Class({
	extends: cc.Component,

	properties: {
		panelRoomList: cc.Node,
		panelPractice: cc.Node,
	},

	showBattleRoomList() {
		this.getComponent('PanelTransition').hide();
		this.panelRoomList.getComponent('PanelTransition').show();
		this.panelRoomList.getComponent('RoomList').init(consts.ArenaType.BATTLE);
	},

	showRaceRoomList() {
		this.getComponent('PanelTransition').hide();
		this.panelRoomList.getComponent('PanelTransition').show();
		this.panelRoomList.getComponent('RoomList').init(consts.ArenaType.RACE);
	},

	showPractice() {
		this.getComponent('PanelTransition').hide();
		this.panelPractice.getComponent('PanelTransition').show();
	},

	closePractice() {
		this.getComponent('PanelTransition').show();
		this.panelPractice.getComponent('PanelTransition').hide();
	},

	closeRoomList() {
		this.getComponent('PanelTransition').show();
		this.panelRoomList.getComponent('PanelTransition').hide();
	}
});
