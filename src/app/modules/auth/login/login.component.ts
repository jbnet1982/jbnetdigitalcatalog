import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CardModule, ButtonModule, FormModule, GridModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { cilUser, cilLockLocked } from '@coreui/icons';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, ButtonModule, FormModule, GridModule, IconModule],
  template: `
    <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
      <c-container>
        <c-row class="justify-content-center">
          <c-col md="6">
            <c-card class="p-4">
              <c-card-body>
                <h1 class="mb-4">Iniciar Sesión</h1>
                <form [formGroup]="form" (ngSubmit)="onSubmit()">
                  <div class="input-group mb-3">
                    <span class="input-group-text"><svg cIcon name="cilUser"></svg></span>
                    <input cFormInput formControlName="email" placeholder="Email" />
                  </div>
                  <div class="input-group mb-4">
                    <span class="input-group-text"><svg cIcon name="cilLockLocked"></svg></span>
                    <input cFormInput type="password" formControlName="password" placeholder="Contraseña" />
                  </div>
                  <button cButton color="primary" class="d-block w-100" type="submit" [disabled]="form.invalid || loading">
                    @if (loading) { <span class="spinner-border spinner-border-sm me-2"></span> } Ingresar
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
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  
  loading = false;
  cilUser = cilUser; cilLockLocked = cilLockLocked;
  form = this.fb.group({ 
    email: ['', [Validators.required, Validators.email]], 
    password: ['', Validators.required] 
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.login(this.form.value as any).subscribe({
      next: () => {
        this.toastr.success('Bienvenido', 'Éxito');
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => { 
        this.loading = false; 
        this.toastr.error('Credenciales incorrectas', 'Error'); 
      }
    });
  }
}