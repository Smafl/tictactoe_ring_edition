
class TicTacToeModel {
	// handle logic of a game
	// provide methods to place rings, switch players, and check for a win

	constructor() {
		this.winner = null;
		this.upd = {
			turn: 2,
			cell: null,
			isSelected: false
		};
		this.redSide = [];
		this.blueSide = [];
		this.board = [];

		this.initBoard();
	}

	printUpd(log) {
		console.log('log ', log, '; turn: ', this.upd.turn);
		console.log('log ', log, '; cell: ', this.upd.cell);
		console.log('log ', log, '; is selected: ', this.upd.isSelected);
	}

	initBoard() {
		// null (no setted ring), red, blue
		for (let i = 0; i != 9; i++) {
			this.board.push([null, null, null]);
		}

		// null (ring placed), selected, used
		for (let i = 0; i != 2; i++) {
			this.redSide.push([null, null, null]);
			this.blueSide.push([null, null, null]);
		}
	}

	redSideAction(index) {
		if (this.containsNan(index)) {
			console.error('index contains Nan');
			return false;
		}
		this.printUpd(1)
		if (this.upd.turn != index[0] && this.upd.turn != 2) {
			console.log('turn is wrong');
			return false;
		}
		if (this.upd.isSelected === true) {
			if (this.upd.cell != index[1]) {
				const i = this.redSide[this.upd.cell].indexOf('selected');
				if (i != -1) {
					this.redSide[this.upd.cell][i] = null;
					this.upd.isSelected = false;
				}
			}
		}

		for (let i = 0; i != 3; i++) {
			if (this.redSide[index[1]][i] == 'used') {
				continue;
			}
			if (this.redSide[index[1]][i] == 'selected') {
				this.redSide[index[1]][i] = null;
				this.upd.isSelected = false;
				continue;
			}
			if (this.upd.isSelected == false) {

				this.redSide[index[1]][i] = 'selected';
				this.upd.turn = index[0];
				this.upd.cell = index[1];
				this.upd.isSelected = true;
				console.log('selected: ', i);
				break;
			}
		}
		this.printUpd(2);
		console.log('redSide: ', this.redSide[index[1]]);
		return true;
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

	bindRedSideClick(handler) {
		this.sides.forEach(side => {
			side.querySelectorAll('.cell').forEach(cell => {
				cell.addEventListener('click', event => {
					const index = [];
					console.log("in red side event");
					const target = event.target;
					const cell = target.closest('.cell');
					if (cell.classList.contains('side')) {
						index.push(parseInt(cell.getAttribute('data-color')));
						index.push(parseInt(cell.getAttribute('data-index')));
						console.log('indexes are: ', index);
						handler(index);
					}
				});
			});
		});
	}

	renderModel(redSide) {
		const cells = this.redGrid.querySelectorAll('.cell[data-color="0"]');
		cells.forEach((cell, index) => {
			const rings = cell.querySelectorAll('.ring');
			const cellData = redSide[index];
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

class TicTacToeController {
	// capture user actions (like clicks), update the model, and tell the view to refresh
	// model and view should communicate via controller

	constructor(model, view) {
		this.model = model;
		this.view = view;

		this.view.bindRedSideClick(this.handleRedSideClick);
	}

	handleRedSideClick = index => {
		if (this.model.redSideAction(index)) {
			this.view.renderModel(this.model.redSide);
		}
	}
}

const game = new TicTacToeController(new TicTacToeModel(), new TicTacToeView);

// /*
// Flow:
// The Controller listens for click events on the board (from the View).
// When a click happens, the controller places a ring in the model.
// The model checks if the move is valid and updates the game state.
// After any changes to the game state, the controller asks the View to re-render the board.
// */
