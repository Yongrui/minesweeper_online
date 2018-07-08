cc.Class({
	extends: cc.Component,

	properties: {
		lblUseName: cc.Label,
		mask: cc.Node,
		lblResult: cc.Label,
	},

	init(uid) {
		this.lblUseName.string = uid;
		this.mask.active = false;
		this.lblResult.node.active = false;
	},

	showResult(isWon) {
		this.mask.active = true;
		this.lblResult.node.active = true;
		if (isWon) {
			this.lblResult.string = '完成';
		} else {
			this.lblResult.string = '爆炸';
		}
	}
});