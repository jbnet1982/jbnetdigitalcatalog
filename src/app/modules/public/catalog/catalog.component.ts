import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { GridModule, CardModule, ButtonModule, BadgeModule, FormModule } from '@coreui/angular';
import { BusinessService } from '../../../core/services/business.service';
import { debounceTime, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, GridModule, CardModule, ButtonModule, BadgeModule, FormModule],
  template: `
    @if (business()) {
      <!-- Header Profesional -->
      <header class="header-professional">
        <div class="header-pattern"></div>
        <div class="header-content">
          <c-container>
            <div class="text-center">
              <!-- Logo/Icono -->
              <div class="header-icon mb-4">
                <div class="icon-circle">
                  <span class="icon-emoji">🦷</span>
                </div>
              </div>
              
              <!-- Título -->
              <h1 class="header-title mb-3">{{ business()!.name }}</h1>
              
              <!-- Subtítulo -->
              <p class="header-subtitle mb-2">
                <span class="location-badge">
                  📍 {{ business()!.address }}
                </span>
                <span class="phone-badge">
                  📞 {{ business()!.phone }}
                </span>
              </p>
              
              <!-- Descripción -->
              <p class="header-description mb-4">
                Tu salud dental es nuestra prioridad. Ofrecemos servicios de calidad con tecnología de vanguardia.
              </p>
              
              <!-- Botones de Acción -->
              <div class="header-actions">
                <a [routerLink]="['/', business()!.slug, 'book']" class="btn-action btn-primary-action">
                  <span class="btn-icon">📅</span>
                  <span>Agendar Cita</span>
                </a>
                <a [href]="'https://wa.me/' + business()!.phone" target="_blank" class="btn-action btn-whatsapp-action">
                  <span class="btn-icon"></span>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </c-container>
        </div>
        
        <!-- Onda Decorativa -->
        <div class="header-wave">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="#f8f9fa"></path>
          </svg>
        </div>
      </header>

      <!-- Sección de Servicios -->
      <c-container class="py-5">
        <div class="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
          <div>
            <h2 class="mb-1 fw-bold display-6">Nuestros Servicios</h2>
            <p class="text-muted mb-0">Encuentra el tratamiento perfecto para ti</p>
          </div>
          <c-badge color="primary" class="fs-6 px-3 py-2 rounded-pill">
            {{ filteredProducts.length }} {{ filteredProducts.length === 1 ? 'servicio' : 'servicios' }}
          </c-badge>
        </div>

        <!-- Barra de Búsqueda Profesional -->
        <div class="mb-5">
          <div class="search-container">
            <div class="search-wrapper">
              <span class="search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </span>
              <input
                [formControl]="searchControl"
                class="search-input"
                placeholder="¿Qué servicio estás buscando?"
                type="text"
              />
              @if (searchControl.value) {
                <button
                  class="search-clear"
                  (click)="clearSearch()"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </button>
              }
            </div>
            <div class="search-hint">
              <small class="text-muted">
                💡 Ejemplos: "limpieza", "ortodoncia", "blanqueamiento"
              </small>
            </div>
          </div>
        </div>

        <!-- Resultados -->
        @if (filteredProducts.length > 0) {
          <c-row>
            @for (p of filteredProducts; track p.id) {
              <c-col xs="12" sm="6" lg="4" xl="3" class="mb-4">
                <c-card class="h-100 border-0 shadow-sm product-card">
                  <!-- Imagen del Servicio -->
                  <div class="position-relative overflow-hidden" style="height: 220px;">
                    <img 
                      [src]="p.imageUrl" 
                      [alt]="p.name"
                      class="w-100 h-100"
                      style="object-fit: cover;"
                    />
                    <!-- Badge de Categoría -->
                    <c-badge 
                      [color]="p.category === 'consulta' ? 'info' : 'primary'"
                      class="position-absolute top-0 start-0 m-3 fs-6 px-3 py-2 rounded-pill"
                    >
                      {{ p.category | uppercase }}
                    </c-badge>
                    <!-- Badge de Precio -->
                    <c-badge 
                      color="success"
                      class="position-absolute bottom-0 end-0 m-3 fs-5 px-3 py-2 rounded-pill"
                    >
                      \${{ p.price }}
                    </c-badge>
                  </div>
                  
                  <!-- Contenido de la Tarjeta -->
                  <c-card-body class="p-4">
                    <h5 class="card-title fw-bold mb-2">{{ p.name }}</h5>
                    <p class="card-text text-muted mb-4" style="min-height: 60px; font-size: 0.9rem;">
                      {{ p.description }}
                    </p>
                    <a 
                      [routerLink]="['/', business()!.slug, 'book']"
                      cButton 
                      color="primary" 
                      class="w-100 btn-hover"
                      [queryParams]="{ service: p.id }"
                    >
                      Agendar Ahora →
                    </a>
                  </c-card-body>
                </c-card>
              </c-col>
            }
          </c-row>
        } @else {
          <div class="text-center py-5">
            <div style="font-size: 5rem; margin-bottom: 1rem;">🔍</div>
            <h4 class="text-body-secondary mb-3">No se encontraron servicios</h4>
            <p class="text-body-secondary mb-4">
              Intenta con otro término de búsqueda
            </p>
            <button cButton color="primary" size="lg" (click)="clearSearch()" class="btn-hover">
              Ver todos los servicios
            </button>
          </div>
        }
      </c-container>

      <!-- Footer -->
      <footer class="bg-dark text-white py-4 mt-5">
        <c-container class="text-center">
          <p class="mb-2">&copy; 2026 {{ business()!.name }}</p>
          <p class="mb-0 text-muted small">Todos los derechos reservados</p>
        </c-container>
      </footer>
    }
  `,
  styles: [`
    /* Header Profesional */
    .header-professional {
      position: relative;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 80px 0 120px;
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
      width: 100px;
      height: 100px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      animation: float 3s ease-in-out infinite;
    }
    
    .icon-emoji {
      font-size: 3rem;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    
    .header-title {
      color: white;
      font-size: 3.5rem;
      font-weight: 700;
      text-shadow: 0 2px 10px rgba(0,0,0,0.2);
      margin-bottom: 1rem;
    }
    
    .header-subtitle {
      color: rgba(255,255,255,0.95);
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }
    
    .location-badge,
    .phone-badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 8px 16px;
      border-radius: 20px;
      margin: 0 8px;
      backdrop-filter: blur(10px);
    }
    
    .header-description {
      color: rgba(255,255,255,0.9);
      font-size: 1.1rem;
      max-width: 600px;
      margin: 0 auto 2rem;
      line-height: 1.6;
    }
    
    .header-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn-action {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 32px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 1.1rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    
    .btn-primary-action {
      background: white;
      color: #667eea;
    }
    
    .btn-primary-action:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.3);
      color: #667eea;
    }
    
    .btn-whatsapp-action {
      background: #25D366;
      color: white;
    }
    
    .btn-whatsapp-action:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
      color: white;
      background: #20bd5a;
    }
    
    .btn-icon {
      font-size: 1.3rem;
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
      height: 120px;
    }
    
    /* Tarjetas de Productos */
    .product-card {
      transition: all 0.3s ease;
      cursor: pointer;
      border-radius: 12px;
      overflow: hidden;
    }
    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.15) !important;
    }
    .product-card:hover img {
      transform: scale(1.05);
    }
    .product-card img {
      transition: transform 0.3s ease;
    }
    
    /* Buscador */
    .search-container {
      max-width: 700px;
      margin: 0 auto;
    }
    
    .search-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      background: white;
      border-radius: 50px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      border: 2px solid transparent;
      overflow: hidden;
    }
    
    .search-wrapper:focus-within {
      box-shadow: 0 8px 30px rgba(13, 110, 253, 0.2);
      border-color: #0d6efd;
      transform: translateY(-2px);
    }
    
    .search-icon {
      position: absolute;
      left: 25px;
      top: 50%;
      transform: translateY(-50%);
      color: #6c757d;
      z-index: 1;
      pointer-events: none;
      transition: color 0.3s ease;
    }
    
    .search-wrapper:focus-within .search-icon {
      color: #0d6efd;
    }
    
    .search-input {
      width: 100%;
      padding: 18px 60px 18px 60px;
      border: none;
      outline: none;
      font-size: 1.1rem;
      background: transparent;
      color: #212529;
    }
    
    .search-input::placeholder {
      color: #adb5bd;
      font-weight: 400;
    }
    
    .search-clear {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      background: #6c757d;
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      color: white;
      padding: 0;
    }
    
    .search-clear:hover {
      background: #dc3545;
      transform: translateY(-50%) rotate(90deg);
    }
    
    .search-hint {
      text-align: center;
      margin-top: 12px;
      padding: 8px 16px;
      background: #f8f9fa;
      border-radius: 8px;
      font-size: 0.85rem;
    }
    
    /* Botones hover */
    .btn-hover {
      transition: all 0.3s ease;
    }
    
    .btn-hover:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .header-professional {
        padding: 60px 0 100px;
      }
      
      .header-title {
        font-size: 2.5rem;
      }
      
      .icon-circle {
        width: 80px;
        height: 80px;
      }
      
      .icon-emoji {
        font-size: 2.5rem;
      }
      
      .location-badge,
      .phone-badge {
        display: block;
        margin: 8px auto;
      }
      
      .search-input {
        padding: 15px 50px 15px 50px;
        font-size: 1rem;
      }
      
      .search-icon {
        left: 18px;
      }
      
      .search-clear {
        right: 15px;
        width: 28px;
        height: 28px;
      }
    }
  `]
})
export class CatalogComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(BusinessService);
  
  business = signal<any>(null);
  searchControl = new FormControl('');
  filteredProducts: any[] = [];
  allProducts: any[] = [];

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('businessSlug');
    if (slug) {
      this.service.getPublicInfo(slug).subscribe(res => {
        this.business.set(res);
        this.allProducts = res.products || [];
        this.filteredProducts = this.allProducts;
      });
    }

    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300)
      )
      .subscribe(value => {
        this.filterProducts(value || '');
      });
  }

  filterProducts(searchTerm: string): void {
    const term = searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.filteredProducts = [...this.allProducts];
      return;
    }

    this.filteredProducts = this.allProducts.filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.price.toString().includes(term)
    );
  }

  clearSearch() {
    this.searchControl.setValue('');
  }
}