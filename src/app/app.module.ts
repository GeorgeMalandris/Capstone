import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeFormComponent } from './employees/employee-form/employee-form.component';
import { DeviceFormComponent } from './devices/device-form/device-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeListComponent } from './employees/employee-list/employee-list.component';
import { DeviceListComponent } from './devices/device-list/device-list.component';
import { EmployeesComponent } from './employees/employees.component';
import { DevicesComponent } from './devices/devices.component';
import { HttpClientModule } from '@angular/common/http';
import { EmployeeDetailsComponent } from './employees/employee-details/employee-details.component';
import { DeviceDetailsComponent } from './devices/device-details/device-details.component';
import { EmployeeDeviceManageComponent } from './employees/employee-device-manage/employee-device-manage.component';
import { EmployeeManagementService } from 'src/Services/firebase/employee-management-firebase/employee-management.service';
import { DeviceManagementService } from 'src/Services/firebase/device-management-firebase/device-management.service';
import { EmployeeDeviceManagementService } from 'src/Services/firebase/employee-device-management-firebase/employee-device-management.service';
import { DatabaseConnectionService } from 'src/Services/firebase/database-connection/database-connection.service';
import { DatabaseInitiazeComponent } from './database-initiaze/database-initiaze.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeFormComponent,
    DeviceFormComponent,
    EmployeeListComponent,
    DeviceListComponent,
    EmployeesComponent,
    DevicesComponent,
    EmployeeDetailsComponent,
    DeviceDetailsComponent,
    EmployeeDeviceManageComponent,
    DatabaseInitiazeComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    EmployeeManagementService,
    DeviceManagementService,
    EmployeeDeviceManagementService,
    DatabaseConnectionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
