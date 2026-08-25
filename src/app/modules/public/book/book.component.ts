import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CardModule, ButtonModule, FormModule, GridModule } from '@coreui/angular';
import { BusinessService } from '../../../core/services/business.service';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { ToastrService } from 'ngx-toastr';

@Component({
selector: 'app-book',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, CardModule, ButtonModule, FormModule, GridModule],
  template: `
    @if (business()) {
      <!-- Header -->
      <header class="book-header">
        <div class="header-pattern"></div>
        <div class="header-content">
          <c-container>
            <div class="text-center">
              <div class="header-icon mb-3">
                <div class="icon-circle">
                  <span class="icon-emoji">📅</span>
                </div>
              </div>
              <h1 class="header-title mb-2">Agendar Cita</h1>
              <p class="header-subtitle mb-0">
                Reserva tu cita en {{ business()!.name }}
              </p>
            </div>
          </c-container>
        </div>
        <div class="header-wave">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="#f8f9fa"></path>
          </svg>
        </div>
      </header>

      <!-- Formulario de Reserva -->
      <c-container class="py-5">
        <c-row class="justify-content-center">
          <c-col xs="12" md="8" lg="6">
            <div class="booking-card">
              <!-- Información del Negocio -->
              <div class="business-info mb-4">
                <div class="d-flex align-items-center mb-3">
                  <div class="business-icon">
                    <span>🦷</span>
                  </div>
                  <div class="ms-3">
                    <h5 class="mb-1 fw-bold">{{ business()!.name }}</h5>
                    <p class="mb-0 text-muted small">
                      📍 {{ business()!.address }} | 📞 {{ business()!.phone }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Formulario -->
              <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
                <!-- Paso 1: Información Personal -->
                <div class="form-section mb-4">
                  <h6 class="section-title mb-3">
                    <span class="step-number">1</span>
                    Información Personal
                  </h6>
                  
                  <div class="mb-3">
                    <label class="form-label fw-semibold">
                      <span class="label-icon">👤</span> Nombre Completo
                    </label>
                    <input 
                      type="text" 
                      formControlName="patientName"
                      class="form-control form-control-lg"
                      placeholder="Ingresa tu nombre completo"
                    />
                    @if (bookingForm.get('patientName')?.invalid && bookingForm.get('patientName')?.touched) {
                      <div class="text-danger small mt-1">
                        El nombre es requerido
                      </div>
                    }
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-semibold">
                      <span class="label-icon">📱</span> Teléfono
                    </label>
                    <input 
                      type="tel" 
                      formControlName="patientPhone"
                      class="form-control form-control-lg"
                      placeholder="Ej: 5551234567"
                    />
                    @if (bookingForm.get('patientPhone')?.invalid && bookingForm.get('patientPhone')?.touched) {
                      <div class="text-danger small mt-1">
                        El teléfono es requerido
                      </div>
                    }
                  </div>
                </div>

                <!-- Paso 2: Fecha y Hora -->
                <div class="form-section mb-4">
                  <h6 class="section-title mb-3">
                    <span class="step-number">2</span>
                    Fecha y Hora de la Cita
                  </h6>
                  
                  <c-row>
                    <c-col xs="12" md="6">
                      <div class="mb-3">
                        <label class="form-label fw-semibold">
                          <span class="label-icon">📅</span> Fecha
                        </label>
                        <input 
                          type="date" 
                          formControlName="date"
                          class="form-control form-control-lg"
                          [min]="minDate"
                        />
                        @if (bookingForm.get('date')?.invalid && bookingForm.get('date')?.touched) {
                          <div class="text-danger small mt-1">
                            La fecha es requerida
                          </div>
                        }
                      </div>
                    </c-col>
                    <c-col xs="12" md="6">
                      <div class="mb-3">
                        <label class="form-label fw-semibold">
                          <span class="label-icon">🕐</span> Hora
                        </label>
                        <select 
                          formControlName="time"
                          class="form-select form-select-lg"
                        >
                          <option value="">Selecciona una hora</option>
                          @for (time of availableTimes; track time) {
                            <option [value]="time">{{ time }}</option>
                          }
                        </select>
                        @if (bookingForm.get('time')?.invalid && bookingForm.get('time')?.touched) {
                          <div class="text-danger small mt-1">
                            La hora es requerida
                          </div>
                        }
                      </div>
                    </c-col>
                  </c-row>
                </div>

                <!-- Paso 3: Servicio -->
                <div class="form-section mb-4">
                  <h6 class="section-title mb-3">
                    <span class="step-number">3</span>
                    Servicio Requerido
                  </h6>
                  
                  <div class="mb-3">
                    <label class="form-label fw-semibold">
                      <span class="label-icon">🦷</span> Selecciona el Servicio
                    </label>
                    <select 
                      formControlName="serviceId"
                      class="form-select form-select-lg"
                    >
                      <option value="">Selecciona un servicio...</option>
                      @for (service of services(); track service.id) {
                        <option [value]="service.id">
                          {{ service.name }} - \${{ service.price }}
                        </option>
                      }
                    </select>
                    @if (bookingForm.get('serviceId')?.invalid && bookingForm.get('serviceId')?.touched) {
                      <div class="text-danger small mt-1">
                        El servicio es requerido
                      </div>
                    }
                  </div>

                  @if (selectedService()) {
                    <div class="service-summary p-3 rounded">
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 class="mb-1 fw-bold">{{ selectedService()!.name }}</h6>
                          <p class="mb-0 small text-muted">{{ selectedService()!.description }}</p>
                        </div>
                        <div class="text-end">
                          <span class="badge bg-success fs-5">\${{ selectedService()!.price }}</span>
                        </div>
                      </div>
                    </div>
                  }
                </div>

                <!-- Botón de Envío -->
                <div class="d-grid gap-2">
                  <button 
                    type="submit" 
                    class="btn-submit"
                    [disabled]="bookingForm.invalid || loading()"
                  >
                    @if (loading()) {
                      <span class="spinner-border spinner-border-sm me-2"></span>
                      Procesando...
                    } @else {
                      <span class="btn-icon">✓</span>
                      Confirmar Cita
                    }
                  </button>
                </div>

                <!-- Enlace para volver -->
                <div class="text-center mt-3">
                  <a [routerLink]="['/', business()!.slug]" class="back-link">
                    ← Volver al catálogo de servicios
                  </a>
                </div>
              </form>
            </div>
          </c-col>
        </c-row>
      </c-container>
    }
  `,
  styles: [`
    /* Header */
    .book-header {
      position: relative;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 60px 0 100px;
      overflow: hidden;
    }
    
    .header-pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%);
      opacity: 0.6;
    }
    
    .header-content {
      position: relative;
      z-index: 2;
    }
    
    .header-icon {
      display: flex;
      justify-content: center;
    }
    
    .icon-circle {
      width: 80px;
      height: 80px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      animation: float 3s ease-in-out infinite;
    }
    
    .icon-emoji {
      font-size: 2.5rem;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    
    .header-title {
      color: white;
      font-size: 2.5rem;
      font-weight: 700;
      text-shadow: 0 2px 10px rgba(0,0,0,0.2);
      margin-bottom: 0.5rem;
    }
    
    .header-subtitle {
      color: rgba(255,255,255,0.95);
      font-size: 1.1rem;
    }
    
    .header-wave {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      line-height: 0;
    }
    
    .header-wave svg {
      width: 100%;
      height: 100px;
    }
    
    /* Tarjeta de Reserva */
    .booking-card {
      background: white;
      border-radius: 16px;
      padding: 2.5rem;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    
    /* Información del Negocio */
    .business-info {
      padding-bottom: 1.5rem;
      border-bottom: 2px solid #f8f9fa;
    }
    
    .business-icon {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    
    /* Secciones del Formulario */
    .form-section {
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 12px;
    }
    
    .section-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.1rem;
      color: #212529;
      margin-bottom: 1rem;
    }
    
    .step-number {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
    }
    
    .label-icon {
      margin-right: 0.5rem;
    }
    
    /* Inputs */
    .form-control,
    .form-select {
      border: 2px solid #e9ecef;
      border-radius: 10px;
      padding: 0.75rem 1rem;
      transition: all 0.3s ease;
    }
    
    .form-control:focus,
    .form-select:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.15);
    }
    
    .form-control-lg,
    .form-select-lg {
      padding: 1rem 1.25rem;
      font-size: 1rem;
    }
    
    /* Resumen del Servicio */
    .service-summary {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border: 2px solid #667eea;
      margin-top: 1rem;
    }
    
    /* Botón de Envío */
    .btn-submit {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 50px;
      padding: 1rem 2rem;
      font-size: 1.1rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }
    
    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
      color: white;
    }
    
    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .btn-icon {
      font-size: 1.2rem;
    }
    
    /* Enlace de Volver */
    .back-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .back-link:hover {
      color: #764ba2;
      text-decoration: underline;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .book-header {
        padding: 40px 0 80px;
      }
      
      .header-title {
        font-size: 2rem;
      }
      
      .booking-card {
        padding: 1.5rem;
      }
      
      .form-section {
        padding: 1rem;
      }
    }
  `]
})
export class BookComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private businessService = inject(BusinessService);
  private appointmentService = inject(AppointmentsService);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);

  business = signal<any>(null);
  services = signal<any[]>([]);
  selectedService = signal<any>(null);
  loading = signal(false);
  minDate = new Date().toISOString().split('T')[0];

  bookingForm: FormGroup;
  availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  constructor() {
    this.bookingForm = this.fb.group({
      patientName: ['', Validators.required],
      patientPhone: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      serviceId: ['', Validators.required]
    });

    // Escuchar cambios en el servicio seleccionado
    this.bookingForm.get('serviceId')?.valueChanges.subscribe(value => {
      const service = this.services().find(s => s.id === value);
      this.selectedService.set(service || null);
    });
  }

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('businessSlug');
    if (slug) {
      this.businessService.getPublicInfo(slug).subscribe(res => {
        this.business.set(res);
        this.services.set(res.products || []);
      });
    }

    // Si viene un servicio seleccionado desde el catálogo
    const serviceId = this.route.snapshot.queryParams['service'];
    if (serviceId) {
      this.bookingForm.patchValue({ serviceId });
    }
  }

  onSubmit() {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const slug = this.business()!.slug;
    const formData = this.bookingForm.value;

    this.appointmentService.createPublic(slug, formData).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.toastr.success('¡Cita agendada exitosamente!', 'Éxito');
        this.bookingForm.reset();
        
        // Redirigir al catálogo después de 2 segundos
        setTimeout(() => {
          window.location.href = `/${slug}`;
        }, 2000);
      },
      error: (error) => {
        this.loading.set(false);
        this.toastr.error('Error al agendar la cita', 'Error');
        console.error('Error:', error);
      }
    });
  }
}