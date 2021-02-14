import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Device } from 'src/Models/device';
import { Employee } from 'src/Models/employee';
import { EmployeeDeviceManagementService } from 'src/Services/firebase/employee-device-management-firebase/employee-device-management.service';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.css']
})
export class DeviceDetailsComponent implements OnInit {

  selectedDevice:Device | null;
  selectedDeviceEmployee:Employee | null;
  @ViewChild("detailsToggle") detailsToggle:ElementRef | null;

  constructor(private connectionManagement:EmployeeDeviceManagementService) { 
    this.selectedDevice = null;
    this.selectedDeviceEmployee = null;
    this.detailsToggle = null;
  }

  ngOnInit(): void {
    this.connectionManagement.selectedDevice.subscribe(
      (selectedDevice:Device)=>{
        this.selectedDevice = selectedDevice;
      }
    );
    this.connectionManagement.selectedDeviceEmployee.subscribe(
      (selectedDeviceEmployee:Employee)=>{
        this.selectedDeviceEmployee = selectedDeviceEmployee;
      }
    );
  }

  showDetails(serialNumber: string):void{
    this.connectionManagement.selectDevice(serialNumber);
    this.detailsToggle?.nativeElement.click();
  }

  closeDetails():void{
    this.selectedDevice = null;
    this.selectedDeviceEmployee = null;
  }

}
