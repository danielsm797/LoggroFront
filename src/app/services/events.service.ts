import { Injectable, EventEmitter } from '@angular/core';
import { Events } from '../utils/enums';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  evntRefreshResume: EventEmitter<void> = new EventEmitter()

  constructor() { }
}
