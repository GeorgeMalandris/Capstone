import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Employee } from 'src/Models/employee';
import { EmployeeDeviceConnection } from 'src/Models/employee-device-connection';
import { EmployeeDeviceManagementService } from 'src/Services/firebase/employee-device-management-firebase/employee-device-management.service';
import { EmployeeManagementService } from 'src/Services/firebase/employee-management-firebase/employee-management.service';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { EmployeeDeviceManageComponent } from './employee-device-manage/employee-device-manage.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  employees:Employee[];
  @ViewChild("employeeForm") employeeForm:EmployeeFormComponent | null;
  @ViewChild("employeeDetails") employeeDetails:EmployeeDetailsComponent | null;
  @ViewChild("manageEmployeeDevices") manageEmployeeDevices:EmployeeDeviceManageComponent | null;
  
  constructor(private employeeManagement:EmployeeManagementService, private employeeDeviceManagement: EmployeeDeviceManagementService) { 
    this.employees = [];
    this.employeeForm = null;
    this.employeeDetails = null;
    this.manageEmployeeDevices = null;
  }

  ngOnInit(): void {
    this.employees = this.employeeManagement.employees;
  }

  deleteEmployee(employeeId:number):void{
    if(this.employeeDeviceManagement.checkEmployeeDelete(employeeId)){
      this.employeeManagement.deleteEmployee(employeeId);
      return;
    }
    
    let cascadeDeleteConfirm: boolean = confirm(`The employee has devices assigned to him and he cannot be deleted.
                                                \nWould you like to remove the devices automatically and delete him?`);
    if(!cascadeDeleteConfirm)
      return;

    let connectionsToRemove: EmployeeDeviceConnection[] = this.employeeDeviceManagement.getEmployeeConnections(employeeId);
    for (let connection of connectionsToRemove){
      this.employeeDeviceManagement.removeEmployeeDeviceConnection(connection);
    }
    this.employeeManagement.deleteEmployee(employeeId);
  }

  showEmployeeDetails(employeeId:number):void{
    this.employeeDetails?.showDetails(employeeId);
  }

  editEmployee(employee:Employee):void{
    this.employeeForm?.openForm(employee);
  }

  createEmployee():void{
    this.employeeForm?.openForm(null);
  }

  saveEmployeeData(employee:Employee){
    if(!employee.id){
      employee.id = this.employeeManagement.nextId;
      this.employeeManagement.addEmployee(employee);
    }
    else{
      this.employeeManagement.editEmployee(employee);
    }
  }

  openManageEmployeeDevices(employeeId:number):void{
    this.manageEmployeeDevices?.openEmployeeDevicesManage(employeeId);
  }

}
