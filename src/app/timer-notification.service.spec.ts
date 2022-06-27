import { TestBed } from '@angular/core/testing';

import { TimerNotificationService } from './timer-notification.service';

describe('TimerNotificationService', () => {
  let service: TimerNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimerNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
