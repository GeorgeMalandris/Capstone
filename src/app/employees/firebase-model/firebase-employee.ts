import { Employee } from "src/Models/employee";

export class FirebaseEmployee extends Employee {
    firebaseId:string;

    constructor(firebaseId:string, id:number, name:string, email:string){
        super(id,name,email);
        this.firebaseId = firebaseId;
    }
}
