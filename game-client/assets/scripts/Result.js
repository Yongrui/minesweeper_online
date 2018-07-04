cc.Class({
	extends: cc.Component,

	properties: {
		result: cc.Label,
		tips: cc.Node,
		mask: cc.Node,
		panelRoom: cc.Node
	},

	init(isWon, panelArena) {
		if (isWon) {
			this.result.string = 'victory';
		} else {
			this.result.string = 'defeated';
		}
		this.panelArena = panelArena;

		this.tips.opacity = 0;
		var actionFadeIn = cc.fadeTo(1, 150);
		var cbFadeIn = cc.callFunc(this.addTouchEvent, this);
		this.tips.runAction(cc.sequence(actionFadeIn, cbFadeIn));
	},

	backToRoom() {
		this.removeTouchEvent();
		this.getComponent('PanelTransition').hide();
		if (!!this.panelArena) {
			this.panelArena.getComponent('PanelTransition').hide();
		}
		this.panelRoom.getComponent('PanelTransition').show();
	},

	addTouchEvent() {
		this.mask.on(cc.Node.EventType.TOUCH_END, this.backToRoom, this);
	},

	removeTouchEvent() {
		this.mask.off(cc.Node.EventType.TOUCH_END, this.backToRoom, this);
	}
});