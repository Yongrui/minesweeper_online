var DataMng = require('./module/DataMng');
var consts = require('./module/consts');

cc.Class({
	extends: cc.Component,

	properties: {
		btnStart: cc.Node,
		btnReady: cc.Node,
		panelBattle: cc.Node,
		panelRace: cc.Node,
		userContainer: cc.Node,
		userItem: cc.Prefab
	},

	start() {
		var _this = this;
		pomelo.on('onAddRoomMember', function(data) {
			cc.log('onAddRoomMember', data);
			if (_this.node.showIn) {
				_this.addplayer(data.player, false);
			}
		});
		pomelo.on('onRemoveRoomMember', function(data) {
			cc.log('onRemoveRoomMember', data);
			_this.removeplayer(data.player, data.owner);
		});
		pomelo.on('battle.onStartGame', function (data) {
			cc.log('battle.onStartGame', data);
			_this.getComponent('PanelTransition').hide();
			_this.panelBattle.getComponent('PanelTransition').show();
			_this.panelBattle.getComponent('Battle').init(_this.arena.arenaId, data);
		});
		pomelo.on('race.onStartGame', function (data) {
			cc.log('race.onStartGame', data);
			_this.getComponent('PanelTransition').hide();
			_this.panelRace.getComponent('PanelTransition').show();
			_this.panelRace.getComponent('Race').init(_this.arena.arenaId, data);
		});
	},

	init(arena) {
		this.arena = arena;
		this.userItemArr = [];
		this.userContainer.removeAllChildren();
		for (var i = 0; i < arena.playerMaxNum; i++) {
			var item = cc.instantiate(this.userItem).getComponent('RoomUserItem');
			this.userContainer.addChild(item.node);
			item.init();
			this.userItemArr.push(item);
		}

		var playerList = arena.players;
		for (var i = 0; i < playerList.length; i++) {
			this.addplayer(playerList[i], playerList[i] === arena.owner);
		}

		if (DataMng.getUserID() == arena.owner) {
			this.btnStart.active = true;
		} else {
			this.btnStart.active = false;
		}
		this.btnReady.active = false;
	},

	addplayer(uid, isOwner) {
		for (var i = 0; i < this.userItemArr.length; i++) {
			if (this.userItemArr[i].blank) {
				this.userItemArr[i].setUser(uid, isOwner);
				break;
			}
		}
	},

	removeplayer(uid, owner) {
		for (var i = 0; i < this.userItemArr.length; i++) {
			var user = this.userItemArr[i];
			if (user.uid === uid) {
				user.clear();
			} else if (!user.blank && user.uid === owner) {
				user.setOwnerTag(true);
			}
		}
	},

	prepare() {
		var lblReady = this.btnReady.getComponent('cc.Label')
		if (lblReady.string == 'prepared') {
			lblReady.string = 'prepare';
		} else {
			lblReady.string = 'prepared';
		}
	},

	startGame() {
		pomelo.request('arena.arenaHandler.startGame', {arenaId: this.arena.arenaId}, function(data) {
			cc.log('arena.arenaHandler.startGame', data);
		});
	},

	leave() {
		var _this = this;
		pomelo.request('arena.arenaHandler.leaveArena', {arenaId: this.arena.arenaId}, function(data) {
			cc.log('arena.arenaHandler.leaveArena', data);
			if (data.result !== 0) {
				_this.getComponent('PanelTransition').hide();
			}
		});
	}
});