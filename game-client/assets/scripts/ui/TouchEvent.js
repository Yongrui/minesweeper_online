cc.Class({
	extends: cc.Component,

	properties: {
		board: cc.Node
	},

	onLoad() {
		this.board = this.board.getComponent("Board");

		if (cc.sys.isMobile) {
			this.addTouchEventListener();
		} else {
			this.addMouseEventListener();
		}
	},

	addMouseEventListener() {
		this.node.on(cc.Node.EventType.MOUSE_UP, function (event) {
			var currentSquare = this._convTouchSquare(event);
			if (!currentSquare) {
				return;
			}
			if (event.getButton() == cc.Event.EventMouse.BUTTON_LEFT) {
				this.node.emit('short-touch', {currentSquare: currentSquare});
			} else if (event.getButton() == cc.Event.EventMouse.BUTTON_RIGHT) {
				this.node.emit('long-touch', {currentSquare: currentSquare});
			}
		}, this);
	},

	addTouchEventListener() {
		this.node.on(cc.Node.EventType.TOUCH_START, function(touch) {
			var currentSquare = this._convTouchSquare(touch);
			if (!currentSquare) {
				return;
			}
			this.touchDownSquare = currentSquare;
			this.scheduleOnce(this._waitingLongTouch, 0.4);
		}, this);

		this.node.on(cc.Node.EventType.TOUCH_END, function(touch) {
			do {
				if (!!this.isLongTouch) {
					break;
				}

				var currentSquare = this._convTouchSquare(touch);
				if (!currentSquare || !currentSquare.equal(this.touchDownSquare)) {
					break;
				}

				this.node.emit('short-touch', {currentSquare: currentSquare});
			} while (false);

			this.unschedule(this._waitingLongTouch);
			this.touchDownSquare = null;
			this.isLongTouch = false;
		}, this);

		this.node.on(cc.Node.EventType.TOUCH_MOVE, function(touch) {
			var currentSquare = this._convTouchSquare(touch);
			if (!currentSquare || !currentSquare.equal(this.touchDownSquare)) {
				this.unschedule(this._waitingLongTouch);
			}
		}, this);

		this.node.on(cc.Node.EventType.TOUCH_CANCEL, function(touch) {
			this.unschedule(this._waitingLongTouch);
			this.touchDownSquare = null;
			this.isLongTouch = false;
		}, this);
	},

	_convTouchSquare(touch) {
		var newVec2 = this.node.convertTouchToNodeSpace(touch);
		var board = this.board;
		var squareSize = board.squareSize;
		var row = Math.floor(newVec2.y / squareSize);
		var col = Math.floor(newVec2.x / squareSize);
		if (row >= board.rows || board.rows < 0 || col >= board.cols || board.cols < 0) {
			return null;
		}
		return board.map[row][col];
	},

	_waitingLongTouch() {
		this.isLongTouch = true;
		this.node.emit('long-touch', {currentSquare: this.touchDownSquare});
	},
});