import { Component, OnInit, ViewChild } from '@angular/core';
import { Device } from 'src/Models/device';
import { EmployeeDeviceConnection } from 'src/Models/employee-device-connection';
import { DeviceManagementService } from 'src/Services/firebase/device-management-firebase/device-management.service';
import { EmployeeDeviceManagementService } from 'src/Services/firebase/employee-device-management-firebase/employee-device-management.service';
import { DeviceDetailsComponent } from './device-details/device-details.component';
import { DeviceFormComponent } from './device-form/device-form.component';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {

  devices:Device[]; 
  unavailableSerialNumbers:string[];
  @ViewChild("deviceForm") deviceForm:DeviceFormComponent | null;
  @ViewChild("deviceDetails") deviceDetails:DeviceDetailsComponent | null;
  
  constructor(private deviceManagement:DeviceManagementService, private employeeDeviceManagement: EmployeeDeviceManagementService) { 
    this.devices = [];
    this.unavailableSerialNumbers = [];
    this.deviceForm = null;
    this.deviceDetails = null;
  }

  ngOnInit(): void {
    this.devices = this.deviceManagement.devices;
    this.unavailableSerialNumbers = this.deviceManagement.unavailableSerialNumbers;
  }

  deleteDevice(serialNumber:string):void{
    if(this.employeeDeviceManagement.checkDeviceDelete(serialNumber)){
      this.deviceManagement.deleteDevice(serialNumber);
      return;
    }

    let cascadeDeleteConfirm: boolean = confirm(`The employee has devices assigned to him and he cannot be deleted.
                                                \nWould you like to remove the devices automatically and delete him?`);
    if(!cascadeDeleteConfirm)
      return;

    let connectionsToRemove: EmployeeDeviceConnection[] = this.employeeDeviceManagement.getDeviceConnections(serialNumber);
    for (let connection of connectionsToRemove){
      this.employeeDeviceManagement.removeEmployeeDeviceConnection(connection);
    }
    this.deviceManagement.deleteDevice(serialNumber);
    
  }

  showDeviceDetails(serialNumber:string):void{
    this.deviceDetails?.showDetails(serialNumber);
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
