var SquareRO = function(row, col) {
	this.isRevealed = false;
	this.flaggedAsMine = false;
	this.isMine = false;
	this.number = 0;
	this.row = row;
	this.col = col;
};

module.exports = SquareRO;