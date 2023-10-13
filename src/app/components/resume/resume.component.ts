import { Component, ViewChild, OnDestroy } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ChartComponent
} from 'ng-apexcharts';
import { ConversionApiService } from 'src/app/services/conversion-api.service';
import { EventsService } from 'src/app/services/events.service';
import { message } from 'src/app/utils/helpers';
import { GlobalResponse, ResumeResponse } from 'src/app/utils/types';
import { Subscription } from 'rxjs'
import { DateTime } from 'luxon';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormMessage } from 'src/app/utils/errorForm';

export type ChartOptions = {
  series: ApexAxisChartSeries
  chart: ApexChart
  xaxis: ApexXAxis
  stroke: ApexStroke
  tooltip: ApexTooltip
  dataLabels: ApexDataLabels
  colors: string[]
  grid: ApexGrid
}

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnDestroy {

  //#region Properties

  @ViewChild('chart')
  chart!: ChartComponent

  chartOptions!: ChartOptions

  #subs: Subscription[] = []

  // #data: number[] = []

  frmResume!: FormGroup

  //#endregion

  //#region Constructors

  constructor(
    private conversionApiService: ConversionApiService,
    private eventsService: EventsService
  ) {

    this.#initForm()
    this.#initSubs()
  }

  get startDate() { return this.frmResume.controls['startDate'] }
  get endDate() { return this.frmResume.controls['endDate'] }

  ngOnDestroy() {
    this.#subs.forEach(x => x.unsubscribe())
  }

  //#endregion

  //#region Methods

  #initSubs() {

    this.#subs
      .push(
        this.eventsService
          .evntRefreshResume
          .subscribe(() => {
            this.#searchResume()
          })
      )
  }

  #init(result: ResumeResponse[]) {

    const categories: string[] = []
    const data: number[] = new Array(23).fill(0)

    for (let index = 0; index < 24; index++) {
      const hora = index.toString().padStart(2, '0')
      categories.push(`${hora}:00`)
    }

    // Ponemos la información consultada

    for (const x of result) {
      data[+x._id] = x.count
    }

    this.chartOptions = {
      series: [
        {
          name: 'Resume',
          data
        }
      ],
      chart: {
        height: '250',
        type: 'area',
        foreColor: '#ccc',
        toolbar: {
          autoSelected: 'pan',
          show: false
        }
      },
      colors: ['#743ee4'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: 'category',
        categories
      },
      grid: {
        borderColor: '#c8bbe1',
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      tooltip: {
        theme: 'dark'
      }
    };
  }

  #initForm() {

    this.frmResume = new FormGroup({
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
    })

    const start = DateTime
      .local()
      .minus({ week: 1 })
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

    this.#searchResume()
  }

  validateForm() {

    if (this.frmResume.invalid) {
      return this.frmResume.markAllAsTouched()
    }

    if (this.startDate.value > this.endDate.value) {
      return message('Consulta resumen de imágenes procesadas', 'La fecha inicial no puede ser mayor que la fecha inicial', false)
    }

    this.#searchResume()
  }

  #searchResume() {

    const title = 'Consulta resumen de imágenes procesadas'

    this.conversionApiService
      .resume(this.startDate.value, this.endDate.value)
      .then((val: GlobalResponse<ResumeResponse[]>) => {

        if (!val.success) {
          message(title, val.message, false)
          return
        }

        this.#init(val.object)
      })
      .catch(err => {
        message(title, 'Ha ocurrido un error generando la consulta del resumen de imágenes procesadas', false)
      })
  }

  // #addConversion() {

  //   const currentHour = +DateTime.local().toFormat('HH')

  //   this.#data[currentHour]++

  //   this.chartOptions.series = [
  //     {
  //       name: 'Resume',
  //       data: this.#data
  //     }
  //   ]
  // }

  getMessageError(field: string) {
    return FormMessage.get(this.frmResume, field)
  }

  //#endregion
}
