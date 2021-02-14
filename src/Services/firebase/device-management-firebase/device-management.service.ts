import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { FirebaseDevice } from 'src/Services/firebase/firebase-models/firebase-device';
import { Device } from 'src/Models/device';
import { DatabaseConnectionService } from '../database-connection/database-connection.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceManagementService {

  private databaseString!:string | null;

  devices!:FirebaseDevice[];
  @Output() selectedDevice = new EventEmitter();
  unavailableSerialNumbers!:string[];

  constructor(private database:DatabaseConnectionService, private http:HttpClient) { 
    this.databaseString = this.database.getDatabase();
    this.devices = [];
    this.unavailableSerialNumbers = [];
    this.getDevices();
  }

  getDevices():void{
    if(!this.databaseString)
      return;
    this.http.get(this.databaseString + "/Devices.json").subscribe(
      (devices:any)=>{
        for(let key in devices){
          let device = new FirebaseDevice(key,devices[key].serialNumber,devices[key].description,devices[key].type);
          this.devices.push(device);
          this.unavailableSerialNumbers.push(devices[key].serialNumber);
        }
      },
      (error) => {
        alert("Something went wrong while loading the devices.\nPlease try again later.")
      }
    );
  }

  getDevice(serialNumber:string):void{
    if(!this.databaseString)
      return;
    let firebaseKey:string = this.getFirebaseKey(serialNumber);
    if(firebaseKey){
      this.http.get(this.databaseString + "/Devices/" + firebaseKey + ".json").subscribe(
      (device:any)=>{
        let newDeviceSelection = new FirebaseDevice(firebaseKey,device.serialNumber,device.description,device.type);
        this.selectedDevice.emit(newDeviceSelection);
        },
        (error)=>{
          alert("Something went wrong while loading the device.\nPlease try again later.")
        }
      );
    }
    else{
      alert("Invalid Device Serial Number.")
    }
    
  }

  addDevice(device:Device):void{
    if(!this.databaseString)
      return;
    let firebaseKey:string = this.getFirebaseKey(device.serialNumber);
    if(!firebaseKey){
      this.http.post(this.databaseString + "/Devices.json", device).subscribe(
      (firebaseKey:any)=>{
          this.devices.push(new FirebaseDevice(firebaseKey.name,device.serialNumber,device.description,device.type));
          this.unavailableSerialNumbers.push(device.serialNumber);
        },
        (error)=>{
          alert("Something went wrong while adding the device.\nPlease try again later.")
        }
      );
    }
    else{
      alert("The device Serial Number is already in the database.\nYou cannot add it again.")
    }
  }

  editDevice(deviceToEdit:Device):void{
    if(!this.databaseString)
      return;
    let firebaseKey:string = this.getFirebaseKey(deviceToEdit.serialNumber);
    if(firebaseKey){
      this.http.put(this.databaseString + "/Devices/" + firebaseKey + ".json", deviceToEdit).subscribe(
      (device:any)=>{
        this.devices.splice(this.devices.findIndex(
          (device:FirebaseDevice)=>{
            return device.firebaseKey === firebaseKey;
          }),1);

        this.devices.push(new FirebaseDevice(firebaseKey,device.serialNumber,device.description,device.type));
        },
        (error)=>{
          alert("Something went wrong while editing the device.\nPlease try again later.")
        }
      );
    }
    else{
      alert("The device you are trying to edit does not exist.\nPlease check the Serial Number.")
    }
  }

  deleteDevice(serialNumber:string):void{
    if(!this.databaseString)
      return;
    let firebaseKey:string = this.getFirebaseKey(serialNumber);
    if(firebaseKey){
      this.http.delete(this.databaseString + "/Devices/" + firebaseKey + ".json").subscribe(
      ()=>{
        this.devices.splice(this.devices.findIndex(
          (device:FirebaseDevice)=>{
            return device.firebaseKey === firebaseKey
          }),1);
          this.unavailableSerialNumbers.splice(this.unavailableSerialNumbers.findIndex(
            (serialNumberUnavailable)=>{
              return serialNumberUnavailable === serialNumber;
            }
          ),1);
        },
        (error)=>{
          alert("Something went wrong while deleting the device.\nPlease try again later.")
        }
      );
    }
    else{
      alert("The device you are trying to delete does not exist.\nPlease check the Serial Number.")
    }
  }

  private getFirebaseKey(serialNumber:string):string {
    let deviceIndex:number = this.getIndexOfFirebaseKey(serialNumber);
    if(deviceIndex === -1)
      return "";
    return this.devices[deviceIndex].firebaseKey;
  }
  
  private getIndexOfFirebaseKey(serialNumber:string):number{
    return this.devices.findIndex(
      (device:FirebaseDevice) => {
        return device.serialNumber === serialNumber;
      }
    );
  }

}
