import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { FirebaseEmployee } from 'src/Services/firebase/firebase-models/firebase-employee';
import { Employee } from 'src/Models/employee';
import { DatabaseConnectionService } from '../database-connection/database-connection.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeManagementService {

  private databaseString!:string | null;

  employees:FirebaseEmployee[];
  @Output() selectedEmployee = new EventEmitter();
  nextId:number;

  constructor(private database:DatabaseConnectionService, private http:HttpClient) { 
    this.databaseString = this.database.getDatabase();
    this.employees = [];
    this.nextId = 0;
    this.getEmployees();
    this.getNextEmployeeId();
  }

  getEmployees():void{
    if(!this.databaseString)
      return;
    this.http.get(this.databaseString + "/Employees.json").subscribe(
      (employees:any)=>{
        for(let key in employees){
          let employee = new FirebaseEmployee(key,employees[key].id,employees[key].name,employees[key].email);
          this.employees.push(employee);
        }
      },
      (error)=>{
        alert("Something went wrong while loading the employees.\nPlease try again later.")
      }
    );
  }

  getEmployee(employeeId:number):void{
    if(!this.databaseString)
      return;
    let firebaseKey:string = this.getFirebaseKey(employeeId);
    if(firebaseKey){
        this.http.get(this.databaseString + "/Employees/" + firebaseKey + ".json").subscribe(
        (employee:any)=>{
          let newEmployeeSelection = new FirebaseEmployee(firebaseKey,employee.id,employee.name,employee.email);
          this.selectedEmployee.emit(newEmployeeSelection);
          },
        (error) => {
          alert("Something went wrong while loading the employee.\nPlease try again later.")
        }
      );
    }
    else{
      alert("Invalid Employee Id.")
    }
  }

  addEmployee(employee:Employee):void{
    if(!this.databaseString)
      return;
    let firebaseKey:string = this.getFirebaseKey(employee.id);
    if(!firebaseKey){
      this.http.post(this.databaseString + "/Employees.json", employee).subscribe(
      (firebaseKey:any)=>{
          this.employees.push(new FirebaseEmployee(firebaseKey.name,employee.id,employee.name,employee.email));
          this.nextId++;
          this.setNextEmployeeId();
        },
        (error) => {
          alert("Something went wrong while adding the employee.\nPlease try again later.")
        }
      );    
    }
    else{
      alert("The employee ID is already in the database.\nYou cannot add it again.")
    }
  }

  editEmployee(employeeToEdit:Employee):void{
    if(!this.databaseString)
      return;
    let firebaseKey:string = this.getFirebaseKey(employeeToEdit.id);
    if(firebaseKey){
      this.http.put(this.databaseString + "/Employees/" + firebaseKey + ".json", employeeToEdit).subscribe(
      (employee:any)=>{
        this.employees.splice(this.employees.findIndex(
          (employee:FirebaseEmployee)=>{
            return employee.firebaseKey === firebaseKey;
          }),1);

          this.employees.push(new FirebaseEmployee(firebaseKey,employee.id,employee.name,employee.email));
        },
        (error) => {
          alert("Something went wrong while editing the employee.\nPlease try again later.")
        }
      );
    }
    else{
      alert("The employee you are trying to edit does not exist.\nPlease check the ID.")
    }
  }

  deleteEmployee(employeeId:number):void{
    if(!this.databaseString)
      return;
    let firebaseKey:string = this.getFirebaseKey(employeeId);
    if(firebaseKey){
      this.http.delete(this.databaseString + "/Employees/" + firebaseKey + ".json").subscribe(
      ()=>{
        this.employees.splice(this.employees.findIndex(
          (employee:FirebaseEmployee)=>{
            return employee.firebaseKey === firebaseKey
          }),1);
        },
        (error) => {
          alert("Something went wrong while deleting the employee.\nPlease try again later.")
        }
      );
    }
    else{
      alert("The employee you are trying to delete does not exist.\nPlease check the ID.")
    }
  }

  private getNextEmployeeId():void{
    if(!this.databaseString)
      return;
    this.http.get(this.databaseString + "/NextEmployeeId.json").subscribe(
      (nextId:any)=>{
        this.nextId = nextId.id;
      }
    );
  }

  private setNextEmployeeId():void{
    if(!this.databaseString)
      return;
    this.http.put(this.databaseString + "/NextEmployeeId/id.json",this.nextId).subscribe(
      (nextId:any)=>{
        this.nextId = nextId;
      }
    );
  }

  private getFirebaseKey(employeeId:number):string {
    let employeeIndex:number = this.getIndexOfFirebaseKey(employeeId);
    if(employeeIndex === -1)
      return "";
    return this.employees[employeeIndex].firebaseKey;
  }
  
  private getIndexOfFirebaseKey(employeeId:number):number{
    return this.employees.findIndex(
      (employee:FirebaseEmployee) => {
        return employee.id === employeeId;
      }
    );
  }
}
