import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerModule } from '@coreui/angular';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, SpinnerModule],
  template: `
    @if (visible()) {
      <div class="d-flex justify-content-center align-items-center" [style.height]="height()">
        <c-spinner 
          [color]="color()" 
          [variant]="variant()"
          [style.width]="size()"
          [style.height]="size()">
        </c-spinner>
        @if (text()) {
          <span class="ms-2 text-body-secondary">{{ text() }}</span>
        }
      </div>
    }
  `
})
export class LoadingSpinnerComponent {
  visible = input<boolean>(true);
  color = input<string>('primary');
  variant = input<'border' | 'grow'>('border');
  size = input<string>('2rem');
  height = input<string>('100px');
  text = input<string>('');
}