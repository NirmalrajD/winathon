import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';

const routes: Routes = [{ path: 'Admin', component: AdminpanelComponent },
{ path: '',
<<<<<<< Updated upstream
    redirectTo: '/',
=======
    redirectTo: '/Admin',
>>>>>>> Stashed changes
    pathMatch: 'full'
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
