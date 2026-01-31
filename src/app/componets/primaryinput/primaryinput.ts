import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

type InputType = 'text' | 'password' | 'email' | 'number';

@Component({
  selector: 'app-primaryinput',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './primaryinput.html',
  styleUrl: './primaryinput.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Primaryinput),
      multi: true,
    }
  ]
})
export class Primaryinput implements ControlValueAccessor {
  @Input() type: InputType = 'text';
  @Input() placeholder: string = '';
  @Input() label: string = '';

  value: string = '';

  onChange = (value: string) => { };
  onTouched = () => { };

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  setDisabledState(isDisabled: boolean): void {

  }
}
