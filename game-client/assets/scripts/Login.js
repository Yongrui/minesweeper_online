var HOST = '127.0.0.1';
var PORT = '3014';
var LOGIN_ERROR = "There is no server to log in, please wait.";
var LENGTH_ERROR = "Name is too long or too short. 20 character max.";
var NAME_ERROR = "Bad character in Name. Can only have letters, numbers, Chinese characters, and '_'";
var DUPLICATE_ERROR = "Please change your name to login.";

var DataMng = require('./module/DataMng');

cc.Class({
	extends: cc.Component,

	properties: {
		editbox: cc.EditBox,
		lblName: cc.Label,
		panelMain: cc.Node,
		panelDemo: cc.Node
	},

	start() {
		this.getComponent("PanelTransition").show();
	},

	queryEntry(uid, callback) {
		var self = this;
		var route = 'gate.gateHandler.queryEntry';
		pomelo.init({
			host: HOST,
			port: PORT,
			log: true
		}, function() {
			pomelo.request(route, {
				uid: uid
			}, function(data) {
				pomelo.disconnect();
				cc.log('pomelo', route, data);
				if (data.code === 500) {
					self.showError(LOGIN_ERROR);
					return;
				}
				callback(data.host, data.port);
			});
		});
	},

	login() {
		var username = this.editbox.string;
		var reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
		if(username.length > 20 || username.length == 0) {
			this.showError(LENGTH_ERROR);
			return false;
		}

		if(!reg.test(username)) {
			this.showError(NAME_ERROR);
			return false;
		}

		var self = this;
		this.queryEntry(username, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "connector.entryHandler.enter";
				pomelo.request(route, {
					uid: username
				}, function(data) {
					cc.log('pomelo', route, data);
					if(data.error) {
						self.showError(DUPLICATE_ERROR);
						return;
					}
					DataMng.setUserID(data.uid);
					self.setName(data.uid);
				});
			});
		});
	},

	setName(name) {
		this.lblName.string = name;
		this.getComponent("PanelTransition").hide();
		this.panelMain.getComponent("PanelTransition").show();
		// this.panelDemo.getComponent("PanelTransition").show();
	},

	showError(content) {
		cc.log('showError', content);
	}
});