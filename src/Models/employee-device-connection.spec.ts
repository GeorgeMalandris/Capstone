import { EmployeeDeviceConnection } from './employee-device-connection';

describe('EmployeeDeviceConnection', () => {
  it('should create an instance', () => {
    expect(new EmployeeDeviceConnection(1,"testSerialNumber")).toBeTruthy();
  });
});
