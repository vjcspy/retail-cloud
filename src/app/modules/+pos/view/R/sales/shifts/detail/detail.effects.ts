import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {ShiftListActions} from "../list/list.actions";
import {ShiftDetailService} from "./detail.service";
import {ShiftState} from "../shift.state";
import {PosEntitiesState} from "../../../../../R/entities/entities.state";
import {ShiftDetailActions} from "./detail.actions";

@Injectable()
export class ShiftDetailEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private detailService: ShiftDetailService,
              private shiftDetailActions: ShiftDetailActions) { }
  
  @Effect() calculateShiftDetail = this.actions$
                                       .ofType(
                                         ShiftListActions.ACTION_SELECT_SHIFT_DETAIL
                                       )
                                       .withLatestFrom(this.store$.select('shifts'))
                                       .withLatestFrom(this.store$.select('entities'), (z, z1) => [...z, z1])
                                       .map((z) => {
                                         const payments = (z[2] as PosEntitiesState).payment.items;
                                         const shift    = (z[1] as ShiftState).detail.shift;
                                         const amounts  = this.detailService.getTransactionAmounts(shift, payments);
    
                                         return this.shiftDetailActions.calculatedShiftDetail(amounts, false);
                                       });
}
