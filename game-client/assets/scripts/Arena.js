cc.Class({
	extends: cc.Component,

	properties: {
		board: cc.Node
	},

	start() {
		this.board = this.board.getComponent("Board");
		this.board.game = this;
	},

	addEventListener() {
		this.board.node.on('long-touch', this._longTouch, this);
		this.board.node.on('short-touch', this._shortTouch, this);
	},

	removeEventListener() {
		this.board.node.off('long-touch', this._longTouch, this);
		this.board.node.off('short-touch', this._shortTouch, this);
	},

	_longTouch(touch) {},

	_shortTouch(touch) {},

	loseGame() {},

	winGame() {},

});