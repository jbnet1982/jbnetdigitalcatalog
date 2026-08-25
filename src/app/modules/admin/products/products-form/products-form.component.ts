import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CardModule, ButtonModule, FormModule, GridModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { cilCloudUpload } from '@coreui/icons';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../../../../core/services/products.service';

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CardModule, ButtonModule, FormModule, GridModule, IconModule],
  template: `
    <c-card>
      <c-card-header>
        <h5 class="mb-0">{{ isEdit() ? 'Editar' : 'Nuevo' }} Producto/Servicio</h5>
      </c-card-header>
      <c-card-body>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <c-row>
            <c-col md="8">
              <div class="mb-3">
                <label class="form-label">Nombre *</label>
                <input cFormInput formControlName="name" placeholder="Nombre del producto" />
              </div>
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea cFormTextarea formControlName="description" rows="3"></textarea>
              </div>
              <c-row>
                <c-col md="6">
                  <div class="mb-3">
                    <label class="form-label">Precio *</label>
                    <input cFormInput type="number" formControlName="price" step="0.01" min="0" />
                  </div>
                </c-col>
                <c-col md="6">
                  <div class="mb-3">
                    <label class="form-label">Categoría *</label>
                    <select cFormSelect formControlName="category">
                      <option value="">Seleccionar...</option>
                      <option value="consulta">Consulta</option>
                      <option value="estudio">Estudio</option>
                      <option value="tratamiento">Tratamiento</option>
                      <option value="producto">Producto</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </c-col>
              </c-row>
              <div class="mb-3">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" formControlName="active" id="activeSwitch">
                  <label class="form-check-label" for="activeSwitch">Producto activo</label>
                </div>
              </div>
            </c-col>
            <c-col md="4">
              <div class="mb-3">
                <label class="form-label">Imagen</label>
                <div class="border rounded p-3 text-center">
                  @if (imagePreview()) {
                    <img [src]="imagePreview()" class="img-fluid mb-2" style="max-height: 200px;">
                    <br>
                    <button type="button" cButton color="danger" size="sm" (click)="removeImage()">Eliminar</button>
                  } @else {
                    <div class="py-4">
                      <svg cIcon name="cilCloudUpload" size="3xl" class="text-body-secondary mb-2"></svg>
                      <p class="text-body-secondary">Subir imagen</p>
                      <input type="file" accept="image/*" (change)="onFileSelected($event)" style="display:none" #fileInput>
                      <button type="button" cButton color="secondary" size="sm" (click)="fileInput.click()">Seleccionar</button>
                    </div>
                  }
                </div>
              </div>
            </c-col>
          </c-row>
          <c-row class="mt-4">
            <c-col>
              <a routerLink="/admin/products" cButton color="secondary" class="me-2">Cancelar</a>
              <button cButton color="primary" type="submit" [disabled]="form.invalid || saving">
                @if (saving()) { <span class="spinner-border spinner-border-sm me-1"></span> }
                {{ isEdit() ? 'Actualizar' : 'Crear' }}
              </button>
            </c-col>
          </c-row>
        </form>
      </c-card-body>
    </c-card>
  `
})
export class ProductsFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(ProductsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  cilCloudUpload = cilCloudUpload;
  isEdit = signal(false);
  saving = signal(false);
  imagePreview = signal<string | null>(null);
  selectedFile = signal<File | null>(null);
  private productId = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    price: [0, [Validators.required, Validators.min(0.01)]],
    category: ['', Validators.required],
    active: [true]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.productId.set(id);
      this.loadProduct(id);
    }
  }

  loadProduct(id: string): void {
    this.service.getById(id).subscribe({
      next: (product) => {
        this.form.patchValue(product);
        if (product.imageUrl) this.imagePreview.set(product.imageUrl);
      },
      error: () => {
        this.toastr.error('Producto no encontrado', 'Error');
        this.router.navigate(['/admin/products']);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = () => this.imagePreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview.set(null);
    this.selectedFile.set(null);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const formData = new FormData();
    Object.keys(this.form.controls).forEach(key => {
      const controlValue = this.form.get(key as any)?.value;
      if (controlValue !== null && controlValue !== undefined) {
        formData.append(key, controlValue.toString());
      }
    });
    if (this.selectedFile()) {
      formData.append('image', this.selectedFile()!);
    }

    const operation = this.isEdit()
      ? this.service.update(this.productId()!, this.form.value as any)
      : this.service.create(this.form.value as any);

    operation.subscribe({
      next: () => {
        this.toastr.success('Producto guardado', 'Éxito');
        this.router.navigate(['/admin/products']);
      },
      error: () => {
        this.saving.set(false);
        this.toastr.error('Error al guardar', 'Error');
      }
    });
  }
}