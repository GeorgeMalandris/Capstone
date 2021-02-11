import { Component, OnInit, ViewChild } from '@angular/core';
import { Employee } from 'src/Models/employee';
import { EmployeeFormComponent } from './employee-form/employee-form.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  employees:Employee[];
  @ViewChild("employeeForm") employeeForm:EmployeeFormComponent | null = null;
  
  constructor() { 
    let employee1 = new Employee(1,"George","georgemalandris@gmail.com");
    let employee2 = new Employee(2,"George2","georgemalandris2@gmail.com");

    this.employees = [];
    this.employees.push(employee1,employee2);
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

  ngOnInit(): void {
  }

}
