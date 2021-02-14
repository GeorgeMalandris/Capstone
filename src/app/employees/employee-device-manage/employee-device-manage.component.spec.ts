import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDeviceManageComponent } from './employee-device-manage.component';

describe('EmployeeDeviceManageComponent', () => {
  let component: EmployeeDeviceManageComponent;
  let fixture: ComponentFixture<EmployeeDeviceManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientModule],
      providers:[],
      declarations: [ EmployeeDeviceManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDeviceManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
