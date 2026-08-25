import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private http = inject(HttpClient);
  private cloudinaryConfig = environment.cloudinary;

  /**
   * Sube una sola imagen a Cloudinary y devuelve la URL segura
   */
  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.cloudinaryConfig.uploadPreset);

    return this.http.post<any>(
      `https://api.cloudinary.com/v1_1/${this.cloudinaryConfig.cloudName}/image/upload`,
      formData
    ).pipe(
      map(response => response.secure_url)
    );
  }

  /**
   * Sube múltiples imágenes en paralelo y devuelve un array de URLs
   */
  uploadMultipleImages(files: File[]): Observable<string[]> {
    // Si no hay archivos, devolvemos un array vacío inmediatamente
    if (!files || files.length === 0) {
      return new Observable<string[]>(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    // Creamos un array de Observables (uno por cada archivo)
    const uploadObservables = files.map(file => this.uploadImage(file));
    
    // forkJoin ejecuta todos los observables en paralelo y espera a que TODOS terminen.
    // Luego emite un solo array con todos los resultados en el mismo orden.
    return forkJoin(uploadObservables);
  }
}