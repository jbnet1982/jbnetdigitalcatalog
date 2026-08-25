import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule, ButtonModule, FormModule, GridModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { cilBuilding, cilEnvelopeOpen, cilLockLocked, cilPhone } from '@coreui/icons';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, ButtonModule, FormModule, GridModule, IconModule],
  template: `
    <div class="bg-light min-vh-100 d-flex flex-row align-items-center py-5">
      <c-container>
        <c-row class="justify-content-center">
          <c-col md="8">
            <c-card class="p-4">
              <c-card-body>
                <h1 class="mb-4">Registrar Negocio</h1>
                <form [formGroup]="form" (ngSubmit)="onSubmit()">
                  <div class="input-group mb-3">
                    <span class="input-group-text"><svg cIcon name="cilBuilding"></svg></span>
                    <input cFormInput formControlName="businessName" placeholder="Nombre del negocio" />
                  </div>
                  <div class="input-group mb-3">
                    <span class="input-group-text"><svg cIcon name="cilEnvelopeOpen"></svg></span>
                    <input cFormInput formControlName="email" type="email" placeholder="Email" />
                  </div>
                  <div class="input-group mb-3">
                    <span class="input-group-text"><svg cIcon name="cilPhone"></svg></span>
                    <input cFormInput formControlName="phone" placeholder="Teléfono" />
                  </div>
                  <div class="input-group mb-3">
                    <span class="input-group-text"><svg cIcon name="cilLockLocked"></svg></span>
                    <input cFormInput formControlName="password" type="password" placeholder="Contraseña" />
                  </div>
                  <div class="input-group mb-3">
                    <span class="input-group-text"><svg cIcon name="cilLockLocked"></svg></span>
                    <input cFormInput formControlName="confirmPassword" type="password" placeholder="Confirmar contraseña" />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Tipo de negocio</label>
                    <select cFormSelect formControlName="businessType">
                      <option value="">Seleccionar...</option>
                      <option value="laboratorio">Laboratorio</option>
                      <option value="consultorio">Consultorio Médico</option>
                      <option value="comercio">Comercio</option>
                    </select>
                  </div>
                  <button cButton color="primary" class="d-block w-100" type="submit" [disabled]="form.invalid || loading">
                    @if (loading) { <span class="spinner-border spinner-border-sm me-2"></span> } Crear Cuenta
                  </button>
                </form>
              </c-card-body>
            </c-card>
          </c-col>
        </c-row>
      </c-container>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  
  loading = false;
  cilBuilding = cilBuilding;
  cilEnvelopeOpen = cilEnvelopeOpen;
  cilLockLocked = cilLockLocked;
  cilPhone = cilPhone;
  
  form = this.fb.group({
    businessName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    businessType: ['', Validators.required]
  });

  onSubmit() {
    if (this.form.invalid) return;
    const { confirmPassword, ...data } = this.form.value;
    if (data.password !== confirmPassword) {
      this.toastr.error('Las contraseñas no coinciden', 'Error');
      return;
    }
    this.loading = true;
    this.auth.register(data as any).subscribe({
      next: () => {
        this.toastr.success('Cuenta creada', 'Éxito');
        this.router.navigate(['/login']);
      },
      error: () => { 
        this.loading = false; 
        this.toastr.error('Error al registrar', 'Error'); 
      }
    });
  }
}