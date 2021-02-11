import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Employee } from 'src/Models/employee';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {

  employeeForm:FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
    email: new FormControl('',[Validators.required, Validators.email])
  });

  actionName:string;
  @ViewChild("formToggle") formToggle:ElementRef | null;
  @Output() sendEmployeeData=new EventEmitter();

  constructor() { 
    this.actionName = "";
    this.formToggle = null;
  }

  ngOnInit(): void {
  }

  onCancel(event:Event):void{
    event.preventDefault();
    this.employeeForm.reset();
  }

  sendData(event:Event){
    event.preventDefault();
    this.sendEmployeeData.emit(this.employeeForm.value);
    this.employeeForm.reset();
    this.formToggle?.nativeElement.click();
  }

  openForm(employee:Employee | null){
    if(employee!=null){
      this.actionName = "Edit";
      this.employeeForm.controls.id.setValue(employee.id);
      this.employeeForm.controls.name.setValue(employee.name);
      this.employeeForm.controls.email.setValue(employee.email);
    }
    else{
      this.actionName = "Add New";
    }
    this.formToggle?.nativeElement.click();
  }

}
