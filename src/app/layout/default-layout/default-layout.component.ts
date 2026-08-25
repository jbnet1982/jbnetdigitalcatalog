import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { 
  SidebarModule,
  HeaderModule,
  NavModule,
  FooterModule,
  DropdownModule,
  GridModule,
  BreadcrumbModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { cilSpeedometer, cilCart, cilCalendar, cilSettings, cilAccountLogout, cilUser } from '@coreui/icons';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    SidebarModule,
    HeaderModule,
    NavModule,
    FooterModule,
    DropdownModule,
    GridModule,
    BreadcrumbModule,
    IconModule
  ],
  template: `
    <c-sidebar colorScheme="dark" visible>
      <c-sidebar-nav>
        <div class="nav-title">Panel Admin</div>
        <c-nav-item>
          <a cNavLink routerLink="/dashboard" routerLinkActive="active">
            <svg cIcon name="cilSpeedometer"></svg> Dashboard
          </a>
        </c-nav-item>
        <c-nav-item>
          <a cNavLink routerLink="/admin/products" routerLinkActive="active">
            <svg cIcon name="cilCart"></svg> Productos
          </a>
        </c-nav-item>
        <c-nav-item>
          <a cNavLink routerLink="/admin/appointments" routerLinkActive="active">
            <svg cIcon name="cilCalendar"></svg> Citas
          </a>
        </c-nav-item>
        <div class="nav-title">Configuración</div>
        <c-nav-item>
          <a cNavLink routerLink="/admin/config" routerLinkActive="active">
            <svg cIcon name="cilSettings"></svg> Ajustes
          </a>
        </c-nav-item>
      </c-sidebar-nav>
    </c-sidebar>

    <div class="wrapper d-flex flex-column min-vh-100 bg-light">
      <c-header class="mb-4 d-print-none">
        <c-container fluid>
          <button cHeaderToggler class="d-lg-none" cSidebarToggle="lg">
            <svg cIcon name="cilMenu"></svg>
          </button>
          <div class="ms-auto">
            <c-dropdown placement="bottom-end">
              <button cDropdownToggle>
                <span class="me-2">{{ authService.getCurrentUser()?.name || 'Usuario' }}</span>
                <svg cIcon name="cilUser" size="lg"></svg>
              </button>
              <ul cDropdownMenu>
                <li><hr class="dropdown-divider"></li>
                <li><button cDropdownItem (click)="authService.logout()">
                  <svg cIcon name="cilAccountLogout" class="me-2"></svg> Cerrar Sesión
                </button></li>
              </ul>
            </c-dropdown>
          </div>
        </c-container>
      </c-header>

      <div class="body flex-grow-1 px-3">
        <c-container fluid>
          <router-outlet />
        </c-container>
      </div>

      <c-footer>
        <div>&copy; 2024 Business Admin</div>
      </c-footer>
    </div>
  `
})
export class DefaultLayoutComponent {
  authService = inject(AuthService);
  cilSpeedometer = cilSpeedometer;
  cilCart = cilCart;
  cilCalendar = cilCalendar;
  cilSettings = cilSettings;
  cilAccountLogout = cilAccountLogout;
  cilUser = cilUser;
}