import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {QuoteRefundActions} from "./refund.actions";
import {QuoteRefundService} from "./refund.service";
import {PosGeneralState} from "../../general/general.state";
import * as _ from 'lodash';
import {NotifyManager} from "../../../../../services/notify-manager";
import {RootActions} from "../../../../../R/root.actions";
import {Observable} from "rxjs/Observable";

@Injectable()
export class QuoteRefundEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private refundService: QuoteRefundService,
              private refundActions: QuoteRefundActions,
              private notify: NotifyManager,
              private rootActions: RootActions) { }
  
  @Effect() loadCreditmemo = this.actions$
                                 .ofType(
                                   QuoteRefundActions.ACTION_LOAD_CREDITMEMO
                                 )
                                 .withLatestFrom(this.store$.select('general'))
                                 .switchMap((z: any) => {
                                   const action: Action                = z[0];
                                   const generalState: PosGeneralState = z[1];
                                   const isSave                        = action.payload['isSave'];
    
                                   let data            = {order_id: action.payload['orderId'], is_save: isSave};
                                   data['register_id'] = generalState.register['id'];
                                   data['outlet_id']   = generalState.outlet['id'];
    
                                   if (action.payload['creditmemo']) {
                                     data['creditmemo'] = action.payload['creditmemo'];
                                   }
    
                                   this.notify.info("loading_creditmemo");
                                   return this.refundService.createLoadCreditmemoRequest(data, generalState)
                                              .filter((_data) => {
                                                if (_.isObject(_data) && _data.hasOwnProperty('items')) {
                                                  return true;
                                                } else {
                                                  this.notify.error("load_creditmemo_failed");
                                                  return false;
                                                }
                                              })
                                              .map((d) => {
                                                this.notify.success('load_creditmemo_success');
                                                return !isSave ?
                                                  this.refundActions.loadCreditmemoSuccess(d, false) :
                                                  this.refundActions.saveCreditmemoSuccess(d['items'][0], false);
                                              })
                                              .catch((e) => {
                                                return Observable.of(this.rootActions.error("load_creditmemo_failed", e, false));
                                              });
                                 });
}
