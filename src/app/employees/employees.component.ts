import { Component, OnInit, ViewChild } from '@angular/core';
import { Employee } from 'src/Models/employee';
import { EmployeeManagementService } from 'src/Services/employee-management.service';
import { EmployeeFormComponent } from './employee-form/employee-form.component';

@Component({
  providers: [EmployeeManagementService],
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  employees!:Employee[];
  @ViewChild("employeeForm") employeeForm:EmployeeFormComponent | null = null;
  
  constructor(private management:EmployeeManagementService) { }

  ngOnInit(): void {
    this.employees = this.management.employees;
  }

  deleteEmployee(employee:Employee):void{
    console.log("delete"+employee.id);
  }

  showEmployeeDetails(employee:Employee):void{
    console.log("show details"+employee.id);
  }

  editEmployee(employee:Employee):void{
    this.employeeForm?.openForm(employee);
  }

  createEmployee():void{
    this.employeeForm?.openForm(null);
  }

  getEmployeeData(employee:Employee){
    console.log(employee.id + employee.name + employee.email);
  }

}
