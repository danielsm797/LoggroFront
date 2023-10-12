import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { HttpMethods } from '../utils/enums';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ConversionApiService {

  constructor(
    private requestService: RequestService
  ) { }

  search(startDate: string, endDate: string) {
    return this.requestService
      .request(HttpMethods.GET, environment.search, { fi: startDate, ff: endDate })
  }

  resume(startDate: string, endDate: string) {
    return this.requestService
      .request(HttpMethods.GET, environment.resume, { fi: startDate, ff: endDate })
  }

  convert(form: FormData, userName: string, fileName: string) {
    return this.requestService
      .request(HttpMethods.POST, environment.convert, { userName, fileName }, form)
  }
}
