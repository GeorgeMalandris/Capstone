import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseConnectionService {

  private connectionString:string | null;

  constructor() {
    this.connectionString = null;
  }

  setDatabase(database:string):void{
    if(this.connectionString)
      return;
    
    this.connectionString = database;
  }

  getDatabase():string | null{
    return this.connectionString;
  }
}
