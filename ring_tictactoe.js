
class RingTicTacToe {
	constructor() {
		this.redPlayer = "red";
		this.bluePlayer = "blue";
		this.turn = null;

		this.template = document.querySelector('.template');
		this.redSide = document.querySelector('.side[data-color="red"]');
		this.blueSide = document.querySelector('.side[data-color="blue"]');
		this.sides = [this.redSide, this.blueSide];
		this.grid = document.querySelector('.grid');

		this.cloneElements();
		this.startGame();
		// this.restartButton.addEventListener('click', () => this.startGame());
	}

	cloneElements() {
		for(const side of this.sides) {
			for(let i = 0; i != 2; i++) {
				const clone = this.template.cloneNode(true);
				const color = side.getAttribute('data-color');
				clone.classList.remove('template');
				clone.setAttribute('data-color', color);
				side.appendChild(clone);
			}
		}

		for(let i = 0; i != 9; i++) {
			const clone = this.template.cloneNode(true);
			clone.classList.remove('template');
			this.grid.appendChild(clone);
		}
	}

	startGame() {
		this.sides.forEach(side => {
			side.querySelectorAll('.cell').forEach(cell => {
				cell.addEventListener('click', (e) => this.handleClick(e));
			});
		})
	}

	handleClick(e, clickAmount) {
		const target = e.target;
		const cell = target.closest('.cell');
		const color = cell.getAttribute('data-color');
		if (cell.querySelector('.ring[selected]') === null) {
			cell.querySelector('.ring[data-ring="big"]').setAttribute('selected', '');
			console.log('selected big');
		} else if (cell.querySelector('.ring[data-ring="big"]').hasAttribute('selected')) {
			cell.querySelector('.ring[data-ring="big"]').removeAttribute('selected', '');
			cell.querySelector('.ring[data-ring="middle"]').setAttribute('selected', '');
			console.log('selected middle');
		} else if (cell.querySelector('.ring[data-ring="middle"]').hasAttribute('selected')) {
			cell.querySelector('.ring[data-ring="middle"]').removeAttribute('selected', '');
			cell.querySelector('.ring[data-ring="small"]').setAttribute('selected', '');
			console.log('selected small');
		} else if (cell.querySelector('.ring[data-ring="small"]').hasAttribute('selected')) {
		cell.querySelector('.ring[data-ring="small"]').removeAttribute('selected', '');
		console.log('selected small');
	}
		this.turn = color;
		console.log('turn ' + this.turn);
	}
}

const game = new RingTicTacToe();
