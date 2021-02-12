import { Component, OnInit, ViewChild } from '@angular/core';
import { Device } from 'src/Models/device';
import { Employee } from 'src/Models/employee';
import { DeviceManagementService } from 'src/Services/firebase/device-management-firebase/device-management.service';
import { EmployeeDeviceManagementService } from 'src/Services/firebase/employee-device-management-firebase/employee-device-management.service';
import { DeviceDetailsComponent } from './device-details/device-details.component';
import { DeviceFormComponent } from './device-form/device-form.component';

@Component({
  providers: [DeviceManagementService],
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {

  devices!:Device[]; 
  unavailableSerialNumbers!:string[];
  @ViewChild("deviceForm") deviceForm:DeviceFormComponent | null;
  @ViewChild("deviceDetails") deviceDetails:DeviceDetailsComponent | null;
  deviceToShow:Device;
  
  constructor(private deviceManagement:DeviceManagementService, private connectionManagement:EmployeeDeviceManagementService) { 
    this.deviceForm = null;
    this.deviceDetails = null;
    this.deviceToShow = new Device("","",-1);
  }

  ngOnInit(): void {
    this.devices = this.deviceManagement.devices;
    this.unavailableSerialNumbers = this.deviceManagement.unavailableSerialNumbers;
    this.deviceManagement.selectedDevice.subscribe(
      (selectedDevice:Device)=>{
        this.deviceToShow = selectedDevice;
      });
  }

  deleteDevice(serialNumber:string):void{
    this.deviceManagement.deleteDevice(serialNumber);
  }

  showDeviceDetails(serialNumber:string):void{
    this.deviceManagement.getDevice(serialNumber);
    let employee:Employee | null = this.connectionManagement.getEmployee(serialNumber);
    this.deviceDetails?.showDetails(employee);
  }

  editDevice(device:Device):void{
    this.deviceForm?.openForm(device);
  }

  createDevice():void{
    this.deviceForm?.openForm(null);
  }

  getDeviceData(device:Device){
    let deviceIndex:number = this.unavailableSerialNumbers.indexOf(device.serialNumber);
    if(deviceIndex === -1){
      this.deviceManagement.addDevice(device);
    }
    else{
      this.deviceManagement.editDevice(device);
    }
  }

}
