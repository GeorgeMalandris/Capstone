import { EmployeeDeviceConnection } from "src/Models/employee-device-connection";

export class FirebaseEmployeeDeviceConnection extends EmployeeDeviceConnection {
    firebaseKey:string;

    constructor(firebaseKey:string, employeeId:number, deviceSerialNumber:string){
        super(employeeId, deviceSerialNumber);
        this.firebaseKey = firebaseKey;
    }
}
