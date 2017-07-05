import {Injectable} from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {PosEntitiesActions} from "../../../../../R/entities/entities.actions";
import {OfflineService} from "../../../../../../share/provider/offline";
import {PosEntitiesState} from "../../../../../R/entities/entities.state";
import * as moment from 'moment';
import {List} from "immutable";
import {ShiftListActions} from "./list.actions";

@Injectable()
export class ShiftListEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private offlineService: OfflineService,
              private shiftListActions: ShiftListActions) { }
  
  @Effect() resolvedShift = this.actions$
                                .ofType(
                                  PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS,
                                )
                                .withLatestFrom(this.store$.select('entities'))
                                .map((z) => {
                                  const shifts = (z[1] as PosEntitiesState).shifts.items;
    
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
