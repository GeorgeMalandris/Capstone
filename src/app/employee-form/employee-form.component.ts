import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {

  employeeForm:FormGroup = new FormGroup({
    name: new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
    email: new FormControl('',[Validators.required, Validators.email])
  });

  @Input() editAction:boolean = false;
  @Input() actionName:string = "Create new";
  showForm:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onCancel(event:Event):void{
    event.preventDefault();
    console.log(this.employeeForm.value);
    this.employeeForm.reset();
  }

  onSubmit():void{
    console.log("Submitted");
    this.employeeForm.reset();
  }

}
