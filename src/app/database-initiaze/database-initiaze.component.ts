import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-database-initiaze',
  templateUrl: './database-initiaze.component.html',
  styleUrls: ['./database-initiaze.component.css']
})
export class DatabaseInitiazeComponent implements OnInit {

  dbSelection:number | null;
  @Output() sendConnectionStringEnum = new EventEmitter();

  constructor() { 
      this.dbSelection = null;
    }

  ngOnInit(): void {
  }

  sendData():void{
    this.sendConnectionStringEnum.emit(this.dbSelection);
  }

}
