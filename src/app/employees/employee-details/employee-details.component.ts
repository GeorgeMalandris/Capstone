import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Device } from 'src/Models/device';
import { Employee } from 'src/Models/employee';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  @Input() selectedEmployee:Employee | null;
  @Input() employeeDevices:Device[];
  @ViewChild("detailsToggle") detailsToggle:ElementRef | null;

  constructor() { 
    this.selectedEmployee = null;
    this.employeeDevices = [];
    this.detailsToggle = null;
  }

  ngOnInit(): void {
  }

  showDetails(devices:Device[]){
    this.employeeDevices = devices;
    this.detailsToggle?.nativeElement.click();
  }

}
