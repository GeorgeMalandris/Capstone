import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from 'src/Models/employee';
import { EmployeeDeviceConnection } from 'src/Models/employee-device-connection';
import { DeviceManagementService } from '../device-management-firebase/device-management.service';
import { EmployeeManagementService } from '../employee-management-firebase/employee-management.service';
import { FirebaseDevice } from '../firebase-models/firebase-device';
import { FirebaseEmployee } from '../firebase-models/firebase-employee';
import { FirebaseEmployeeDeviceConnection } from '../firebase-models/firebase-employee-device-connection';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDeviceManagementService {

  employeeDeviceConnections:FirebaseEmployeeDeviceConnection[];
  private deviceInventory:FirebaseDevice[];
  private employees:FirebaseEmployee[];

  constructor(private http:HttpClient, private deviceManagement:DeviceManagementService, private employeeManagement:EmployeeManagementService) { 
    this.employeeDeviceConnections = [];
    this.deviceInventory = this.deviceManagement.devices;
    this.employees = this.employeeManagement.employees;
    this.getEmployeeDeviceConnections();
  }
  
  private getEmployeeDeviceConnections():void{
    this.http.get("https://capstonedb-a452b-default-rtdb.firebaseio.com/EmployeeDevice.json").subscribe(
      (employeeDeviceConnections:any)=>{
        for(let key in employeeDeviceConnections){
          let connection = new FirebaseEmployeeDeviceConnection(key,employeeDeviceConnections[key].employeeId,employeeDeviceConnections[key].deviceSerialNumber);
          this.employeeDeviceConnections.push(connection);
        }
      } 
    );
  }

  addEmployeeDeviceConnection(employeeDeviceConnection:EmployeeDeviceConnection):void{
    this.http.post("https://capstonedb-a452b-default-rtdb.firebaseio.com/EmployeeDevice.json", employeeDeviceConnection).subscribe(
      (firebaseKey:any)=>{
          this.employeeDeviceConnections.push(new FirebaseEmployeeDeviceConnection(firebaseKey.name,employeeDeviceConnection.employeeId,employeeDeviceConnection.deviceSerialNumber));
        }
    );
  }

  removeEmployeeDeviceConnection(firebaseKey:string):void{
    this.http.delete("https://capstonedb-a452b-default-rtdb.firebaseio.com/EmployeeDevice" + firebaseKey + ".json").subscribe(
      ()=>{
        this.employeeDeviceConnections.splice(this.employeeDeviceConnections.findIndex(
          (connection:FirebaseEmployeeDeviceConnection)=>{
            return connection.firebaseKey === firebaseKey
          }),1);
        }
    );
  }

  getAvailableDevices():FirebaseDevice[]{
    let availableDevices:FirebaseDevice[] = [];

    for(let device of this.deviceInventory){
      let index:number = this.employeeDeviceConnections.findIndex(
        (connection:FirebaseEmployeeDeviceConnection)=>{
          return connection.deviceSerialNumber === device.serialNumber;
        }
      );
      if(index === -1){
        availableDevices.push(device);
      }
    }
    return availableDevices;
  }

  getEmployeeDevices(employeeId:number):FirebaseDevice[]{
    let employeeDevices:FirebaseDevice[] = [];
    for(let device of this.deviceInventory){
      let index:number = this.employeeDeviceConnections.findIndex(
        (connection:FirebaseEmployeeDeviceConnection)=>{
          return connection.employeeId === employeeId && device.serialNumber === connection.deviceSerialNumber;
        }
      );
      if(index !== -1){
        employeeDevices.push(device);
      }
    }
    return employeeDevices;
  }

  getEmployee(deviceSerialNumber:string):Employee | null{
    let employeeIdIndex:number = -1;
    employeeIdIndex = this.employeeDeviceConnections.findIndex(
      (connection:FirebaseEmployeeDeviceConnection)=>{
        return connection.deviceSerialNumber === deviceSerialNumber;
      }
    );
    let employee:Employee | null = null;
    if(employeeIdIndex !== -1){
      employee = this.employees.filter(
        (employee:Employee)=>{
          return employee.id === this.employeeDeviceConnections[employeeIdIndex].employeeId;
        })[0];
    }
    return employee;
  }

}
