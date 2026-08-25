import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumberOnly]',
  standalone: true
})
export class NumberOnlyDirective {
  private regex = new RegExp(/^\d*\.?\d*$/g);

  constructor(private ngControl: NgControl) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): boolean {
    const keyCode = event.keyCode;
    const allowedKeys = [8, 9, 13, 27, 46]; // Backspace, Tab, Enter, Escape, Delete
    
    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if ((keyCode === 65 && event.ctrlKey) ||
        (keyCode === 67 && event.ctrlKey) ||
        (keyCode === 86 && event.ctrlKey) ||
        (keyCode === 88 && event.ctrlKey)) {
      return true;
    }

    if (allowedKeys.includes(keyCode)) {
      return true;
    }

    const key = String.fromCharCode(keyCode);
    return this.regex.test(key);
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const input = event.clipboardData?.getData('text') || '';
    if (!this.regex.test(input)) {
      event.preventDefault();
    }
  }
}