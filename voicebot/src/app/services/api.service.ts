import { Injectable } from '@angular/core';
import { HttpService } from '../core/http-service.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  API_URL  = 'http://192.168.27.58/api/GetCustomers';
  API_URL_Enquiries  = 'http://192.168.27.58/api/GetEnquires/';

  constructor(private  httpClient:  HttpService) { }

  getDetails(){
    return  this.httpClient.get(this.API_URL);
  }

    getEnquiryDetails(){
    return  this.httpClient.get(this.API_URL_Enquiries);
  }

}

