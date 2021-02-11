import { Component, OnInit, ViewChild } from '@angular/core';
import { Device } from 'src/Models/device';
import { DeviceManagementService } from 'src/Services/device-management.service';
import { DeviceFormComponent } from './device-form/device-form.component';

@Component({
  providers: [DeviceManagementService],
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {

  devices!:Device[]; 
  @ViewChild("deviceForm") deviceForm:DeviceFormComponent | null = null;
  
  constructor(private management:DeviceManagementService) { }

  ngOnInit(): void {
    this.devices = this.management.devices;
  }

  deleteDevice(device:Device):void{
    console.log("delete"+device.serialNumber);
  }

  showDeviceDetails(device:Device):void{
    console.log("show details"+device.serialNumber);
  }

  editDevice(device:Device):void{
    this.deviceForm?.openForm(device);
  }

  createDevice():void{
    this.deviceForm?.openForm(null);
  }

  getDeviceData(device:Device){
    console.log(device.serialNumber + device.description + device.type);
  }

}
