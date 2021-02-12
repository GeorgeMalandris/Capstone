import { Component, OnInit, ViewChild } from '@angular/core';
import { Device } from 'src/Models/device';
import { DeviceManagementService } from 'src/Services/firebase/device-management-firebase/device-management.service';
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
  @ViewChild("deviceForm") deviceForm:DeviceFormComponent | null = null;
  
  constructor(private deviceManagement:DeviceManagementService) { }

  ngOnInit(): void {
    this.devices = this.deviceManagement.devices;
    this.unavailableSerialNumbers = this.deviceManagement.unavailableSerialNumbers;
  }

  deleteDevice(serialNumber:string):void{
    this.deviceManagement.deleteDevice(serialNumber);
  }

  showDeviceDetails(serialNumber:string):void{
    this.deviceManagement.getDevice(serialNumber);
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
