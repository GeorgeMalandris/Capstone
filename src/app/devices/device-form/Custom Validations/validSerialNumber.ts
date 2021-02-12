import { AbstractControl, ValidatorFn } from '@angular/forms';

export function unavailableSerialNumberValidator(unavailableSerialNumbers: string[]): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = unavailableSerialNumbers.indexOf(control.value) !== -1;
      return forbidden ? {forbiddenName: {value: control.value}} : null;
    };
  }