import {Injectable} from '@angular/core';

@Injectable()
export class NumberHelper {
  static round(price: number, places: number = 2): number {
    return +(Math.round(parseFloat(parseFloat(price + "") + "e+" + places)) + "e-" + places);
  }
}
