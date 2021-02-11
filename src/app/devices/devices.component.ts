import { Component, OnInit, ViewChild } from '@angular/core';
import { Device } from 'src/Models/device';
import { DeviceFormComponent } from './device-form/device-form.component';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {

  devices:Device[];
  @ViewChild("deviceForm") deviceForm:DeviceFormComponent | null = null;
  
  constructor() { 
    let device1 = new Device("serial1","description1",1);
    let device2 = new Device("serial2","description2",2);
    let device3 = new Device("serial3","description3",3);

    this.devices = [];
    this.devices.push(device1,device2,device3);
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

  ngOnInit(): void {
  }

}
