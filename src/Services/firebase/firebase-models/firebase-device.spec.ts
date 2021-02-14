import { FirebaseDevice } from './firebase-device';

describe('FirebaseDevice', () => {
  it('should create an instance', () => {
    expect(new FirebaseDevice("testFirebaseKey","testSerialNumber","testDescription",1)).toBeTruthy();
  });
});
