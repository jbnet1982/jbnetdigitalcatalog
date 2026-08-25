import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class PermissionsDirective {
  private authService = inject(AuthService);
  
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() set appHasPermission(permission: string | string[]) {
    const user = this.authService.getCurrentUser() as { role?: string } | null;
    if (!user) {
      this.viewContainer.clear();
      return;
    }

    const permissions = Array.isArray(permission) ? permission : [permission];
    const hasPermission = !!user.role && permissions.includes(user.role);

    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}