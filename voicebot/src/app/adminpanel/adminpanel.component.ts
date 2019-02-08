import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.scss']
})
export class AdminpanelComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  details:  any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  setValue: any;

  constructor(private  apiService:  ApiService) { }

  ngOnInit() {
    this.getUserDetails();
  }
  public getUserDetails(){
    this.apiService.getDetails().subscribe((data: any) => {
        this.details  =  data.data;
        console.log(this.details);
        this.details.forEach(element => {
          this.setValue = element;
          console.log(this.setValue.ContactNo)
        });
    });
}

}
