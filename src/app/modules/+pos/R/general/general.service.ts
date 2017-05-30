import {Injectable} from '@angular/core';

@Injectable()
export class PosGeneralService {
  validateCurrentState(generalState): boolean {
    return !(!generalState.store.hasOwnProperty('id') || !generalState.outlet.hasOwnProperty('id') || !generalState.register.hasOwnProperty('id'));
  }
}
