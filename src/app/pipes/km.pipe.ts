import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'km',
  standalone: true
})
export class KmPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    if (value >= 1e3) return (value / 1e3).toFixed(1) + ' Km'
    return value.toString()+" m"
  }

}
