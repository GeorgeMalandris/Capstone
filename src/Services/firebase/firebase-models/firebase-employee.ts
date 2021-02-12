import { Employee } from "src/Models/employee";

export class FirebaseEmployee extends Employee {
    firebaseKey:string;

    constructor(firebaseKey:string, id:number, name:string, email:string){
        super(id,name,email);
        this.firebaseKey = firebaseKey;
    }
}
