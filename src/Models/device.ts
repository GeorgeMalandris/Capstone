export class Device {
    serialNumber:string;
    description:string;
    type:number;

    constructor(serialNumber:string, description:string, type:number){
        this.serialNumber = serialNumber;
        this.description = description;
        this.type = type;
    }
}
