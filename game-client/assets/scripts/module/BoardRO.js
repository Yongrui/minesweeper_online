var Board = function(opts) {
	this.uid = opts.uid;
	this.rows = opts.rows;
	this.cols = opts.cols;
	this.mines = opts.mines;
	this.squaresRevealed = 0;
	this.minesFlagged = 0;
};

module.exports = Board;