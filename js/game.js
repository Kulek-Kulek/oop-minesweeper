import { Cell } from './Cell.js';
import { UI } from './UI.js';
import { Counter } from './Counetr.js';
import { Timer } from './Timer.js';

class Game extends UI {

    #config = {
        easy: {
            row: 8,
            col: 8,
            mines: 10
        },
        medium: {
            row: 16,
            col: 16,
            mines: 40
        },
        expert: {
            row: 16,
            col: 30,
            mines: 99
        }
    }


    #counter = new Counter();
    #timer = new Timer();

    #numberOfRows = null;
    #numberOfCols = null;
    #numberOfMines = null;

    #cells = [];
    #board = null;
    #cellsElements = null;



    initializeGame() {
        this.#handleElements();
        this.#counter.init();
        this.#timer.init();
        this.#newGame();
    }

    #newGame(rows = this.#config.easy.row, cols = this.#config.easy.col, mines = this.#config.easy.mines) {
        this.#numberOfRows = rows;
        this.#numberOfCols = cols;
        this.#numberOfMines = mines;

        this.#counter.setValue(this.#numberOfMines);

        this.#timer.startTimer();

        this.#setStyles();
        this.#generateCells();
        this.#renderBoard();

        this.#cellsElements = this.getElements(this.UiSelectors.cell);

        this.#addCellsEventListeners();
    }

    #generateCells() {
        for (let row = 0; row < this.#numberOfRows; row++) {
            this.#cells[row] = [];
            for (let col = 0; col < this.#numberOfCols; col++) {
                this.#cells[row].push(new Cell(col, row));
            }
        }
    }

    #handleElements() {
        this.#board = this.getElement(this.UiSelectors.board);
    }

    #renderBoard() {
        this.#cells.flat().forEach(cell => {
            this.#board.insertAdjacentHTML('beforeend', cell.createElement());
            cell.element = cell.getElement(cell.selector);
        })
    }

    #setStyles() {
        document.documentElement.style.setProperty('--cells-in-row', this.#numberOfRows);
    }

    #handleCellContextMenu = e => {
        e.preventDefault();
        const target = e.target;
        const rowIndex = parseInt(target.getAttribute('data-y'), 10);
        const colIndex = parseInt(target.getAttribute('data-x'), 10);

        const cell = this.#cells[rowIndex][colIndex];
        if (cell.isRevealed) return;

        if (cell.isFlagged) {
            this.#counter.increment();
            cell.toggleFlag();
            return;
        }

        if (!!this.#counter.value) {
            this.#counter.decrement();
            cell.toggleFlag();
        }

    }

    #handleCellClick = e => {
        const target = e.target;
        const rowIndex = parseInt(target.getAttribute('data-y'), 10);
        const colIndex = parseInt(target.getAttribute('data-x'), 10);

        this.#cells[rowIndex][colIndex].revealCell();
    }

    #addCellsEventListeners() {
        this.#cellsElements.forEach(el => {
            el.addEventListener('click', this.#handleCellClick);
            el.addEventListener('contextmenu', this.#handleCellContextMenu);
        })
    }
}


window.onload = function () {
    const game = new Game();
    game.initializeGame();
}