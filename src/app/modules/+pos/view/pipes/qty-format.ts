import {Pipe, PipeTransform} from '@angular/core';
import {NumberHelper} from "../../services/helper/number-helper";

@Pipe({
        name: 'qtyFormat'
      })

export class QtyFormatPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (isNaN(value)) {
      return 0;
    }
    
    return value % 1 !== 0 ? NumberHelper.round(value, 2) : value;
  }
}
