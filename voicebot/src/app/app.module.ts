import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from  '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatPaginatorModule, MatTableModule } from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { VoicebotComponent } from './voicebot/voicebot.component';

@NgModule({
  declarations: [
    AppComponent,
    VoicebotComponent,
    AdminpanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
BrowserAnimationsModule, MatPaginatorModule, MatTableModule,
MatButtonModule, MatCheckboxModule, MatTabsModule, HttpClientModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
