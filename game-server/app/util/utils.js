var utils = module.exports;

/**
 * Check and invoke callback function
 */
utils.invokeCallback = function(cb) {
	if (!!cb && typeof cb === 'function') {
		cb.apply(null, Array.prototype.slice.call(arguments, 1));
	}
};

/**
 * clone an object
 */
utils.clone = function(origin) {
	if (!origin) {
		return;
	}

	var obj = {};
	for (var f in origin) {
		if (origin.hasOwnProperty(f)) {
			obj[f] = origin[f];
		}
	}
	return obj;
};

utils.size = function(obj) {
	if (!obj) {
		return 0;
	}

	var size = 0;
	for (var f in obj) {
		if (obj.hasOwnProperty(f)) {
			size++;
		}
	}

	return size;
};

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