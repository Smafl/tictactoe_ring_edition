
class RingTicTacToe {
	constructor() {
		this.template = document.querySelector('.template');
		this.redSide = document.querySelector('.side[data-color="0"]');
		this.blueSide = document.querySelector('.side[data-color="1"]');
		this.sides = [this.redSide, this.blueSide];
		this.grid = document.querySelector('.grid');

		this.cloneElements();
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
}

const game = new RingTicTacToe();
