
class TicTacToeModel {
	// handle logic of a game
	// provide methods to place rings, switch players, and check for a win

	constructor() {
		this.upd = {
			turn: 2,
			cell: null,
			isSelected: false,
			ringSize: null,
			winCombo: null,
			freeCells: 0,
			winFreeCells: 0,
			winner: null
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
		// null (no set ring), 0 (red), 1 (blue)
		for (let i = 0; i != 9; i++) {
			this.board.push([null, null, null]);
		}

		// null (ring placed), selected, used
		for (let i = 0; i != 2; i++) {
			this.sides[i].push([null, null, null], [null, null, null]);
		}
	}

	isEnd() {
		this.upd.winCombo = this.isWin();
		console.log('winCombo ', this.upd.winCombo);

		this.canPlaceRing();

		if (this.upd.winCombo != undefined && this.upd.winFreeCells == 0) {
			this.upd.winner = this.upd.turn ? "blue" : "red";
			return true;
		}

		if (this.upd.winCombo == undefined && this.upd.freeCells == 0) {
			this.upd.winner = 'draw';
			return true;
		}

		console.log('free cells ', this.upd.freeCells);
		console.log('win free cells ', this.upd.winFreeCells);

		this.upd.freeCells = 0;
		this.upd.winFreeCells = 0;
		return false;
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
		return this.winCombinations.find(combnation => {
			return combnation.every(index => {
				return this.isCellWin(this.board[index])
			});
		});
	}

	isRingFits(boardCell, ringSize) {
		let redRing = this.board[boardCell].indexOf(0);
		let blueRing = this.board[boardCell].indexOf(1);
		let rings = [redRing, blueRing].filter(ring => ring !== -1);
		if (rings.length === 0) {
			return true;
		}
		if (Math.min(...rings) > ringSize) {
			return true;
		}
		return false;
	}

	canPlaceRing() {
		for (let cell = 0; cell != 2; cell++) {
			let unusedRing = this.sides[this.upd.turn ^ 1][cell].indexOf(null);
			if (unusedRing == -1) {
				continue;
			}
			for (let boardCell = 0; boardCell != 9; boardCell++) {
				if (this.isRingFits(boardCell, unusedRing)) {
					if (this.upd.winCombo != undefined && this.upd.winCombo.indexOf(boardCell) != -1) {
						console.log(`board cell ${boardCell}`);
						this.upd.winFreeCells++;
					}
					this.upd.freeCells++;
				}
			}
        }
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
			cell.addEventListener('click', event => { // once?
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
				cell.addEventListener('click', event => { // once?
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
		this.instuctions = document.getElementById('instructions');
		this.howToPlayButton = document.getElementById('howToPlayButton');

		this.view.bindSideClick(this.handleSideClick);
		this.view.bindBoardClick(this.handleBoardClick);

		this.startGame();
		this.restartButton.addEventListener('click', () => this.startGame());
		this.howToPlayButton.addEventListener('click', () => this.showInstructions(true));
		this.instuctions.addEventListener('click', () => this.showInstructions(false));
		// this.gameEndMessage.addEventListener('click', () => this.startGame());
	}

	startGame() {
		this.gameEndMessage.classList.remove('show', 'red-wins', 'blue-wins');
		this.model.upd.turn = 2;
		this.model.upd.cell = null;
		this.model.upd.isSelected = false;
		this.model.upd.ringSize = null;
		this.model.upd.winCombo = null;
		this.model.upd.freeCells = 0;
		this.model.upd.winFreeCells = 0;
		this.model.upd.winner = null;
		this.model.sides = [[], []];
		this.model.board = [];
		this.model.initBoard();
		this.view.cleanRings();
		this.view.renderBoard(this.model.board);
		this.view.renderSides(this.model.sides);
	}

	handleSideClick = index => {
		if (!this.model.selectRing(index)) {
			return;
		}
		this.view.renderSides(this.model.sides);
	}

	handleBoardClick = index => {
		if (!this.model.placeRing(index)) {
			return;
		}
		this.view.renderBoard(this.model.board);
		this.view.renderSides(this.model.sides);
		if (this.model.isEnd()) {
			// console.log('winner: ', this.model.upd.winner);
			this.endGame();
		}
		else {
			this.model.switchTurn();
		}
	}

	endGame() {
		if (this.model.upd.winner == 'draw') {
			this.gameEndMessage.innerText = "DRAW";
			this.gameEndMessage.classList.add('draw');
		} else {
			this.gameEndMessage.innerText = `${this.model.upd.turn ? "BLUE" : "RED"}\nWINS`;
			this.gameEndMessage.classList.add(`${this.model.upd.turn ? "blue" : "red"}-wins`);
			console.log(`${this.model.upd.turn ? "blue" : "red"} wins`);
		}
		this.gameEndMessage.classList.add('show');

		setTimeout(() => {
			this.gameEndMessage.classList.remove('show');
		}, 3000);
	}

	showInstructions(show) {
		this.instuctions.innerText = `Each player has 2 sets of 3 rings,
		each with different sizes.

		Players can place a larger ring over a smaller one.
		The color of the largest ring on a cell
		determines control of that cell.

		The main goal is to align 3 of your
		colored rings in a row:
		horizontally, vertically, or diagonally.`;

		this.instuctions.classList.toggle('show', show);
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
