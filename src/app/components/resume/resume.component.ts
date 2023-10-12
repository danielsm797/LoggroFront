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

  #data: number[] = []

  //#endregion

  //#region Constructors

  constructor(
    private conversionApiService: ConversionApiService,
    private eventsService: EventsService
  ) {

    this.#initSubs()
    this.searchResume()
  }

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
            this.#addConversion()
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

    this.#data = data

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

  searchResume() {

    const title = 'Consulta resumen de imágenes procesadas'

    this.conversionApiService
      .resume()
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

  #addConversion() {

    const currentHour = +DateTime.local().toFormat('HH')

    this.#data[currentHour]++

    this.chartOptions.series = [
      {
        name: 'Resume',
        data: this.#data
      }
    ]
  }

  //#endregion
}
