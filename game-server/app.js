var pomelo = require('pomelo');
var arenaManager = require('./app/services/arenaManager');
var ChatService = require('./app/services/chatService');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'minesweeper_online');

// app configuration
app.configure('production|development', 'connector', function() {
	app.set('connectorConfig', {
		connector: pomelo.connectors.hybridconnector,
		heartbeat: 3,
		useDict: true,
		useProtobuf: true
	});
});

app.configure('production|development', 'gate', function() {
	app.set('connectorConfig', {
		connector: pomelo.connectors.hybridconnector,
		useProtobuf: true
	});
});

// Configure for chat server
app.configure('production|development', 'chat', function() {
	app.set('chatService', new ChatService(app));
});

// Configure for arena server
app.configure('production|development', 'arena', function(){
	app.arenaManager = arenaManager;
});

// start app
app.start();

process.on('uncaughtException', function(err) {
	console.error(' Caught exception: ' + err.stack);
});