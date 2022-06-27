import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewGameNotificationService {
  subject$ = new Subject<void>();

  constructor() { }

  startNewGame(): void {
    this.subject$.next();
  }
}
