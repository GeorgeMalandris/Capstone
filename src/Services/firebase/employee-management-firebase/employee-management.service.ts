import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { FirebaseEmployee } from 'src/Services/firebase/firebase-models/firebase-employee';
import { Employee } from 'src/Models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeManagementService {

  employees:FirebaseEmployee[];
  @Output() selectedEmployee = new EventEmitter();
  nextId:number;

  constructor(private http:HttpClient) { 
    this.employees = [];
    this.nextId = 0;
    this.getEmployees();
    this.getNextEmployeeId();
  }

  getEmployees():void{
    this.http.get("https://capstonedb-a452b-default-rtdb.firebaseio.com/Employees.json").subscribe(
      (employees:any)=>{
        for(let key in employees){
          let employee = new FirebaseEmployee(key,employees[key].id,employees[key].name,employees[key].email);
          this.employees.push(employee);
        }
      } 
    );
  }

  getEmployee(employeeId:number):void{
    let firebaseKey:string = this.getFirebaseKey(employeeId);
    this.http.get("https://capstonedb-a452b-default-rtdb.firebaseio.com/Employees/" + firebaseKey + ".json").subscribe(
      (employee:any)=>{
        let newEmployeeSelection = new FirebaseEmployee(firebaseKey,employee.id,employee.name,employee.email);
        this.selectedEmployee.emit(newEmployeeSelection);
        }
    );
  }

  addEmployee(employee:Employee):void{
    this.http.post("https://capstonedb-a452b-default-rtdb.firebaseio.com/Employees.json", employee).subscribe(
      (firebaseKey:any)=>{
          this.employees.push(new FirebaseEmployee(firebaseKey.name,employee.id,employee.name,employee.email));
          this.nextId++;
          this.setNextEmployeeId();
        }
    );    
  }

  editEmployee(employeeToEdit:Employee):void{
    let firebaseKey:string = this.getFirebaseKey(employeeToEdit.id);
    this.http.put("https://capstonedb-a452b-default-rtdb.firebaseio.com/Employees/" + firebaseKey + ".json", employeeToEdit).subscribe(
      (employee:any)=>{
        this.employees.splice(this.employees.findIndex(
          (employee:FirebaseEmployee)=>{
            return employee.firebaseKey === firebaseKey;
          }),1);

        this.employees.push(new FirebaseEmployee(firebaseKey,employee.id,employee.name,employee.email));
        }
    );
  }

  deleteEmployee(employeeId:number):void{
    let firebaseKey:string = this.getFirebaseKey(employeeId);
    this.http.delete("https://capstonedb-a452b-default-rtdb.firebaseio.com/Employees/" + firebaseKey + ".json").subscribe(
      ()=>{
        this.employees.splice(this.employees.findIndex(
          (employee:FirebaseEmployee)=>{
            return employee.firebaseKey === firebaseKey
          }),1);
      }
    );
  }

  private getNextEmployeeId():void{
    this.http.get("https://capstonedb-a452b-default-rtdb.firebaseio.com/NextEmployeeId.json").subscribe(
      (nextId:any)=>{
        this.nextId = nextId.id;
      }
    );
  }

  private setNextEmployeeId():void{
    this.http.put("https://capstonedb-a452b-default-rtdb.firebaseio.com/NextEmployeeId/id.json",this.nextId).subscribe(
      (nextId:any)=>{
        this.nextId = nextId;
      }
    );
  }

  private getFirebaseKey(employeeId:number):string {
    let firebaseKey:string = this.employees.filter(
      (employee:FirebaseEmployee)=>{
        return employee.id === employeeId
      })[0].firebaseKey;
    return firebaseKey;
  }

}
