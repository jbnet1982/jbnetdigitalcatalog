import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FormModule, ButtonModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { cilCloudUpload, cilX } from '@coreui/icons';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormModule, ButtonModule, IconModule],
  template: `
    <div class="mb-3">
      @if (label()) {
        <label class="form-label">{{ label() }}</label>
      }
      
      @if (preview()) {
        <div class="border rounded p-2 mb-2 d-inline-block position-relative">
          @if (isImage()) {
            <img [src]="preview()" [alt]="label()" class="rounded" [style.maxHeight]="previewHeight()">
          } @else {
            <div class="d-flex align-items-center p-3">
              <svg cIcon name="cilFile" size="xl" class="me-2 text-primary"></svg>
              <span class="text-truncate" style="max-width: 200px;">{{ fileName() }}</span>
            </div>
          }
          @if (allowRemove()) {
            <button 
              type="button" 
              cButton 
              color="danger" 
              size="sm"
              class="position-absolute top-0 end-0 translate-middle"
              (click)="removeFile()">
              <svg cIcon [name]="cilX" size="sm"></svg>
            </button>
          }
        </div>
      }

      <div class="border rounded p-3 text-center" 
           [class.bg-light]="!preview()"
           (dragover)="onDragOver($event)"
           (dragleave)="onDragLeave($event)"
           (drop)="onDrop($event)">
        
        @if (!preview()) {
          <svg cIcon [name]="cilCloudUpload" size="3xl" class="text-body-secondary mb-2"></svg>
          <p class="text-body-secondary mb-2">{{ placeholder() }}</p>
          <input 
            type="file" 
            [accept]="accept()"
            (change)="onFileSelected($event)"
            class="d-none"
            #fileInput>
          <button 
            type="button" 
            cButton 
            color="secondary" 
            size="sm"
            (click)="fileInput.click()">
            Seleccionar archivo
          </button>
        }
      </div>
      
      @if (helperText()) {
        <small class="text-body-secondary d-block mt-1">{{ helperText() }}</small>
      }
    </div>
  `
})
export class FileUploadComponent {
  cilCloudUpload = cilCloudUpload;
  cilX = cilX;
  
  label = input<string>('Archivo');
  placeholder = input<string>('Arrastra un archivo o haz clic para seleccionar');
  accept = input<string>('image/*');
  helperText = input<string>('');
  allowRemove = input<boolean>(true);
  previewHeight = input<string>('150px');
  maxFileSize = input<number>(5 * 1024 * 1024); // 5MB default
  
  fileChange = output<File | null>();
  
  preview = signal<string | null>(null);
  fileName = signal<string>('');
  selectedFile = signal<File | null>(null);

  isImage(): boolean {
    return this.accept().includes('image');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  }

  private handleFile(file: File): void {
    if (file.size > this.maxFileSize()) {
      alert(`El archivo es demasiado grande. Máximo ${this.maxFileSize() / 1024 / 1024}MB`);
      return;
    }

    this.selectedFile.set(file);
    this.fileName.set(file.name);
    this.fileChange.emit(file);

    if (this.isImage()) {
      const reader = new FileReader();
      reader.onload = () => {
        this.preview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      this.preview.set('file');
    }
  }

  removeFile(): void {
    this.preview.set(null);
    this.fileName.set('');
    this.selectedFile.set(null);
    this.fileChange.emit(null);
  }
}