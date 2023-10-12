import { Component } from '@angular/core';
import { ConversionApiService } from '../../services/conversion-api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalResponse, SearchResponse } from 'src/app/utils/types';
import { DateTime } from 'luxon'
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {

  //#region Properties

  frmList!: FormGroup

  images: SearchResponse[] = []

  loading = false

  //#endregion

  //#region Constructors

  constructor(
    private conversionApiService: ConversionApiService
  ) {

    this.#init()
  }

  get startDate() { return this.frmList.controls['startDate'] }
  get endDate() { return this.frmList.controls['endDate'] }

  //#endregion

  //#region Methods

  #init() {

    this.frmList = new FormGroup({
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
    })
  }

  #search() {

    this.images = []

    this.loading = true

    this.conversionApiService
      .search(this.startDate.value, this.endDate.value)
      .then((val: GlobalResponse<SearchResponse[]>) => {

        const { success, object } = val

        if (!success) {
          // TODO: Mostrar mensaje
          return
        }

        object
          .forEach(x => {
            x.createdAt = DateTime.fromISO(x.createdAt).toLocal().toFormat('yyyy/LL/dd HH:mm:ss')
            x.path = `${environment.resources}${x.path}`
          })

        this.images = object
      })
      .catch(err => {
        // TODO: Mostrar mensaje
        console.log('err :>> ', err);
      })
      .finally(() => {

        this.loading = false
      })
  }

  validateForm() {

    if (this.frmList.invalid) {
      return this.frmList.markAllAsTouched()
    }

    this.#search()
  }

  //#endregion
}
