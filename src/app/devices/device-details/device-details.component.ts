import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Device } from 'src/Models/device';
import { Employee } from 'src/Models/employee';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.css']
})
export class DeviceDetailsComponent implements OnInit {

  @Input() selectedDevice:Device | null;
  @Input() employee:Employee | null;
  @ViewChild("detailsToggle") detailsToggle:ElementRef | null;

  constructor() { 
    this.selectedDevice = null;
    this.employee = null;
    this.detailsToggle = null;
  }

  ngOnInit(): void {
  }

  showDetails(employee:Employee | null):void{
    this.employee = employee;
    this.detailsToggle?.nativeElement.click();
  }

  closeDetails():void{
    this.selectedDevice = null;
    this.employee = null;
  }

}
