import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConversionApiService } from 'src/app/services/conversion-api.service';
import { FormMessage } from 'src/app/utils/errorForm';
import { GlobalResponse } from 'src/app/utils/types';
import { message } from '../../utils/helpers'
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  //#region Properties

  @ViewChild('txtFile')
  txtFile!: ElementRef

  frmMain!: FormGroup

  loading = false

  //#endregion

  //#region Constructors

  constructor(
    private conversionApiService: ConversionApiService,
    private eventsService: EventsService
  ) {
    this.#init()
  }

  get image() { return this.frmMain.controls['image'] }
  get file() { return this.frmMain.controls['file'] }
  get userName() { return this.frmMain.controls['userName'] }
  get fileName() { return this.frmMain.controls['fileName'] }

  //#endregion

  //#region Methods

  #init() {

    this.frmMain = new FormGroup({
      image: new FormControl('', [Validators.required]),
      file: new FormControl(null),
      userName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      fileName: new FormControl('', [Validators.required, Validators.maxLength(25)])
    })
  }

  changeImage(event: any) {

    if (event.target.files && event.target.files[0]) {

      const file = event.target.files[0]

      this.file.patchValue(file)
      this.file.updateValueAndValidity()

      const reader = new FileReader()
      reader.onload = e => this.image.setValue(reader.result)
      reader.readAsDataURL(file)
    }
  }

  getMessageError(field: string) {
    return FormMessage.get(this.frmMain, field)
  }

  validateForm() {

    if (this.frmMain.invalid) {
      this.frmMain.markAllAsTouched()
    }

    this.#convert()
  }

  #convert() {

    let formData = new FormData()
    formData.append('', this.file.value)

    const title = 'Procesar imagen'

    this.conversionApiService
      .convert(formData, this.userName.value, this.fileName.value)
      .then((val: GlobalResponse<any>) => {

        message(title, val.message, val.success)

        if (!val.success) {
          return
        }

        this.eventsService
          .evntRefreshResume
          .emit()

        this.#clearForm()
      })
      .catch(() => {
        message(title, 'Ha ocurrido un error generando el proceso de subida de la imagen', false)
      })
  }

  #clearForm() {

    this.frmMain.reset()
    this.txtFile.nativeElement.value = ''
  }

  //#endregion
}
