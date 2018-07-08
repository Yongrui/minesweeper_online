cc.Class({
	extends: cc.Component,

	properties: {
		battleResult: cc.Label,
		tips: cc.Node,
		mask: cc.Node,
		panelRoom: cc.Node,
		raceResultContainer: cc.Node,
		raceResultItem: cc.Prefab,
	},

	showBattleResult(isWon, panelArena) {
		this.battleResult.node.active = true;
		this.raceResultContainer.active = false;
		if (isWon) {
			this.battleResult.string = 'victory';
		} else {
			this.battleResult.string = 'defeated';
		}
		this.panelArena = panelArena;
		this.showReturnTips();
	},

	showRaceResult(resultData, panelArena) {
		this.battleResult.node.active = false;
		this.raceResultContainer.active = true;
		this.raceResultContainer.removeAllChildren();
		this.panelArena = panelArena;

		for (let uid in resultData) {
			let result = resultData[uid];
			let item = cc.instantiate(this.raceResultItem);
			item.getComponent('RaceResultItem').init(uid, result.result, result.second);
			this.raceResultContainer.addChild(item);
		}
		this.showReturnTips();
	},

	showReturnTips() {
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