import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TimerNotificationService } from '../timer-notification.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  timer: bigint = 0n;
  intervalId: any;
  @Output() scoreEmitEvent = new EventEmitter<bigint>();

  constructor(
    private timerService: TimerNotificationService,
  ) { }

  ngOnInit(): void {
    this.timerService.timerSubject$.subscribe(data => {
      if (data === 'start')
        this.startTimer();
      else if (data === 'stop') {
        this.scoreEmitEvent.emit(this.timer);
        this.stopTimer();
      }
    })
  }

  startTimer() {
    this.intervalId = setInterval(() => {
      this.timer++;
    }, 1000);
  }

  stopTimer(): void {
    clearInterval(this.intervalId);
    this.timer = 0n;
  }

}
