import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
export class ListComponent implements AfterViewInit, OnInit {

  //#region Properties

  @ViewChild('txtDateStart')
  txtDateStart!: ElementRef

  @ViewChild('txtDateEnd')
  txtDateEnd!: ElementRef

  frmList!: FormGroup

  images: SearchResponse[] = []

  loading = true

  //#endregion

  //#region Constructors

  constructor(
    private conversionApiService: ConversionApiService
  ) { }

  ngOnInit() {
    this.#init()
  }

  ngAfterViewInit() {

    const start = DateTime.local().minus({ day: 1 })
    const end = DateTime.local()

    this.startDate
      .setValue(start.toISO())

    this.endDate
      .setValue(end.toISO())

    // Actualizamos el valor del elemento

    this.txtDateStart.nativeElement.value = start.toFormat('yyyy-LL-dd HH:mm')

    this.txtDateEnd.nativeElement.value = end.toFormat('yyyy-LL-dd HH:mm')

    setTimeout(() => {
      this.#search()
    }, 1000);
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
      return alert('La fecha inicial no puede ser mayor que la fecha final')
    }

    this.#search()
  }

  getMessageError(field: string) {
    return FormMessage.get(this.frmList, field)
  }

  //#endregion
}
