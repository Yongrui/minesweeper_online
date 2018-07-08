cc.Class({
	extends: cc.Component,

	properties: {
		lblName: cc.Label,
		lblResult: cc.Label,
		lblTime: cc.Label,
	},

	init(name, isFinish, time) {
		this.lblName.string = name;
		this.lblResult.string = isFinish ? '完成' : '爆炸';
		this.lblTime.string = time + 's';
	}
});