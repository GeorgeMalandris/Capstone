import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Employee } from 'src/Models/employee';
import { EmployeeListComponent } from './employee-list.component';

@Component({
  selector: "test-parent-component",
  template: `<app-employee-list [employeeList]="employees" (editEmployee)="editEmployee($event)" 
              (deleteEmployee)="deleteEmployee($event)" (showEmployeeDetails)="showEmployeeDetails($event)"
              (manageEmployeeDevices)="openManageEmployeeDevices($event)"></app-employee-list>`
})
class TestParentComponent{
  employees:Employee[] = [
    new Employee(1,"TestEmployee1", "TestEmail1"),
    new Employee(2,"TestEmployee2", "TestEmail2"),
    new Employee(3,"TestEmployee3", "TestEmail3")
  ];
  employeeId:number | null = null;
  employee:Employee | null = null;
  @ViewChild(EmployeeListComponent) employeeListComponent!: EmployeeListComponent;

  deleteEmployee(employeeId:number):void{ this.employeeId = employeeId; }
  showEmployeeDetails(employeeId:number):void{ this.employeeId = employeeId; }
  editEmployee(employee:Employee):void{ this.employee = employee; }
  openManageEmployeeDevices(employeeId:number):void{ this.employeeId = employeeId; }
}

describe('EmployeeListComponent', () => {
  let testParentComponent: TestParentComponent;
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  let parentComponentFixture: ComponentFixture<TestParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeListComponent, TestParentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeListComponent);
    parentComponentFixture = TestBed.createComponent(TestParentComponent);
    component = fixture.componentInstance;
    testParentComponent = parentComponentFixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('gets the employees form the parent element', () => {
    parentComponentFixture.detectChanges();
    expect(testParentComponent.employeeListComponent.employeeList).toEqual(testParentComponent.employees);
  });

  it('updates the employees when parent element changes', () => {
    const employee: Employee = {id: 4, name: 'TestName4', email: 'TestEmail4'};
    parentComponentFixture.detectChanges();
    testParentComponent.employees.push(employee);
    expect(testParentComponent.employeeListComponent.employeeList).toHaveSize(4);
  });

  it('sends the selected employee id for delete when clicked', () => {
    const employeeId: number = 1;
    parentComponentFixture.detectChanges();
    testParentComponent.employeeListComponent.sendEmployeeToDelete(employeeId);
    expect(testParentComponent.employeeId).toEqual(employeeId);
  });

  it('sends the selected employee id for showing when clicked', () => {
    const employeeId: number = 1;
    parentComponentFixture.detectChanges();
    testParentComponent.employeeListComponent.sendEmployeeToShow(employeeId);
    expect(testParentComponent.employeeId).toEqual(employeeId);
  });

  it('sends the selected employee id for managing his devices when clicked', () => {
    const employeeId: number = 1;
    parentComponentFixture.detectChanges();
    testParentComponent.employeeListComponent.sendEmployeeToManageDevices(employeeId);
    expect(testParentComponent.employeeId).toEqual(employeeId);
  });

  it('sends the selected employee id for editing when clicked', () => {
    const employee: Employee = {id: 1, name: 'TestName', email: 'TestEmail'};
    parentComponentFixture.detectChanges();
    testParentComponent.employeeListComponent.sendEmployeeToEdit(employee);
    expect(testParentComponent.employee).toEqual(employee);
  });

  it('renders the whole list of parents employees', () => {
    const compiled = parentComponentFixture.nativeElement;
    parentComponentFixture.detectChanges();
    
    expect(compiled.querySelectorAll("table tbody tr")).toHaveSize(testParentComponent.employeeListComponent.employeeList.length)
  });

  it('renders the whole list of parents employees when changed', () => {
    const employee: Employee = {id: 4, name: 'TestName', email: 'TestEmail'};
    parentComponentFixture.detectChanges();
    const initialEmployees: number = testParentComponent.employeeListComponent.employeeList.length;
    testParentComponent.employees.push(employee);
    parentComponentFixture.detectChanges();
    
    expect(parentComponentFixture.nativeElement.querySelectorAll("table tbody tr")).toHaveSize(initialEmployees + 1)
  });

});
