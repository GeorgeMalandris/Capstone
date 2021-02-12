import { Component, OnInit, ViewChild } from '@angular/core';
import { Device } from 'src/Models/device';
import { Employee } from 'src/Models/employee';
import { EmployeeDeviceConnection } from 'src/Models/employee-device-connection';
import { EmployeeDeviceManagementService } from 'src/Services/firebase/employee-device-management-firebase/employee-device-management.service';
import { EmployeeManagementService } from 'src/Services/firebase/employee-management-firebase/employee-management.service';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';

@Component({
  providers: [EmployeeManagementService],
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  employees!:Employee[];
  @ViewChild("employeeForm") employeeForm:EmployeeFormComponent | null;
  @ViewChild("employeeDetails") employeeDetails:EmployeeDetailsComponent | null;
  employeeToShow!:Employee;
  
  constructor(private employeeManagement:EmployeeManagementService, private connectionManagement:EmployeeDeviceManagementService) { 
    this.employeeForm = null;
    this.employeeDetails = null;
    this.employeeToShow = new Employee(0,"","");
  }

  ngOnInit(): void {
    this.employees = this.employeeManagement.employees;
    this.employeeManagement.selectedEmployee.subscribe(
      (selectedEmployee:Employee)=>{
        this.employeeToShow = selectedEmployee;
      });
  }

  deleteEmployee(employeeId:number):void{
    this.employeeManagement.deleteEmployee(employeeId);
  }

  showEmployeeDetails(employeeId:number):void{
    this.employeeManagement.getEmployee(employeeId);
    let employeeDevices:Device[] = this.connectionManagement.getEmployeeDevices(employeeId);
    this.employeeDetails?.showDetails(employeeDevices);
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

}
