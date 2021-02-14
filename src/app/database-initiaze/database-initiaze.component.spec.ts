import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseInitiazeComponent } from './database-initiaze.component';

describe('DatabaseInitiazeComponent', () => {
  let component: DatabaseInitiazeComponent;
  let fixture: ComponentFixture<DatabaseInitiazeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatabaseInitiazeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseInitiazeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
