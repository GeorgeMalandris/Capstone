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
      },
      (error)=>{
        alert("Something went wrong while loading the employee - device connections.\nPlease try again later.")
      }
    );
  }

  addEmployeeDeviceConnection(employeeDeviceConnection:EmployeeDeviceConnection):void{
    let validInsert:boolean = this.checkValidInsert(employeeDeviceConnection);
    if(validInsert){
      this.http.post("https://capstonedb-a452b-default-rtdb.firebaseio.com/EmployeeDevice.json", employeeDeviceConnection).subscribe(
      (firebaseKey:any)=>{
          this.employeeDeviceConnections.push(new FirebaseEmployeeDeviceConnection(firebaseKey.name,employeeDeviceConnection.employeeId,employeeDeviceConnection.deviceSerialNumber));
          this.availableDevices.emit(this.getAvailableDevices());
          if(this.employeeSelected && employeeDeviceConnection.employeeId === this.employeeSelected.id){
            this.selectedEmployeeDevices.emit(this.getEmployeeDevices(this.employeeSelected?.id));
          }
        },
        (error)=>{
          alert("The device is already assigned in an employee.\nYou cannot assign it to someone else.")
        }
      );
    }
    else{
      alert("The connection you are trying to add is not valid.\nPlease check the employee ID and the device Serial Number.")
    }
  }

  removeEmployeeDeviceConnection(employeeDeviceConnection:EmployeeDeviceConnection):void{
    let firebaseKey:string = this.getFirebaseKey(employeeDeviceConnection);
    if(firebaseKey){
      this.http.delete("https://capstonedb-a452b-default-rtdb.firebaseio.com/EmployeeDevice/" + firebaseKey + ".json").subscribe(
      ()=>{
        this.employeeDeviceConnections.splice(this.employeeDeviceConnections.findIndex(
          (connection:FirebaseEmployeeDeviceConnection)=>{
            return connection.firebaseKey === firebaseKey
          }),1);
          this.availableDevices.emit(this.getAvailableDevices());
          if(this.employeeSelected && employeeDeviceConnection.employeeId === this.employeeSelected.id){
            this.selectedEmployeeDevices.emit(this.getEmployeeDevices(this.employeeSelected?.id));
          }
        },
        (error)=>{
          alert("Something went wrong while removing the device from the employee.\nPlease try again later.")
        }
      );
    }
    else{
      alert("The connection you are trying to remove does not exist.\nPlease check the employee ID and the device Serial Number.")
    }
  }

  selectEmployee(employeeId:number):void{
    let employeeIndex:number = this.getEmployeeIndex(employeeId);

    if(employeeIndex !== -1 ){
      this.employeeSelected = this.employees[employeeIndex];
      this.selectedEmployee.emit(this.employeeSelected);
      this.selectedEmployeeDevices.emit(this.getEmployeeDevices(employeeId));
      this.availableDevices.emit(this.getAvailableDevices());
    }
    else{
      this.employeeSelected = null;
      this.selectedDevice.emit(this.employeeSelected);
      this.selectedDeviceEmployee.emit(null);
      this.availableDevices.emit(null);
    }
  }

  selectDevice(deviceSerialNumber:string):void{
    let deviceIndex:number = this.getDeviceIndex(deviceSerialNumber);

    if(deviceIndex !== -1 ){
      this.deviceSelected = this.deviceInventory[deviceIndex];
      this.selectedDevice.emit(this.deviceSelected);
      this.selectedDeviceEmployee.emit(this.getEmployeeFromDevice(deviceSerialNumber));
    }
    else{
      this.deviceSelected = null;
      this.selectedDevice.emit(this.deviceSelected);
      this.selectedDeviceEmployee.emit(null);
    }
  }

  checkEmployeeDelete(employeeId:number):boolean{
    return this.getEmployeeDevices(employeeId).length === 0;
  }

  checkDeviceDelete(deviceSerialNumber:string):boolean{
    return this.getConnectionIndex(deviceSerialNumber) === -1;
  }

  getEmployeeConnections(employeeId:number):FirebaseEmployeeDeviceConnection[]{
    return this.employeeDeviceConnections.filter(
      (connection:FirebaseEmployeeDeviceConnection)=>{
        return connection.employeeId === employeeId;
      }
    );
  }

  getDeviceConnections(deviceSerialNumber:string):FirebaseEmployeeDeviceConnection[]{
    return this.employeeDeviceConnections.filter(
      (connection:FirebaseEmployeeDeviceConnection)=>{
        return connection.deviceSerialNumber === deviceSerialNumber;
      }
    );
  }
  
  private getAvailableDevices():FirebaseDevice[]{
    let availableDevices:FirebaseDevice[] = [];

    for(let device of this.deviceInventory){
      let index:number = this.getConnectionIndex(device.serialNumber);
      if(index === -1){
        availableDevices.push(device);
      }
    }
    return availableDevices;
  }
  
  private getEmployeeDevices(employeeId:number):FirebaseDevice[]{
    let employeeDevices:FirebaseDevice[] = [];
    for(let device of this.deviceInventory){
      let index:number = this.getConnectionIndex(device.serialNumber,employeeId);
      if(index !== -1){
        employeeDevices.push(device);
      }
    }
    return employeeDevices;
  }

  private getEmployeeFromDevice(deviceSerialNumber:string):Employee | null{

    let connectionIndex:number = this.getConnectionIndex(deviceSerialNumber);
    if(connectionIndex === -1)
      return null;

    let employeeId:number = this.employeeDeviceConnections[connectionIndex].employeeId;
    let employeeIndex:number = this.getEmployeeIndex(employeeId);
    if(employeeIndex === -1)
      return null;

    return this.employees[employeeIndex];
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
    let connectionIndex:number = this.getConnectionIndex(connection.deviceSerialNumber, connection.employeeId);
    if(connectionIndex === -1)
      return "";
    
    return this.employeeDeviceConnections[connectionIndex].firebaseKey;
  }

  private getConnectionIndex(deviceSerialNumber:string, employeeId:number | null = null, ): number{
    return this.employeeDeviceConnections.findIndex(
      (connection:FirebaseEmployeeDeviceConnection)=>{

        if(employeeId && deviceSerialNumber)
          return connection.employeeId === employeeId && deviceSerialNumber === connection.deviceSerialNumber;

        if(deviceSerialNumber)
          return deviceSerialNumber === connection.deviceSerialNumber;

        return false;
      }
    );
  }

  private checkValidInsert(connection:EmployeeDeviceConnection):boolean{
    let employeeIndex:number = this.getEmployeeIndex(connection.employeeId);
    if(employeeIndex === -1)
      return false;

    let deviceIndex:number = this.getDeviceIndex(connection.deviceSerialNumber);
    if(deviceIndex === -1)
      return false;

    let connectionIndex:number = this.getConnectionIndex(connection.deviceSerialNumber, connection.employeeId);
    if(connectionIndex !== -1)
      return false;

    return true;
  }

}
