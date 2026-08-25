import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CardModule, ButtonModule, FormModule, GridModule, TabsModule } from '@coreui/angular';
import { BusinessService } from '../../../core/services/business.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, ButtonModule, FormModule, GridModule, TabsModule],
  template: `
    <c-card>
      <c-card-header>
        <h5 class="mb-0">Configuración del Negocio</h5>
      </c-card-header>
      <c-card-body>
        <ul cTabs variant="tabs" role="tablist">
          <li cTab active>
            <a cTabLink>General</a>
            <div cTabContent>
              <form [formGroup]="form" (ngSubmit)="save()">
                <c-row>
                  <c-col md="6">
                    <div class="mb-3">
                      <label class="form-label">Nombre</label>
                      <input cFormInput formControlName="name" />
                    </div>
                  </c-col>
                  <c-col md="6">
                    <div class="mb-3">
                      <label class="form-label">Teléfono</label>
                      <input cFormInput formControlName="phone" />
                    </div>
                  </c-col>
                  <c-col md="12">
                    <div class="mb-3">
                      <label class="form-label">Dirección</label>
                      <input cFormInput formControlName="address" />
                    </div>
                  </c-col>
                </c-row>
                <button cButton color="primary" type="submit">Guardar Cambios</button>
              </form>
            </div>
          </li>
          <li cTab>
            <a cTabLink>Apariencia</a>
            <div cTabContent>
              <c-row>
                <c-col md="4">
                  <div class="mb-3">
                    <label class="form-label">Color Primario</label>
                    <input cFormInput type="color" formControlName="primaryColor" style="height:50px" />
                  </div>
                </c-col>
              </c-row>
              <button cButton color="primary" (click)="saveAppearance()">Guardar Colores</button>
            </div>
          </li>
        </ul>
      </c-card-body>
    </c-card>
  `
})
export class ConfigComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(BusinessService);
  private toastr = inject(ToastrService);
  
  form = this.fb.group({ 
    name: [''], 
    phone: [''], 
    address: [''], 
    primaryColor: ['#321fdb'] 
  });

  ngOnInit() {
    this.service.getCurrent().subscribe(b => this.form.patchValue(b));
  }

  save() {
    const { name, phone, address, primaryColor } = this.form.value;
    this.service.update({
      name: name ?? undefined,
      phone: phone ?? undefined,
      address: address ?? undefined,
      primaryColor: primaryColor ?? undefined,
    }).subscribe(() => this.toastr.success('Guardado'));
  }
  
  saveAppearance() {
    const primary = this.form.value.primaryColor;
    this.service.update({ primaryColor: primary ?? undefined })
      .subscribe(() => this.toastr.success('Colores actualizados'));
  }
}