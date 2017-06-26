import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {RootActions} from "./root.actions";
import {NotifyManager} from "../services/notify-manager";
import * as _ from 'lodash';

@Injectable()
export class RootEffects {
  
  constructor(private store$: Store<any>, private actions$: Actions, private notify: NotifyManager) { }
  
  @Effect() notifyError = this.actions$.ofType(RootActions.ACTION_ERROR)
                              .map((action: Action) => {
                                if (action.payload.hasOwnProperty('mess') && _.isString(action.payload['mess'])) {
                                  this.notify.error(action.payload['mess']);
                                }
                                return {type: RootActions.ACTION_NOTIFY_ERROR};
                              });
}
