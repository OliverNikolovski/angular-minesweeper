import { Component, OnInit } from '@angular/core';
import { NewGameNotificationService } from '../new-game-notification.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {
  rows: number = 9;
  cols: number = 9;
  probability: number = 0.1;
  score: bigint | undefined;
  gameOutcome: 'win' | 'lose' | undefined;
  gameInProgress: boolean = false;

  constructor(
    private newGameService: NewGameNotificationService,
  ) { }

  ngOnInit(): void {
    // to prevent the child GameOverComponent from showing after the Play Again button is pressed
    this.newGameService.subject$.subscribe(() => this.gameOutcome = undefined);
  }

  saveScore(score: bigint) {
    this.score = score;
  }

  gameOver(outcome: 'win' | 'lose') {
    this.gameOutcome = outcome;
    this.gameInProgress = false;
  }

  gameStarted() {
    this.gameInProgress = true;
    this.gameOutcome = undefined;
  }
}
