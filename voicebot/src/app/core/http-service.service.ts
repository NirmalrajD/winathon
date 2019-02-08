import { Injectable } from '@angular/core';
import { Observable ,throwError } from 'rxjs';
import { catchError, finalize, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Config } from 'protractor';

@Injectable({
  providedIn: 'root'
})

export class HttpService {
  configUrl : any;
  handleError: any;
  constructor(public http: HttpClient) {

  }

  get(configUrl) {
    return this.http.get<Config>(configUrl)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

}