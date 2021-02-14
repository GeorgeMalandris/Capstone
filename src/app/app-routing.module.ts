import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DevicesComponent } from './devices/devices.component';
import { EmployeesComponent } from './employees/employees.component';

const routes: Routes = [
  {path:'home', component:EmployeesComponent},
  {path:'employees', component:EmployeesComponent},
  {path:'devices', component:DevicesComponent},
  {path:'', redirectTo:'employees', pathMatch:"full"},
  {path:'*', redirectTo:'employees', pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
