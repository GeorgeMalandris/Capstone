import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
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
  @Output() availableDevices = new EventEmitter();
  @Output() selectedEmployee = new EventEmitter();
  @Output() selectedEmployeeDevices = new EventEmitter();
  @Output() selectedDevice = new EventEmitter();
  @Output() selectedDeviceEmployee = new EventEmitter();
  private employeeSelected:FirebaseEmployee | null;
  private deviceSelected:FirebaseDevice | null;
  private deviceInventory:FirebaseDevice[];
  private employees:FirebaseEmployee[];

  constructor(private http:HttpClient, private deviceManagement:DeviceManagementService, private employeeManagement:EmployeeManagementService) { 
    this.employeeDeviceConnections = [];
    this.employeeSelected = null;
    this.deviceSelected = null;
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
        this.availableDevices.emit(this.getAvailableDevices());
      } 
    );
  }

  addEmployeeDeviceConnection(employeeDeviceConnection:EmployeeDeviceConnection):void{
    this.http.post("https://capstonedb-a452b-default-rtdb.firebaseio.com/EmployeeDevice.json", employeeDeviceConnection).subscribe(
      (firebaseKey:any)=>{
          this.employeeDeviceConnections.push(new FirebaseEmployeeDeviceConnection(firebaseKey.name,employeeDeviceConnection.employeeId,employeeDeviceConnection.deviceSerialNumber));
          this.availableDevices.emit(this.getAvailableDevices());
          if(employeeDeviceConnection.employeeId === this.employeeSelected?.id){
            this.selectedEmployeeDevices.emit(this.getEmployeeDevices(this.employeeSelected?.id));
          }
        }
    );
  }

  removeEmployeeDeviceConnection(employeeDeviceConnection:EmployeeDeviceConnection):void{
    let firebaseKey:string = this.getFirebaseKey(employeeDeviceConnection);
    this.http.delete("https://capstonedb-a452b-default-rtdb.firebaseio.com/EmployeeDevice/" + firebaseKey + ".json").subscribe(
      ()=>{
        this.employeeDeviceConnections.splice(this.employeeDeviceConnections.findIndex(
          (connection:FirebaseEmployeeDeviceConnection)=>{
            return connection.firebaseKey === firebaseKey
          }),1);
          this.availableDevices.emit(this.getAvailableDevices());
          if(employeeDeviceConnection.employeeId === this.employeeSelected?.id){
            this.selectedEmployeeDevices.emit(this.getEmployeeDevices(this.employeeSelected?.id));
          }
        }
    );
  }

  selectEmployee(employeeId:number):void{
    let employeeIndex:number = this.employees.findIndex(
      (employee:FirebaseEmployee)=>{
        return employee.id === employeeId;
      }
    );

    if(employeeIndex !== -1 ){
      this.employeeSelected = this.employees[employeeIndex];
      this.selectedEmployee.emit(this.employeeSelected);
      this.selectedEmployeeDevices.emit(this.getEmployeeDevices(employeeId));
      this.availableDevices.emit(this.getAvailableDevices());
    }
    else{
      this.employeeSelected = null;
      this.selectedDevice.emit(this.employeeSelected);
      this.selectedDeviceEmployee.emit();
    }
  }

  selectDevice(deviceSerialNumber:string):void{
    let deviceIndex:number = this.deviceInventory.findIndex(
      (device:FirebaseDevice)=>{
        return device.serialNumber === deviceSerialNumber;
      }
    );

    if(deviceIndex !== -1 ){
      this.deviceSelected = this.deviceInventory[deviceIndex];
      this.selectedDevice.emit(this.deviceSelected);
      this.selectedDeviceEmployee.emit(this.getEmployeeFromDevice(deviceSerialNumber));
    }
    else{
      this.deviceSelected = null;
      this.selectedDevice.emit(this.deviceSelected);
      this.selectedDeviceEmployee.emit();
    }
  }
  
  private getAvailableDevices():FirebaseDevice[]{
    let availableDevices:FirebaseDevice[] = [];

    for(let device of this.deviceInventory){
      let index:number = this.getConnectionIndex(null,device.serialNumber);
      if(index === -1){
        availableDevices.push(device);
      }
    }
    return availableDevices;
  }
  private getEmployeeDevices(employeeId:number):FirebaseDevice[]{
    let employeeDevices:FirebaseDevice[] = [];
    for(let device of this.deviceInventory){
      let index:number = this.getConnectionIndex(employeeId,device.serialNumber);
      if(index !== -1){
        employeeDevices.push(device);
      }
    }
    return employeeDevices;
  }
  private getEmployeeFromDevice(deviceSerialNumber:string):Employee | null{

    let connectionIndex:number = this.getConnectionIndex(null,deviceSerialNumber);
    if(connectionIndex === -1)
      return null;

    let employeeId:number = this.employeeDeviceConnections[connectionIndex].employeeId;
    let employeeIndex:number = this.getEmployeeIndex(employeeId);
    if(employeeIndex === -1)
      return null;

    return this.employees[employeeIndex];
  }
  private getConnectionIndex(employeeId:number | null = null, deviceSerialNumber:string | null = null): number{
    return this.employeeDeviceConnections.findIndex(
      (connection:FirebaseEmployeeDeviceConnection)=>{

        if(employeeId && deviceSerialNumber)
          return connection.employeeId === employeeId && deviceSerialNumber === connection.deviceSerialNumber;

        if(employeeId)
          return connection.employeeId === employeeId;

        if(deviceSerialNumber)
          return deviceSerialNumber === connection.deviceSerialNumber;

        return false;
      }
    );
  }
  private getEmployeeIndex(employeeId:number): number{
    return this.employees.findIndex(
      (employee:FirebaseEmployee)=>{
        return employee.id === employeeId;
      }
    );
  }
  private getDeviceIndex(deviceSerialNumber:string): number{
    return this.deviceInventory.findIndex(
      (device:FirebaseDevice)=>{
        return device.serialNumber === deviceSerialNumber;
      }
    );
  }
  private getFirebaseKey(connection:EmployeeDeviceConnection): string{
    let connectionIndex:number = this.getConnectionIndex(connection.employeeId,connection.deviceSerialNumber);
    if(connectionIndex === -1)
      return "";
    
    return this.employeeDeviceConnections[connectionIndex].firebaseKey;
  }

}
