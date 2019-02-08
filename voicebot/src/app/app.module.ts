import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable,  Output, EventEmitter, Input  } from '@angular/core';
import { HttpClientModule } from  '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatPaginatorModule, MatTableModule, MatInputModule } from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { VoicebotComponent } from './voicebot/voicebot.component';
import { ChartModule } from 'angular-highcharts';
import { FilterPipe } from './filter.pipe';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    VoicebotComponent,
    AdminpanelComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule, FormsModule, MatInputModule,
    AppRoutingModule, ChartModule ,
BrowserAnimationsModule, MatPaginatorModule, MatTableModule,
MatButtonModule, MatCheckboxModule, MatTabsModule, HttpClientModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
