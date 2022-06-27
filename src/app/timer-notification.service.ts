import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerNotificationService {
  timerSubject$ = new Subject<string>();

  constructor() { }

  startTimer(): void {
    this.timerSubject$.next('start');
  }

  stopTimer(): void {
    this.timerSubject$.next('stop');
  }
}
