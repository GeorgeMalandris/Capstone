import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Employee } from 'src/Models/employee';
import { EmployeeManagementService } from 'src/Services/firebase/employee-management-firebase/employee-management.service';
import { EmployeesComponent } from './employees.component';

class EmployeeManagementServiceMock{
  employees:Employee[] = [
    new Employee(1,"TestName1","TestEmail1"),
    new Employee(2,"TestName2","TestEmail2"),
    new Employee(3,"TestName3","TestEmail3")
  ]
}

describe('EmployeesComponent', () => {
  let component: EmployeesComponent;
  let fixture: ComponentFixture<EmployeesComponent>;
  let employeeManagement: EmployeeManagementServiceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        {provide: EmployeeManagementService, useClass: EmployeeManagementServiceMock}
      ],
      declarations: [ EmployeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges(); //In order to check the empty list after construction we must not use detectChanges here.
    employeeManagement = TestBed.inject(EmployeeManagementService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not have any employees after construction', () => {
    expect(component.employees).toHaveSize(0);
  });

  it('should have the employees of the service after ngOnInit', () => {
    component.ngOnInit();
    expect(component.employees).toHaveSize(employeeManagement.employees.length);
  });

  it('should get the changes of the employees of the service after new employee added', () => {
    component.ngOnInit();
    const employee:Employee = new Employee(4,"testName4","testEmail4");
    const initialEmployeesLentgh:number = employeeManagement.employees.length;
    employeeManagement.employees.push(employee);
    expect(component.employees).toHaveSize(initialEmployeesLentgh + 1);
  });

  it('should get the changes of the employees of the service after an employee deleted', () => {
    component.ngOnInit();
    const initialEmployeesLentgh:number = employeeManagement.employees.length;
    employeeManagement.employees.splice(0,1);
    expect(component.employees).toHaveSize(initialEmployeesLentgh - 1);
  });

});
