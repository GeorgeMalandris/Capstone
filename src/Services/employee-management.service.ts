import { Injectable } from '@angular/core';
import { Employee } from 'src/Models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeManagementService {

  employees!:Employee[];

  constructor() { 
    let employee1 = new Employee(1,"George","georgemalandris@gmail.com");
    let employee2 = new Employee(2,"George2","georgemalandris2@gmail.com");

    this.employees = [];
    this.employees.push(employee1,employee2);
  }
}
