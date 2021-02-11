import { Injectable } from '@angular/core';
import { Device } from 'src/Models/device';

@Injectable({
  providedIn: 'root'
})
export class DeviceManagementService {

  devices:Device[];

  constructor() { 
    let device1 = new Device("serial1","description1",1);
    let device2 = new Device("serial2","description2",2);
    let device3 = new Device("serial3","description3",3);

    this.devices = [];
    this.devices.push(device1,device2,device3);
  }
}
