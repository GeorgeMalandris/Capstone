import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { FirebaseDevice } from 'src/Services/firebase/firebase-models/firebase-device';
import { Device } from 'src/Models/device';

@Injectable({
  providedIn: 'root'
})
export class DeviceManagementService {

  devices:FirebaseDevice[];
  @Output() selectedDevice = new EventEmitter();
  unavailableSerialNumbers:string[];

  constructor(private http:HttpClient) { 
    this.devices = [];
    this.unavailableSerialNumbers = [];
    this.getDevices();
  }

  getDevices():void{
    this.http.get("https://capstonedb-a452b-default-rtdb.firebaseio.com/Devices.json").subscribe(
      (devices:any)=>{
        for(let key in devices){
          let device = new FirebaseDevice(key,devices[key].serialNumber,devices[key].description,devices[key].type);
          this.devices.push(device);
          this.unavailableSerialNumbers.push(devices[key].serialNumber);
        }
      } 
    );
  }

  getDevice(serialNumber:string):void{
    let firebaseKey:string = this.getFirebaseKey(serialNumber);
    this.http.get("https://capstonedb-a452b-default-rtdb.firebaseio.com/Devices/" + firebaseKey + ".json").subscribe(
      (device:any)=>{
        let newDeviceSelection = new FirebaseDevice(firebaseKey,device.serialNumber,device.description,device.type);
        this.selectedDevice.emit(newDeviceSelection);
        }
    );
  }

  addDevice(device:Device):void{
    this.http.post("https://capstonedb-a452b-default-rtdb.firebaseio.com/Devices.json", device).subscribe(
      (firebaseKey:any)=>{
          this.devices.push(new FirebaseDevice(firebaseKey.name,device.serialNumber,device.description,device.type));
          this.unavailableSerialNumbers.push(device.serialNumber);
        }
    );
  }

  editDevice(deviceToEdit:Device):void{
    let firebaseKey:string = this.getFirebaseKey(deviceToEdit.serialNumber);
    this.http.put("https://capstonedb-a452b-default-rtdb.firebaseio.com/Devices/" + firebaseKey + ".json", deviceToEdit).subscribe(
      (device:any)=>{
        this.devices.splice(this.devices.findIndex(
          (device:FirebaseDevice)=>{
            return device.firebaseKey === firebaseKey;
          }),1);

        this.devices.push(new FirebaseDevice(firebaseKey,device.serialNumber,device.description,device.type));
        }
    );
  }

  deleteDevice(serialNumber:string):void{
    let firebaseKey:string = this.getFirebaseKey(serialNumber);
    this.http.delete("https://capstonedb-a452b-default-rtdb.firebaseio.com/Devices/" + firebaseKey + ".json").subscribe(
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
      }
    );
  }

  private getFirebaseKey(serialNumber:string):string {
    let firebaseKey:string = this.devices.filter(
      (device:FirebaseDevice)=>{
        return device.serialNumber === serialNumber
      })[0].firebaseKey;
    return firebaseKey;
  }


}
