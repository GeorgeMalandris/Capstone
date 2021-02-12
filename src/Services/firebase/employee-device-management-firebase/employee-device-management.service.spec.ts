import { TestBed } from '@angular/core/testing';

import { EmployeeDeviceManagementService } from './employee-device-management.service';

describe('EmployeeDeviceManagementService', () => {
  let service: EmployeeDeviceManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeDeviceManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
