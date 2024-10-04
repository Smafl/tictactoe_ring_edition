
class TicTacToeModel {
	// handle logic of a game
	// provide methods to place rings, switch players, and check for a win

	constructor() {
		this.winner = null;
		this.upd = {
			turn: 2,
			cell: null,
			isSelected: false,
			ringSize: null
		};
		this.sides = [[], []];
		this.board = [];

		this.winCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
								[1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

		this.initBoard();
	}

	printUpd(log) {
		console.log('log ', log, '; turn: ', this.upd.turn);
		console.log('log ', log, '; cell: ', this.upd.cell);
		console.log('log ', log, '; is selected: ', this.upd.isSelected);
		console.log('log ', log, '; ring size: ', this.upd.ringSize);
	}

	initBoard() {
		// null (no setted ring), 0 (red), 1 (blue)
		for (let i = 0; i != 9; i++) {
			this.board.push([null, null, null]);
		}

		// null (ring placed), selected, used
		for (let i = 0; i != 2; i++) {
			this.sides[i].push([null, null, null], [null, null, null]);
		}
	}

	isCellWin(cell) {
		for (let i = 0; i !=3; i++) {
			if (cell[i] == this.upd.turn) {
				return true;
			} else if (cell[i] == (this.upd.turn ^ 1)) {
				return false;
			}
		}
		return false;
	}

	isWin() {
		return this.winCombinations.some(combnation => {
			return combnation.every(index => {
				return this.isCellWin(this.board[index]);
			})
		})
	}

	canPlaceRing(boardCell, ringSize) {
		for (let i = 0; i != 3; i++) {
			if (this.board[boardCell][i] === null) {
				return i === ringSize;
			}
			if (this.board[boardCell][i] !== null && i < ringSize) {
				return false;
			}
		}
		return false;
	}

	isDraw() {
		for (let cell = 0; cell != 2; cell++) {
            for (let ring = 0; ring != 3; ring++) {
                if (this.sides[this.upd.turn ^ 1][cell][ring] !== 'used') {
                    for (let boardCell = 0; boardCell != 9; boardCell++) {
                        if (this.canPlaceRing(boardCell, ring)) {
                            return false;
                        }
                    }
                }
            }
        }
		return true;
	}

	selectRing(index) {
		if (this.containsNan(index)) {
			console.error('index contains Nan');
			return false;
		}
		if (this.upd.turn != index[0] && this.upd.turn != 2) {
			console.log('turn is wrong');
			return false;
		}
		if (this.upd.isSelected === true) {
			if (this.upd.cell != index[1]) {
				const i = this.sides[index[0]][this.upd.cell].indexOf('selected');
				if (i != -1) {
					this.sides[index[0]][this.upd.cell][i] = null;
					this.upd.isSelected = false;
				}
			}
		}

		for (let ring = 0; ring != 3; ring++) {
			if (this.sides[index[0]][index[1]][ring] == 'used') {
				continue;
			}
			if (this.sides[index[0]][index[1]][ring] == 'selected') {
				this.sides[index[0]][index[1]][ring] = null;
				this.upd.isSelected = false;
				this.upd.ringSize = null;
				continue;
			}
			if (this.upd.isSelected == false) {
				this.sides[index[0]][index[1]][ring] = 'selected';
				this.upd.turn = index[0];
				this.upd.cell = index[1];
				this.upd.isSelected = true;
				this.upd.ringSize = ring;
				break;
			}
		}
		return true;
	}

	placeRing(index) {
		if (isNaN(index)) {
			return false;
		}
		let isEmpty = this.board[index].indexOf(null);
		if (isEmpty == -1) {
			return false;
		}
		for (let ring = 0; ring != 3; ring++) {
			if (this.board[index][ring] != null) {
				if (this.upd.ringSize > ring) {
					return false;
				}
			}
			if (this.upd.ringSize == ring) {
				if (this.board[index][ring] == null) {
					this.board[index][ring] = this.upd.turn;
					this.sides[this.upd.turn][this.upd.cell][ring] = 'used';
					this.upd.isSelected = false;
					this.upd.ringSize = null;
					break;
				}
			}
		}
		return true;
	}

	switchTurn() {
		this.upd.turn = this.upd.turn ^ 1;
	}

	containsNan(index) {
		for (let i = 0; i != index.length; i++) {
			if (isNaN(index[i])) {
				return true;
			}
		}
		return false;
	}
}

class TicTacToeView {
	// display the game board and rings
	// handle user interactions (e.g., clicking on cells to place rings)

	constructor() {
		this.template = this.getElement('.template');
		this.redGrid = this.getElement('.side[data-color="0"]');
		this.blueGrid = this.getElement('.side[data-color="1"]');
		this.grid = this.getElement('.grid');
		this.sides = [this.redGrid, this.blueGrid];

		this.initGrid();
	}

	getElement(selector) {
		const element = document.querySelector(selector);
		return element;
	}

	initGrid() {
		for(const side of this.sides) {
			for(let i = 0; i != 2; i++) {
				const clone = this.template.cloneNode(true);
				const color = side.getAttribute('data-color');
				clone.classList.remove('template');
				clone.setAttribute('data-color', color);
				clone.setAttribute('data-index', i);
				clone.classList.add('side');
				side.appendChild(clone);
			}
		}

		for(let i = 0; i != 9; i++) {
			const clone = this.template.cloneNode(true);
			clone.classList.remove('template');
			clone.setAttribute('data-index', i);
			clone.classList.add('grid');
			this.grid.appendChild(clone);
		}
	}

	cleanRings() {
		for (let i = 0; i != 2; i++) {
			this.sides[i].querySelectorAll('.cell').forEach(cell => {
				const rings = cell.querySelectorAll('.ring');
				rings.forEach(ring => {
					ring.classList.remove('used', 'selected')
				});
			});
		}

		const cells = this.grid.querySelectorAll('.grid');
		cells.forEach(cell => {
			const rings = cell.querySelectorAll('.ring');
			rings.forEach(ring => {
				ring.classList.remove('red', 'blue');
			});
		});
	}

	bindBoardClick(handler) {
		const cells = this.grid.querySelectorAll('.grid');
		cells.forEach(cell => {
			cell.addEventListener('click', event => {
				let index = null;
				const target = event.target;
				const cell = target.closest('.cell');
				if (cell.classList.contains('grid')) {
					index = parseInt(cell.getAttribute('data-index'));
					handler(index);
				} // else -> error ?
			})
		})
	}

	bindSideClick(handler) {
		this.sides.forEach(side => {
			side.querySelectorAll('.cell').forEach(cell => {
				cell.addEventListener('click', event => {
					const index = [];
					const target = event.target;
					const cell = target.closest('.cell');
					if (cell.classList.contains('side')) {
						index.push(parseInt(cell.getAttribute('data-color')));
						index.push(parseInt(cell.getAttribute('data-index')));
						handler(index);
					} // else -> error ?
				});
			});
		});
	}

	renderBoard(board) {
		const cells = this.grid.querySelectorAll('.grid');
		cells.forEach((cell, index) => {
			const rings = cell.querySelectorAll('.ring');
			rings.forEach((ring, i) => {
				const ringStatus = board[index][i];
				if (ringStatus === 0) {
					ring.classList.add('red');
				} else if (ringStatus === 1) {
					ring.classList.add('blue');
				}
			});
		});
	}

	renderSides(modelSides) {
		for (let i = 0; i != 2; i++) {
			this.sides[i].querySelectorAll('.cell').forEach((cell, index) => {
				const cellData = modelSides[i][index];
				const rings = cell.querySelectorAll('.ring');
				rings.forEach((ring, i) => {
					const ringStatus = cellData[i];
					if (ringStatus === 'used') {
						ring.classList.add('used');
						ring.classList.remove('selected');
					} else if (ringStatus === 'selected') {
						ring.classList.add('selected');
						ring.classList.remove('used');
					} else {
						ring.classList.remove('used');
						ring.classList.remove('selected');
					}
				});
			});
		}
	}
}

class TicTacToeController {
	// capture user actions (like clicks), update the model, and tell the view to refresh
	// model and view should communicate via controller

	constructor(model, view) {
		this.model = model;
		this.view = view;
		this.gameEndMessage = document.getElementById('gameEndMessage');
		this.restartButton = document.getElementById('restartButton');

		this.view.bindSideClick(this.handleSideClick);
		this.view.bindBoardClick(this.handleBoardClick);

		this.startGame();
		this.restartButton.addEventListener('click', () => this.startGame());
		this.gameEndMessage.addEventListener('click', () => this.startGame());
	}

	startGame() {
		this.gameEndMessage.classList.remove('show', 'red-wins', 'blue-wins');
		this.model.winner = null;
		this.model.upd.turn = 2;
		this.model.upd.cell = null;
		this.model.upd.isSelected = false;
		this.model.upd.ringSize = null;
		this.model.sides = [[], []];
		this.model.board = [];
		this.model.initBoard();
		this.view.cleanRings();
		this.view.renderBoard(this.model.board);
		this.view.renderSides(this.model.sides);
	}

	handleSideClick = index => {
		if (this.model.selectRing(index)) {
			this.view.renderSides(this.model.sides);
		}
	}

	handleBoardClick = index => {
		if (this.model.placeRing(index)) {
			this.view.renderBoard(this.model.board);
			this.view.renderSides(this.model.sides);
			if (this.model.isWin()) {
				this.endGame(false);
			} else if (this.model.isDraw()) {
				this.endGame(true);
			} else {
				this.model.switchTurn();
			}
		}
	}

	endGame(draw) {
		if (draw) {
			this.gameEndMessage.innerText = "DRAW";
			this.gameEndMessage.classList.add('draw');
		} else {
			this.gameEndMessage.innerText = `${this.model.upd.turn ? "BLUE" : "RED"}\nWINS`;
			this.gameEndMessage.classList.add(`${this.model.upd.turn ? "blue" : "red"}-wins`);
			console.log(`${this.model.upd.turn ? "blue" : "red"} wins`);
		}
		this.gameEndMessage.classList.add('show');

		// setTimeout(() => {
		// 	this.gameEndMessage.classList.remove('show');
		// }, 5000);
	}
}

const game = new TicTacToeController(new TicTacToeModel(), new TicTacToeView());

// /*
// Flow:
// The Controller listens for click events on the board (from the View).
// When a click happens, the controller places a ring in the model.
// The model checks if the move is valid and updates the game state.
// After any changes to the game state, the controller asks the View to re-render the board.
// */
