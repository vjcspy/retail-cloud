import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {ShiftListActions} from "../list/list.actions";
import {ShiftDetailService} from "./detail.service";
import {ShiftState} from "../shift.state";
import {PosEntitiesState} from "../../../../../R/entities/entities.state";
import {ShiftDetailActions} from "./detail.actions";
import * as _ from 'lodash';
import {Observable} from "rxjs";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";
import {TutorialService} from "../../../../../modules/+tutorial/tutorial.service";

@Injectable()
export class ShiftDetailEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private detailService: ShiftDetailService,
              private shiftDetailActions: ShiftDetailActions,
              private shiftListActions: ShiftListActions,
              private posQuoteActions: PosQuoteActions,
              private tourService: TutorialService) { }
  
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
  
  @Effect() close_shift = this.actions$
                              .ofType(
                                ShiftDetailActions.ACTION_CLOSE_SHIFT
                              )
                              .withLatestFrom(this.store$.select('general'))
                              .switchMap((z) => {
                                const action: Action = z[0];
                                return this.detailService.createCloseShiftRequest(action.payload['shift'], action.payload['data'], <any>z[1])
                                           .map((data) => {
                                             if (_.isArray(data.items) && _.size(data.items) == 1) {
                                               return this.shiftDetailActions.closeShiftSuccess(data.items[0], false);
                                             } else {
                                               return this.shiftDetailActions.closeShiftFailed('check_connector', false);
                                             }
                                           })
                                           .catch((e) => {
                                             return Observable.of(this.shiftDetailActions.closeShiftFailed('close_shift_error_from_sv', false));
                                           });
                              });
  
  @Effect() affterCloseShiftSuccess = this.actions$
                                          .ofType(
                                            ShiftDetailActions.ACTION_CLOSE_SHIFT_SUCCESS
                                          )
                                          .flatMap((action) => {
                                            return Observable.from(
                                              [
                                                this.shiftListActions.selectShiftDetail(action.payload['shift'], false),
                                                this.posQuoteActions.updateQuoteInfo({isShiftOpening: false}, false)
                                              ]);
                                          });
  
  @Effect() openShift = this.actions$
                            .ofType(
                              ShiftDetailActions.ACTION_OPEN_SHIFT
                            )
                            .withLatestFrom(this.store$.select('general'))
                            .switchMap((z) => {
                              const action = z[0];
    
                              return this.detailService.createOpenShiftRequest(action.payload['shiftOpenData'], <any>z[1])
                                         .map((data) => {
                                           this.tourService.tour.next();
                                           if (_.isArray(data.items) && _.size(data.items) == 1) {
                                             return this.shiftDetailActions.openShiftSuccess(data.items[0], false);
                                           } else {
                                             return this.shiftDetailActions.openShiftFailed('check_connector', false);
                                           }
                                         })
                                         .catch((e) => {
                                           return Observable.of(this.shiftDetailActions.openShiftFailed('close_shift_error_from_sv', false));
                                         });
                            });
  
  @Effect() openShiftSuccess = this.actions$
                                   .ofType(
                                     ShiftDetailActions.ACTION_OPEN_SHIFT_SUCCESS
                                   )
                                   .flatMap((action) => {
                                     return Observable.from(
                                       [
                                         this.shiftListActions.selectShiftDetail(action.payload['shift'], false),
                                         this.posQuoteActions.updateQuoteInfo({isShiftOpening: true}, false)
                                       ]);
                                   });
  
  @Effect() adjustShift = this.actions$
                              .ofType(
                                ShiftDetailActions.ACTION_ADJUST_SHIFT
                              )
                              .withLatestFrom(this.store$.select('general'))
                              .switchMap((z) => {
                                const action = z[0];
    
                                return this.detailService.createAdjustShiftRequest(action.payload['shift'], action.payload['data'], <any>z[1])
                                           .map((data) => {
                                             if (_.isArray(data.items) && _.size(data.items) == 1) {
                                               return this.shiftDetailActions.adjustShiftSuccess(data.items[0], false);
                                             } else {
                                               return this.shiftDetailActions.adjustShiftFailed('check_connector', false);
                                             }
                                           })
                                           .catch((e) => {
                                             return Observable.of(this.shiftDetailActions.adjustShiftFailed('adjust_shift_error_from_sv', false));
                                           });
                              });
  
  @Effect() adjustShiftSuccess = this.actions$
                                     .ofType(
                                       ShiftDetailActions.ACTION_ADJUST_SHIFT_SUCCESS
                                     )
                                     .flatMap((action) => {
                                       return Observable.from(
                                         [
                                           this.shiftListActions.selectShiftDetail(action.payload['shift'], false)
                                         ]);
                                     });
  
}
