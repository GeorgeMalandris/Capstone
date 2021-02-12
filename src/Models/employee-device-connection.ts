export class EmployeeDeviceConnection {
    employeeId:number;
    deviceSerialNumber:string;

    constructor(employeeId:number, deviceSerialNumber:string){
        this.employeeId = employeeId;
        this.deviceSerialNumber = deviceSerialNumber;
    }
}
