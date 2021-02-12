import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Device } from 'src/Models/device';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit {

  @Input() deviceList:Device[] = [];
  @Output() editDevice=new EventEmitter();
  @Output() showDeviceDetails=new EventEmitter();
  @Output() deleteDevice=new EventEmitter();

  constructor() { 
    this.deviceList = [];
  }

  ngOnInit(): void {
  }

  sendDeviceToEdit(device:Device):void{
    this.editDevice.emit(device);
  }

  sendDeviceToShow(serialNumber:string):void{
    this.showDeviceDetails.emit(serialNumber);
  }

  sendDeviceToDelete(serialNumber:string):void{
    this.deleteDevice.emit(serialNumber);
  }

}
