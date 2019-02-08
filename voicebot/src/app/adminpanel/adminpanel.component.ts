import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { ApiService } from '../services/api.service';
declare let d3: any;
@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.scss']
})
export class AdminpanelComponent implements OnInit {
  options: any;
  datatval:any;
  details:  any;
  setValue: any;

  constructor(private  apiService:  ApiService) { }

  ngOnInit() {
    this.getUserDetails();
  this.options = {
      chart: {
        type: 'pieChart',
        useInteractiveGuideline: true,
        height: 450,
        transitionDuration: 350,
        showLegend: false,
        margin: {
          top: 20,
          right: 20,
          bottom: 40,
          left: 55
        },
        x: (d) => { return d.x; },
        y: (d) => { return d.y; },
        xScale: d3.time.scale(),
        xAxis: {
          ticks: d3.time.months,
          tickFormat: (d) => {
              return d3.time.format('%b')(new Date(d));
          }
        },
        yAxis: {
          axisLabel: 'Gross volume',
          tickFormat: (d) => {
              if (d == null) {
                  return 0;
              }
              return d3.format('.02f')(d);
          },
          axisLabelDistance: 400
        }
      },"pie":{donut:true}
    }

this.datatval  = [
      {
        key: "Ticket details",
        values: [
          {
            "label" : "A" ,
            "value" : -29.765957771107
          } ,
          {
            "label" : "B" ,
            "value" : 0
          } ,
          {
            "label" : "C" ,
            "value" : 32.807804682612
          } ]}];
  }
  public getUserDetails(){
    this.apiService.getDetails().subscribe((data: any) => {
        this.details  =  data.data;
       /* this.details.forEach(element => {
          this.setValue = element;
          console.log(this.setValue)
          console.log(this.setValue.Location);
        });*/
    });
}

}
