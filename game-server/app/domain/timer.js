var Timer = function(opts) {
	this.arena = opts.arena;
	this.interval = opts.interval || 100;
	this.roundTime = opts.roundTime || 5000;
	this.leftTimeCurrRound = this.roundTime
	this.tickCount = 0;
	this.running = false;
};

module.exports = Timer;

Timer.prototype.run = function() {
	this.handle = setInterval(this.tick.bind(this), this.interval);
	this.running = true;
};

Timer.prototype.close = function() {
	clearInterval(this.handle);
	this.running = false;
};

Timer.prototype.tick = function() {
	// this.tickCount += 1;
	// if (!!this.roundTime) {
	// 	this.leftTimeCurrRound -= this.interval;
	// 	if (this.leftTimeCurrRound <= 0) {
	// 		this.arena.resetRound();
	// 	}
	// }
};

Timer.prototype.isRunning = function() {
	return this.running;
};

Timer.prototype.resetRound = function() {
	this.leftTimeCurrRound = this.roundTime;
};