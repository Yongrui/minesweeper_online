cc.Class({
	extends: cc.Component,

	properties: {
		nodeOwner: cc.Node,
		lblUser: cc.Label
	},

	init() {
		this.clear();
	},

	setUser(uid, isOwner) {
		this.blank = false;
		this.uid = uid;
		this.lblUser.string = uid;
		this.setOwnerTag(isOwner);
	},

	setOwnerTag(isOwner) {
		this.nodeOwner.active = !!isOwner;
	},

	clear() {
		this.blank = true;
		this.uid = undefined;
		this.lblUser.string = '';
		this.nodeOwner.active = false;
	}
});