import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Device } from 'src/Models/device';
import { Employee } from 'src/Models/employee';
import { EmployeeDeviceConnection } from 'src/Models/employee-device-connection';
import { EmployeeDeviceManagementService } from 'src/Services/firebase/employee-device-management-firebase/employee-device-management.service';

@Component({
  selector: 'app-employee-device-manage',
  templateUrl: './employee-device-manage.component.html',
  styleUrls: ['./employee-device-manage.component.css']
})
export class EmployeeDeviceManageComponent implements OnInit {

  availableDevices:Device[];
  employeeToManage:Employee | null;
  employeeDevices:Device[];
  @ViewChild("employeeDevicesManageToggle") employeeDevicesManageToggle:ElementRef | null;

  constructor(private management:EmployeeDeviceManagementService) { 
    this.availableDevices = [];
    this.employeeToManage = null;
    this.employeeDevices = [];
    this.employeeDevicesManageToggle = null;
  }

  ngOnInit(): void {
    this.management.availableDevices.subscribe(
      (availableDevices:Device[])=>{
        this.availableDevices = availableDevices;
      }
    );
    this.management.selectedEmployee.subscribe(
      (selectedEmployee:Employee)=>{
        this.employeeToManage = selectedEmployee;
      }
    );
    this.management.selectedEmployeeDevices.subscribe(
      (selectedEmployeeDevices:Device[])=>{
        this.employeeDevices = selectedEmployeeDevices;
      }
    );
  }

  openEmployeeDevicesManage(employeeId:number):void{
    this.management.selectEmployee(employeeId);
    this.employeeDevicesManageToggle?.nativeElement.click();
  }

  closeEmployeeDevicesManage():void{
    this.employeeToManage = null;
    this.employeeDevices = [];
  }

  removeDeviceFromEmployee(serialNumber:string):void{
    if(this.employeeToManage !== null){
      let connection = new EmployeeDeviceConnection(this.employeeToManage.id,serialNumber);
      this.management.removeEmployeeDeviceConnection(connection);
    }
  }

  addDeviceToEmployee(serialNumber:string):void{
    if(this.employeeToManage !== null){
      let connection = new EmployeeDeviceConnection(this.employeeToManage.id,serialNumber);
      this.management.addEmployeeDeviceConnection(connection);
    }
  }

}
