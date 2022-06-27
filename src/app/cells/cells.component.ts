import { state } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cell } from '../cell';
import { NewGameNotificationService } from '../new-game-notification.service';
import { TimerNotificationService } from '../timer-notification.service';

@Component({
  selector: 'app-cells',
  templateUrl: './cells.component.html',
  styleUrls: ['./cells.component.css']
})
export class CellsComponent implements OnInit {
  cellBoard: Cell[][] = [];
  isGameStarted: boolean = false;
  @Input() rows: number = 0;
  @Input() cols: number = 0;
  @Input() probability: number = 0;
  @Output() gameOverEvent = new EventEmitter<'win' | 'lose'>();
  @Output() gameStartedEvent = new EventEmitter<void>();

  constructor(
    private timerService: TimerNotificationService,
    private newGameService: NewGameNotificationService,
  ) { }

  ngOnInit(): void {
    this.initCellBoard();
    this.newGameService.subject$.subscribe(() => this.initCellBoard());
  }

  initCellBoard(): void {
    this.cellBoard = [];
    for (let i = 0; i < this.rows; i++) {
      this.cellBoard.push([]);
      for (let j = 0; j < this.cols; j++) {
        const isMined: boolean = Math.random() <= this.probability;
        const cell: Cell = { i, j, isMined, state: 'unopened', content: null }
        this.cellBoard[i].push(cell);
      }
    }
  }

  getNumberOfMines(): number {
    return this.cellBoard.flatMap(cellRow => cellRow).filter(cell => cell.isMined).length;
  }

  getNumberOfUnopenedOrFlaggedCells(): number {
    return this.cellBoard
      .flatMap(cellRow => cellRow)
      .filter(cell => cell.state === 'unopened' || cell.state === 'flagged').length;
  }

  checkWin(): boolean {
    return this.getNumberOfUnopenedOrFlaggedCells() === this.getNumberOfMines();
  }

  openCell(cell: Cell): void {
    if (cell.state !== 'unopened')
      return;
    if (!this.isGameStarted) {
      this.gameStartedEvent.emit(); // to notify the parent GameBoard component that the game has started, so it would hide the previous result
      this.timerService.startTimer(); // to notify the timer to start counting
      this.isGameStarted = true;
    }
    cell.state = 'opened';
    if (cell.isMined) {
      console.log('lose')
      this.gameOver('lose');
      return;
    }
    if (this.checkWin()) {
      console.log('win')
      this.gameOver('win');
      return;
    }
    const mines = this.getNumberOfMinesAroundCell(cell);
    if (mines === 0) {
      cell.content = null;
      for (let neighbor of this.getNeighbors(cell)) {
        if (!(neighbor.state === 'opened'))
          this.openCell(neighbor);
      }
    }
    else {
      cell.content = mines;
    }
  }

  flagCell(event: MouseEvent, cell: Cell): void {
    event.preventDefault(); // to prevent the context menu from showing
    if (cell.state === 'opened')
      return;
    if (!this.isGameStarted) {
      this.gameStartedEvent.emit(); // to notify the parent GameBoard component that the game has started, so it would hide the previous result
      this.timerService.startTimer(); // to notify the timer to start counting
      this.isGameStarted = true;
    }
    if (cell.state === 'flagged') {
      cell.state = 'unopened';
      cell.content = null;
      return;
    }
    cell.state = 'flagged';
    cell.content = '🚩';
  }

  gameOver(outcome: 'win' | 'lose') {
    this.gameOverEvent.emit(outcome);
    this.timerService.stopTimer();
    this.uncoverAllSquares();
    this.isGameStarted = false;
  }

  uncoverAllSquares(): void {
    this.cellBoard.flatMap(row => row)
      .forEach(cell => {
        cell.state = 'opened';
        if (cell.isMined)
          cell.content = '💣';
        else {
          let mines = this.getNumberOfMinesAroundCell(cell);
          cell.content = mines > 0 ? mines : null;
        }
      });
  }

  getNumberOfMinesAroundCell(cell: Cell): number {
    let mines = 0;
    const [i, j] = [cell.i, cell.j];
    let squareToCheck = this.cellBoard[i - 1] ? this.cellBoard[i - 1][j - 1] : null;
    if (squareToCheck && squareToCheck.isMined)
      mines++;
    squareToCheck = this.cellBoard[i - 1] ? this.cellBoard[i - 1][j] : null;
    if (squareToCheck && squareToCheck.isMined)
      mines++;
    squareToCheck = this.cellBoard[i - 1] ? this.cellBoard[i - 1][j + 1] : null;
    if (squareToCheck && squareToCheck.isMined)
      mines++;
    squareToCheck = this.cellBoard[i][j - 1];
    if (squareToCheck && squareToCheck.isMined)
      mines++;
    squareToCheck = this.cellBoard[i][j + 1];
    if (squareToCheck && squareToCheck.isMined)
      mines++;
    squareToCheck = this.cellBoard[i + 1] ? this.cellBoard[i + 1][j - 1] : null;
    if (squareToCheck && squareToCheck.isMined)
      mines++;
    squareToCheck = this.cellBoard[i + 1] ? this.cellBoard[i + 1][j] : null;
    if (squareToCheck && squareToCheck.isMined)
      mines++;
    squareToCheck = this.cellBoard[i + 1] ? this.cellBoard[i + 1][j + 1] : null;
    if (squareToCheck && squareToCheck.isMined)
      mines++;
    return mines;
  }

  private getNeighbors(cell: Cell): Cell[] {
    const neighbours: Cell[] = [];
    const [i, j] = [cell.i, cell.j];
    if (i > 0) {
      neighbours.push(this.cellBoard[i - 1][j]);
    }
    if (i < this.cellBoard.length - 1) {
      neighbours.push(this.cellBoard[i + 1][j]);
    }
    if (j > 0) {
      neighbours.push(this.cellBoard[i][j - 1]);
    }
    if (j < this.cellBoard[0].length - 1) {
      neighbours.push(this.cellBoard[i][j + 1]);
    }
    if (i > 0 && j > 0) {
      neighbours.push(this.cellBoard[i - 1][j - 1]);
    }
    if (i > 0 && j < this.cellBoard[0].length - 1) {
      neighbours.push(this.cellBoard[i - 1][j + 1]);
    }
    if (i < this.cellBoard.length - 1 && j > 0) {
      neighbours.push(this.cellBoard[i + 1][j - 1]);
    }
    if (i < this.cellBoard.length - 1 && j < this.cellBoard[0].length - 1) {
      neighbours.push(this.cellBoard[i + 1][j + 1]);
    }
    return neighbours;
  }

}
