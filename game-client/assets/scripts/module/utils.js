var utils = module.exports;

// 非负整数
utils.isNNINT = function(n) {
    return /^\d+$/.test(n);
};

utils.requestAnimFrame = function(callback) {
    setTimeout(callback, 1000 / 60);
};

utils.calculateMineLocation = function(board, row, col) {
	return row * board.cols + col;
};

utils.calculateMineCoordinate = function(board, mineLocation) {
	var row = Math.floor(mineLocation / board.cols);
	var col = mineLocation % board.cols;
	return {row: row, col: col};
};