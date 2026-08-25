import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // Redirección inicial
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // ==================== RUTAS PÚBLICAS (Autenticación) ====================
  {
    path: 'login',
    loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./modules/auth/register/register.component').then(m => m.RegisterComponent)
  },

  // ==================== RUTAS PROTEGIDAS (Dashboard + Admin) ====================
  {
    path: '',
    loadComponent: () => import('./layout/default-layout/default-layout.component').then(m => m.DefaultLayoutComponent),
    canActivate: [authGuard],
    children: [
      // Dashboard
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: { title: 'Dashboard' }
      },

      // Productos - Rutas anidadas
      {
        path: 'admin/products',
        children: [
          {
            path: '',
            loadComponent: () => import('./modules/admin/products/products-list/products-list.component').then(m => m.ProductsListComponent),
            data: { title: 'Productos y Servicios' }
          },
          {
            path: 'new',
            loadComponent: () => import('./modules/admin/products/products-form/products-form.component').then(m => m.ProductsFormComponent),
            data: { title: 'Nuevo Producto' }
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./modules/admin/products/products-form/products-form.component').then(m => m.ProductsFormComponent),
            data: { title: 'Editar Producto' }
          }
        ]
      },

      // Citas - Rutas anidadas
      {
        path: 'admin/appointments',
        children: [
          {
            path: '',
            loadComponent: () => import('./modules/admin/appointments/calendar/calendar.component').then(m => m.CalendarComponent),
            data: { title: 'Calendario de Citas' }
          },
          {
            path: 'list',
            loadComponent: () => import('./modules/admin/appointments/list/list.component').then(m => m.AppointmentsListComponent),
            data: { title: 'Listado de Citas' }
          }
        ]
      },

      // Configuración
      {
        path: 'admin/config',
        loadComponent: () => import('./modules/admin/config/config.component').then(m => m.ConfigComponent),
        data: { title: 'Configuración del Negocio' }
      },

      // Redirección por defecto dentro del layout protegido
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // ==================== RUTAS PÚBLICAS (Landing Page) ====================
  // Estas rutas están FUERA del layout de admin y son accesibles sin autenticación
  {
    path: ':businessSlug',
    loadComponent: () => import('./modules/public/catalog/catalog.component').then(m => m.CatalogComponent),
    data: { title: 'Catálogo' }
  },
  {
    path: ':businessSlug/book',
    loadComponent: () => import('./modules/public/book/book.component').then(m => m.BookComponent),
    data: { title: 'Agendar Cita' }
  },

  // ==================== RUTA COMODÍN (404) ====================
  {
    path: '**',
    redirectTo: 'login'
  }
];