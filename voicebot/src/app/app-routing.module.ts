import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { VoicebotComponent } from './voicebot/voicebot.component';

const routes: Routes = [
  { path: '', component: VoicebotComponent},
  { path: '/Admin', component: AdminpanelComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
