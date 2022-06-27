import { TestBed } from '@angular/core/testing';

import { NewGameNotificationService } from './new-game-notification.service';

describe('NewGameNotificationService', () => {
  let service: NewGameNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewGameNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
