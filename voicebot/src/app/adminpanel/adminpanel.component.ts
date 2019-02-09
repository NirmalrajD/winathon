
import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { ApiService } from '../services/api.service';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.scss']
})
export class AdminpanelComponent implements OnInit {
  statusval:any;
  public searchString: string;
  details:  any;
  setValue: any;
  Enquirydetails:any;
  status: any;
  chart:any;
  chartData:any;
  openticket:any;
  pendingticket:any;
  closedticket:any;
  openedTicket: any[] = [];
  ClosedTicket: any[] = []; 
  SubmitTicket: any[] = [];

  constructor(private apiService: ApiService) { }


  ngOnInit() {
    this.getUserDetails();
    this.getEnquiriesDetails();
    this.ticketschart();
    //this.chart.series[0].setData([89,71,16]);
  }
 
    getUserDetails(){
        this.apiService.getDetails().subscribe((data: any) => {
            this.details  =  data.data;
          this.details.forEach(element => {
            this.setValue = element;
          });
      });
    }

    getEnquiriesDetails(){
      this.apiService.getEnquiryDetails().subscribe((datas: any) => {
        this.Enquirydetails = datas;
        this.Enquirydetails.forEach(element => {
          this.status = element;
          if(this.status == 'Open'){
            this.openedTicket.push(this.details);
            }else if(this.status == 'Closed'){
            this.ClosedTicket.push(this.details);
            }else {
            this.SubmitTicket.push(this.details);
            }          
          });

        console.log(this.openedTicket)
    });
  }
  ticketschart(){
   
   
 
  }
}