import { Device } from "src/Models/device";

export class FirebaseDevice extends Device {
    firebaseKey:string;

    constructor(firebaseKey:string, serialNumber:string, description:string, type:number){
        super(serialNumber,description,type);
        this.firebaseKey = firebaseKey;
    }
}
