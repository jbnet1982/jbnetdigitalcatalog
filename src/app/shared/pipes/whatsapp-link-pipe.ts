import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'whatsappLink'
})
export class WhatsappLinkPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
