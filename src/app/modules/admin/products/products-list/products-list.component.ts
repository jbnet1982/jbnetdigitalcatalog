import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule, TableModule, BadgeModule, ButtonModule, FormModule, GridModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { cilPlus, cilMagnifyingGlass, cilPencil, cilTrash } from '@coreui/icons';
import { ProductsService } from '../../../../core/services/products.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterLink, CardModule, TableModule, BadgeModule, ButtonModule, FormModule, GridModule, IconModule],
  template: `
    <c-card>
      <c-card-header class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Productos y Servicios</h5>
        <a routerLink="new" cButton color="primary" size="sm">
          <svg cIcon name="cilPlus" class="me-1"></svg> Nuevo
        </a>
      </c-card-header>
      <c-card-body>
        <div class="input-group mb-3" style="max-width: 300px;">
          <span class="input-group-text"><svg cIcon name="cilMagnifyingGlass"></svg></span>
          <input cFormInput placeholder="Buscar..." (input)="search($event)" />
        </div>
        <table cTable hover responsive>
          <thead>
            <tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            @for (p of products(); track p.id) {
              <tr>
                <td>{{ p.name }}</td>
                <td>{{ p.category }}</td>
                <td>\${{ p.price }}</td>
                <td><c-badge [color]="p.active ? 'success' : 'danger'">{{ p.active ? 'Activo' : 'Inactivo' }}</c-badge></td>
                <td>
                  <a [routerLink]="['../edit', p.id]" cButton color="info" size="sm" class="me-1">
                    <svg cIcon name="cilPencil"></svg>
                  </a>
                  <button cButton color="danger" size="sm" (click)="delete(p.id)">
                    <svg cIcon name="cilTrash"></svg>
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </c-card-body>
    </c-card>
  `
})
export class ProductsListComponent implements OnInit {
  private service = inject(ProductsService);
  products = signal<any[]>([]);
  cilPlus = cilPlus; 
  cilMagnifyingGlass = cilMagnifyingGlass; 
  cilPencil = cilPencil; 
  cilTrash = cilTrash;

  ngOnInit() { this.load(); }
  
  load() { 
    this.service.getAll().subscribe(res => this.products.set(res.data)); 
  }
  
  search(e: any) { 
    // Implementar debounce
  }
  
  delete(id: string) { 
    if(confirm('¿Eliminar?')) { 
      this.service.delete(id).subscribe(() => this.load()); 
    } 
  }
}