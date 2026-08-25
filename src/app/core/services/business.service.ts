import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  
getPublicInfo(slug: string): Observable<any> {
  const mockBusiness = {
    id: '1',
    name: 'Clínica Dental Sonrisas',
    slug: slug,
    address: 'Av. Principal #123, Ciudad',
    phone: '5551234567',
    primaryColor: '#0d6efd',
    products: [
      {
        id: '101',
        name: 'Consulta General',
        description: 'Evaluación inicial completa con diagnóstico y plan de tratamiento personalizado.',
        price: 25.00,
        category: 'consulta',
        imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80',
        active: true
      },
      {
        id: '102',
        name: 'Limpieza Dental',
        description: 'Limpieza profunda con ultrasonido y aplicación de flúor para prevenir caries.',
        price: 45.00,
        category: 'tratamiento',
        imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80',
        active: true
      },
      {
        id: '103',
        name: 'Blanqueamiento Dental',
        description: 'Blanqueamiento profesional con luz LED en una sola sesión. Resultados inmediatos.',
        price: 120.00,
        category: 'tratamiento',
        imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80',
        active: true
      },
      {
        id: '104',
        name: 'Ortodoncia Tradicional',
        description: 'Brackets metálicos de alta calidad. Incluye instalación y ajustes mensuales.',
        price: 800.00,
        category: 'tratamiento',
        imageUrl: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&auto=format&fit=crop&q=80',
        active: true
      },
      {
        id: '105',
        name: 'Ortodoncia Invisible',
        description: 'Alineadores transparentes removibles. Estética y comodidad en tu tratamiento.',
        price: 1500.00,
        category: 'tratamiento',
        imageUrl: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&auto=format&fit=crop&q=80',
        active: true
      },
      {
        id: '106',
        name: 'Extracción Simple',
        description: 'Extracción de dientes sin complicaciones con anestesia local.',
        price: 60.00,
        category: 'tratamiento',
        imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&auto=format&fit=crop&q=80',
        active: true
      },
{
  id: '107',
  name: 'Extracción de Muela del Juicio',
  description: 'Cirugía menor para extracción de terceros molares con recuperación rápida.',
  price: 150.00,
  category: 'tratamiento',
  imageUrl: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&auto=format&fit=crop&q=80',
  active: true
},
      {
        id: '108',
        name: 'Empaste (Resina)',
        description: 'Restauración de caries con resina del color del diente. Acabado natural.',
        price: 35.00,
        category: 'tratamiento',
        imageUrl: 'https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?w=800&auto=format&fit=crop&q=80',
        active: true
      },
      {
        id: '109',
        name: 'Corona Dental',
        description: 'Corona de porcelana sobre diente natural o implante. Alta durabilidad.',
        price: 250.00,
        category: 'tratamiento',
        imageUrl: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&auto=format&fit=crop&q=80',
        active: true
      },
      {
        id: '110',
        name: 'Implante Dental',
        description: 'Implante de titanio con corona de porcelana. Solución permanente y estética.',
        price: 900.00,
        category: 'tratamiento',
        imageUrl: 'https://images.unsplash.com/photo-1628557044797-f21a177c37ec?w=800&auto=format&fit=crop&q=80',
        active: true
      },
      {
        id: '111',
        name: 'Endodoncia (Tratamiento de Conducto)',
        description: 'Tratamiento para salvar dientes con infección o daño profundo en la raíz.',
        price: 200.00,
        category: 'tratamiento',
        imageUrl: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&auto=format&fit=crop&q=80',
        active: true
      },
      {
        id: '112',
        name: 'Prótesis Dental Removible',
        description: 'Dentaduras parciales o completas personalizadas. Comodidad y estética natural.',
        price: 350.00,
        category: 'tratamiento',
        imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80',
        active: true
      }
    ]
  };

  return of(mockBusiness).pipe(delay(300));
}

  getCurrent(): Observable<any> {
    return of({
      id: '1',
      name: 'Mi Negocio',
      phone: '5551234567',
      address: 'Dirección de prueba',
      primaryColor: '#0d6efd'
    }).pipe(delay(300));
  }

  update(data: any): Observable<any> {
    return of({ success: true, data }).pipe(delay(300));
  }
}