import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Device } from 'src/Models/device';
import { Employee } from 'src/Models/employee';
import { EmployeeDeviceManagementService } from 'src/Services/firebase/employee-device-management-firebase/employee-device-management.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  selectedEmployee:Employee | null;
  employeeDevices:Device[];
  @ViewChild("detailsToggle") detailsToggle:ElementRef | null;

  constructor( private connectionManagement:EmployeeDeviceManagementService) { 
    this.selectedEmployee = null;
    this.employeeDevices = [];
    this.detailsToggle = null;
  }

  ngOnInit(): void {
    this.connectionManagement.selectedEmployee.subscribe(
      (selectedEmployee:Employee)=>{
        this.selectedEmployee = selectedEmployee;
      }
    );
    this.connectionManagement.selectedEmployeeDevices.subscribe(
      (selectedEmployeeDevices:Device[])=>{
        this.employeeDevices = selectedEmployeeDevices;
      }
    );
  }

  showDetails(employeeId:number):void{
    this.connectionManagement.selectEmployee(employeeId);
    this.detailsToggle?.nativeElement.click();
  }

  closeDetails():void{
    this.selectedEmployee = null;
    this.employeeDevices = [];
  }

}
