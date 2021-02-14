import { FirebaseEmployee } from './firebase-employee';

describe('FirebaseEmployee', () => {
  it('should create an instance', () => {
    expect(new FirebaseEmployee("testFirebaseKey",1,"testName","testEmail")).toBeTruthy();
  });
});
