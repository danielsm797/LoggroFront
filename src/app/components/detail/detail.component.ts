import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchResponse } from 'src/app/utils/types';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent {

  //#region Properties

  @Input()
  conversion!: SearchResponse

  @Output()
  outCerrar: EventEmitter<void> = new EventEmitter()

  //#endregion

  //#region Constructor

  //#endregion

  //#region Methods

  close() {
    this.outCerrar.emit()
  }

  //#endregion
}
