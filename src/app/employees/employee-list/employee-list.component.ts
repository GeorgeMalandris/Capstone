import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Employee } from 'src/Models/employee';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  @Input() employeeList:Employee[];
  @Output() editEmployee=new EventEmitter();
  @Output() showEmployeeDetails=new EventEmitter();
  @Output() deleteEmployee=new EventEmitter();
  @Output() manageEmployeeDevices=new EventEmitter();

  constructor() { 
    this.employeeList = [];
  }

  ngOnInit(): void {
  }

  sendEmployeeToEdit(employee:Employee):void{
    this.editEmployee.emit(employee);
  }

  sendEmployeeToShow(employeeId:number):void{
    this.showEmployeeDetails.emit(employeeId);
  }

  sendEmployeeToDelete(employeeId:number):void{
    this.deleteEmployee.emit(employeeId);
  }

  sendEmployeeToManageDevices(employeeId:number):void{
    this.manageEmployeeDevices.emit(employeeId);
  }

}
