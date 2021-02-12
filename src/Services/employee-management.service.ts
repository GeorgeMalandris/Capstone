import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FirebaseEmployee } from 'src/app/employees/firebase-model/firebase-employee';
import { Employee } from 'src/Models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeManagementService {

  employees!:FirebaseEmployee[];
  selectedEmployee!:FirebaseEmployee;
  nextId!:number;

  constructor(private http:HttpClient) { 
    this.employees = [];
    this.getEmployees();
    this.getNextEmpId();
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
    let firebaseKey:string = this.getFirebaseId(employeeId);
    this.http.get("https://capstonedb-a452b-default-rtdb.firebaseio.com/Employees/" + firebaseKey + ".json").subscribe(
      (employee:any)=>{
        this.selectedEmployee = new FirebaseEmployee(firebaseKey,employee.id,employee.name,employee.email);
        }
    );
  }

  addEmployee(employee:Employee):void{
    this.http.post("https://capstonedb-a452b-default-rtdb.firebaseio.com/Employees.json", employee).subscribe(
      (firebaseKey:any)=>{
          this.employees.push(new FirebaseEmployee(firebaseKey.name,employee.id,employee.name,employee.email));
        }
    );
        this.nextId++;
        this.setNextEmpId();
  }

  editEmployee(employeeToEdit:Employee):void{
    let firebaseKey:string = this.getFirebaseId(employeeToEdit.id);
    this.http.put("https://capstonedb-a452b-default-rtdb.firebaseio.com/Employees/" + firebaseKey + ".json", employeeToEdit).subscribe(
      (employee:any)=>{
        this.employees.splice(this.employees.findIndex(
          (employee:FirebaseEmployee)=>{
            return employee.firebaseId === firebaseKey;
          }),1);

        this.employees.push(new FirebaseEmployee(firebaseKey,employee.id,employee.name,employee.email));
        }
    );
  }

  deleteEmployee(employeeId:number):void{
    let firebaseKey:string = this.getFirebaseId(employeeId);
    this.http.delete("https://capstonedb-a452b-default-rtdb.firebaseio.com/Employees/" + firebaseKey + ".json").subscribe(
      ()=>{
        this.employees.splice(this.employees.findIndex(
          (employee:FirebaseEmployee)=>{
            return employee.firebaseId === firebaseKey
          }),1);
      }
    );
  }

  getNextEmpId():void{
    this.http.get("https://capstonedb-a452b-default-rtdb.firebaseio.com/NextEmployeeId.json").subscribe(
      (nextId:any)=>{
        this.nextId = nextId.id;
      }
    );
  }

  private setNextEmpId():void{
    this.http.put("https://capstonedb-a452b-default-rtdb.firebaseio.com/NextEmployeeId/id.json",this.nextId).subscribe(
      (nextId:any)=>{
        this.nextId = nextId;
      }
    );
  }

  private getFirebaseId(employeeId:number):string {
    let firebaseId:string = this.employees.filter(
      (employee:FirebaseEmployee)=>{
        return employee.id === employeeId
      })[0].firebaseId;
    return firebaseId;
  }

}
