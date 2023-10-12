import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConversionApiService } from '../../services/conversion-api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalResponse, SearchResponse } from 'src/app/utils/types';
import { DateTime } from 'luxon'
import { environment } from 'src/environments/environment.development';
import { FormMessage } from '../../utils/errorForm';
import { message } from 'src/app/utils/helpers';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  //#region Properties

  @ViewChild('txtDateStart')
  txtDateStart!: ElementRef

  @ViewChild('txtDateEnd')
  txtDateEnd!: ElementRef

  frmList!: FormGroup

  images: SearchResponse[] = []

  loading = true

  imageSelected!: SearchResponse | null

  //#endregion

  //#region Constructors

  constructor(
    private conversionApiService: ConversionApiService
  ) { }

  ngOnInit() {
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

    const start = DateTime
      .local()
      .minus({ day: 1 })
      .toFormat('yyyy-LL-dd HH:mm')
      .replace(' ', 'T')

    const end = DateTime
      .local()
      .toFormat('yyyy-LL-dd HH:mm')
      .replace(' ', 'T')

    this.startDate
      .patchValue(start)

    this.endDate
      .patchValue(end)

    this.#search()
  }

  #search() {

    this.images = []

    this.loading = true

    const title = 'Consulta imágenes procesadas'

    this.conversionApiService
      .search(this.startDate.value, this.endDate.value)
      .then((val: GlobalResponse<SearchResponse[]>) => {

        const { success, object } = val

        if (!success) {
          message(title, val.message, false)
          return
        }

        object
          .forEach(x => {
            x.createdAt = DateTime.fromISO(x.createdAt).toLocal().toFormat('yyyy/LL/dd HH:mm')
            x.fileName = x.path
            x.path = `${environment.resources}${x.path}`
          })

        this.images = object
      })
      .catch(err => {
        message(title, 'Ha ocurrido un error generando la consulta de las imágenes procesadas', false)
      })
      .finally(() => {
        this.loading = false
      })
  }

  validateForm() {

    if (this.frmList.invalid) {
      return this.frmList.markAllAsTouched()
    }

    if (this.startDate.value > this.endDate.value) {
      message('Consulta imágenes procesadas', 'La fecha inicial no puede ser mayor que la fecha final', false)
      return
    }

    this.#search()
  }

  getMessageError(field: string) {
    return FormMessage.get(this.frmList, field)
  }

  viewDetail(image: SearchResponse) {
    this.imageSelected = image
  }

  closeModalDetail() {
    this.imageSelected = null
  }

  //#endregion
}
