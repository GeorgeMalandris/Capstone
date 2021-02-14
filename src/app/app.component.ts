import { Component} from '@angular/core';
import { DatabaseConnectionService } from 'src/Services/firebase/database-connection/database-connection.service';
import { connectionStrings } from './connectionStrings'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Capstone';
  database:string | null;

  constructor(private databaseConnection:DatabaseConnectionService){
    this.database = this.databaseConnection.getDatabase();
  }

  initializeDatabase(dbEnum:number | null):void{
    if(this.database)
      return;

    if(dbEnum === null)
      return;

    if(dbEnum < 0 || dbEnum > 3)
      return;

    this.databaseConnection.setDatabase(connectionStrings[dbEnum]);
    this.database = this.databaseConnection.getDatabase();
  }

}
