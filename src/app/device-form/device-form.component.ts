import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-device-form',
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.css']
})
export class DeviceFormComponent implements OnInit {

  deviceForm:FormGroup = new FormGroup({
    serialNumber: new FormControl('',[Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
    description: new FormControl('',[Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
    type: new FormControl('',[Validators.required, Validators.pattern("[0-9]*")])
  });

  editAction:boolean = false;
  actionName:string = "Create new";
  showForm:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onCancel(event:Event):void{
    event.preventDefault();
    console.log(this.deviceForm.value);
    this.deviceForm.reset();
  }

  onSubmit():void{
    console.log("Submitted");
    this.deviceForm.reset();
  }

}
