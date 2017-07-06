import {Injectable} from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Action, Store} from "@ngrx/store";
import {OfflineService} from "../../../../../../share/provider/offline";
import * as moment from 'moment';
import {List} from "immutable";
import {ShiftListActions} from "./list.actions";
import {routerActions} from "@ngrx/router-store";
import {ShiftListService} from "./list.service";
import {ShiftState} from "../shift.state";
import * as _ from 'lodash';

@Injectable()
export class ShiftListEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private offlineService: OfflineService,
              private shiftListActions: ShiftListActions,
              private shiftListService: ShiftListService) { }
  
  @Effect() pullShift = this.actions$
                            .ofType(routerActions.UPDATE_LOCATION)
                            .filter((action: Action) => {
                              return action.payload.hasOwnProperty('path') ? action.payload['path'] === '/pos/default/sales/shifts' : true
                            })
                            .withLatestFrom(this.store$.select('general'))
                            .withLatestFrom(this.store$.select('shifts'), (z, z1) => [...z, z1])
                            .filter((z) => {
                              const shiftState: ShiftState = <any>z[2];
                              if (shiftState.list.currentPage >= shiftState.list.limitPage) {
                                return false
                              }
    
                              return true;
                            })
                            .switchMap((z) => {
                              const shiftState: ShiftState = <any>z[2];
                              return this.shiftListService.createGetShiftRequest(shiftState.list.currentPage, <any>z[1])
                                         .filter((data) => data.hasOwnProperty('items') && _.isArray(data['items']))
                                         .map((data) => {
                                           return this.shiftListActions.pulledShift(data['items'], data['last_page_number'], false);
                                         });
                            });
  
  @Effect() resolvedShift = this.actions$
                                .ofType(
                                  ShiftListActions.ACTION_PULLED_SHIFT,
                                )
                                .withLatestFrom(this.store$.select('shifts'))
                                .map((z) => {
                                  const shifts = (z[1] as ShiftState).list.shifts;
    
                                  let shiftSorted = shifts.sortBy((s) => {
                                    return -parseInt(s['id']);
                                  });
    
                                  let groped      = shiftSorted.groupBy((o) => {
                                    if (o['close_at']) {
                                      return moment(new Date(o['close_at'])).format("dddd, MMMM Do YYYY");
                                    } else {
                                      return moment().format('dddd, MMMM Do YYYY');
                                    }
                                  });
                                  let shiftGroped = groped.reduce((results, orders, timestamp) => {
                                    results = results.push({
                                                             timestamp: timestamp,
                                                             shifts: orders,
                                                             today: moment().format('dddd, MMMM Do YYYY') === timestamp
                                                           });
                                    return results;
                                  }, List.of());
    
                                  return this.shiftListActions.resolvedShift(shiftGroped, false);
                                });
}
