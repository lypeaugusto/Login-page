import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const password = control.get('password')?.value;
        const passwordConfirmation = control.get('passwordConfirmation')?.value;

        if (password !== passwordConfirmation) {
            return { passwordMismatch: true };
        }

        return null;
    };
}