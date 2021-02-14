import { Device } from './device';

describe('Device', () => {
  it('should create an instance', () => {
    expect(new Device("testSerialNumber","testDescription",1)).toBeTruthy();
  });
});
