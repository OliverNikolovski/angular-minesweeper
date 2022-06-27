import { Component, OnInit, Input } from '@angular/core';
import { NewGameNotificationService } from '../new-game-notification.service';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.css']
})
export class GameOverComponent implements OnInit {
  @Input() score: bigint | undefined;
  @Input() gameOutcome: 'win' | 'lose' | undefined;


  constructor(
    private newGameService: NewGameNotificationService,
  ) { }

  ngOnInit(): void {
  }

  startNewGame(): void {
    this.newGameService.startNewGame();
  }

}
