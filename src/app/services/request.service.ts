import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { HttpMethods } from '../utils/enums';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(
    private http: HttpClient
  ) { }

  request(httpMethod: HttpMethods, url: string, params = {}, body = {}) {

    let response!: Promise<any>

    if (httpMethod === HttpMethods.GET) {
      response = firstValueFrom(this.http.get(url, { params }))
    }

    return response
  }
}
