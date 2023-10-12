import { FormGroup } from "@angular/forms";

export class FormMessage {

  static get(frm: FormGroup, field: string): string {

    if (!frm) { return ''; }

    let error = '';

    const control = frm.get(field);

    if (control?.valid) {
      return error;
    }

    if ((control?.touched || control?.dirty) && control.errors) {

      if (control.errors['required']) {
        error = '¡Campo requerido!';
      }
    }

    return error;
  }
}