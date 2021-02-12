import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { unavailableSerialNumberValidator } from 'src/app/devices/device-form/Custom Validations/validSerialNumber';
import { Device } from 'src/Models/device';

@Component({
  selector: 'app-device-form',
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.css']
})
export class DeviceFormComponent implements OnInit {

  deviceForm:FormGroup = new FormGroup({
    serialNumber: new FormControl('',[Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
    description: new FormControl('',[Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
    type: new FormControl('',[Validators.required, Validators.pattern("[0-9]*"), Validators.min(1)])
  });

  actionName:string;
  @ViewChild("formToggle") formToggle:ElementRef | null;
  @Output() sendDeviceData=new EventEmitter();
  @Input() unavailableSerialNumbers:string[];

  constructor() { 
    this.actionName = "";
    this.formToggle = null;
    this.unavailableSerialNumbers = [];
  }

  ngOnInit(): void {
  }

  onCancel(event:Event):void{
    event.preventDefault();
    this.deviceForm.reset();
  }

  sendData(event:Event){
    event.preventDefault();
    this.deviceForm.controls.serialNumber.enable();
    this.sendDeviceData.emit(this.deviceForm.value);
    this.deviceForm.reset();
    this.formToggle?.nativeElement.click();
  }

  openForm(device:Device | null){
    if(device!=null){
      this.actionName = "Edit";
      this.deviceForm.controls.serialNumber.setValue(device.serialNumber);
      this.deviceForm.controls.serialNumber.disable();
      this.deviceForm.controls.description.setValue(device.description);
      this.deviceForm.controls.type.setValue(device.type);
    }
    else{
      this.deviceForm.controls.serialNumber.setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(255), unavailableSerialNumberValidator(this.unavailableSerialNumbers)]);
      this.actionName = "Add New";
      this.deviceForm.controls.serialNumber.enable();
    }
    this.formToggle?.nativeElement.click();
  }

}
