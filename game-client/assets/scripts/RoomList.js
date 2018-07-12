cc.Class({
	extends: cc.Component,

	properties: {
		scrollView: cc.ScrollView,
		roomItem: cc.Prefab,
		panelRoom: cc.Node
	},

	// start() {
	// 	this.node.on('fade-in', function() {
	// 		this.requestAllArenas();
	// 	}, this);

	// 	this.panelRoom.on('fade-out', function() {
	// 		this.requestAllArenas();
	// 	}, this);
	// },

	init(arenaType) {
		this.arenaType = arenaType;
		this.scrollView.content.removeAllChildren();
		this.requestArenasByType(arenaType);
	},

	requestArenasByType(arenaType) {
		var _this = this;
		pomelo.request('arena.arenaHandler.getArenasByType', {arenaType: arenaType}, function(data) {
			cc.log('arena.arenaHandler.getArenasByType', data);
			if (data.code == 200) {
				_this.genrateRoomItems(data.arenas);
			}
		});
	},

	requestAllArenas() {
		var _this = this;
		pomelo.request('arena.arenaHandler.getAllArenas', function(data) {
			cc.log('arena.arenaHandler.getAllArenas', data);
			if (data.code == 200) {
				_this.genrateRoomItems(data.arenas);
			}
		});
	},

	genrateRoomItems(arenas) {
		this.scrollView.content.removeAllChildren();
		for (var i = 0; i < arenas.length; i++) {
			var arena = arenas[i];
			var item = cc.instantiate(this.roomItem);
			this.scrollView.content.addChild(item);
			item.getComponent('RoomItem').init(arena, this.panelRoom);
		}
	},

	newRoom() {
		var _this = this;
		pomelo.request('arena.arenaHandler.createArena', {arenaType: this.arenaType}, function(data) {
			cc.log('arena.arenaHandler.createArena', data);
			if (data.result == 1) {
				_this.panelRoom.getComponent('PanelTransition').show();
				_this.panelRoom.getComponent('Room').init(data.arena);
			}
		});
	},

	refreshRoomList() {
		this.requestArenasByType(this.arenaType);
	}
});