import { FirebaseEmployeeDeviceConnection } from './firebase-employee-device-connection';

describe('FirebaseEmployeeDeviceConnection', () => {
  it('should create an instance', () => {
    expect(new FirebaseEmployeeDeviceConnection("testFirebaseKey",1,"testSerialNumber")).toBeTruthy();
  });
});
