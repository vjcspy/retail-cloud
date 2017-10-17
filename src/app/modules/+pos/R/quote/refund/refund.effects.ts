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
import {PosQuoteState} from "../quote.state";

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
                                 .withLatestFrom(this.store$.select('quote'), (z, z1) => [...z, z1])
                                 .switchMap((z: any) => {
                                   const action: Action                = z[0];
                                   const generalState: PosGeneralState = z[1];
                                   const posQuoteState: PosQuoteState  = z[2];
                                   const isSave                        = action.payload['isSave'];
    
                                   let data            = {order_id: action.payload['orderId'], is_save: isSave};
                                   data['register_id'] = generalState.register['id'];
                                   data['outlet_id']   = generalState.outlet['id'];
                                   data['store_id']    = generalState.store['id'];
    
                                   let creditmemo = {};
                                   if (posQuoteState.creditmemo) {
                                     creditmemo['items'] = {};
                                     _.forEach(posQuoteState.creditmemo['items'], (item) => {
                                       creditmemo['items'][item['item_id']]        = {};
                                       creditmemo['items'][item['item_id']]['qty'] = item['qty'];
                                       if (item['back_to_stock']) {
                                         creditmemo['items'][item['item_id']]['back_to_stock'] = item['back_to_stock'];
                                       }
                                     });
      
                                     if (posQuoteState.creditmemo['adjustment'] > 0) {
                                       creditmemo['adjustment_positive'] = posQuoteState.creditmemo['adjustment'];
                                     }
                                     if (posQuoteState.creditmemo['adjustment'] < 0) {
                                       creditmemo['adjustment_negative'] = Math.abs(posQuoteState.creditmemo['adjustment']);
                                     }
                                     if (!isNaN(posQuoteState.creditmemo['shipping_amount']) && parseFloat(posQuoteState.creditmemo['shipping_amount']) > 0) {
                                       creditmemo['shipping_amount'] = parseFloat(posQuoteState.creditmemo['shipping_amount']);
                                     } else {
                                       creditmemo['shipping_amount'] = posQuoteState.creditmemo['shipping_amount'] = 0;
                                     }
                                   }
                                   if (isSave) {
                                     creditmemo['payment_data'] = posQuoteState.quote.getPaymentData();
                                   }
                                   creditmemo['do_offline']   = 0;
                                   creditmemo['comment_text'] = "Retail Refund";
    
                                   data['creditmemo'] = creditmemo;
    
                                   this.notify.info("syncing_creditmemo");
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
                                                if (!isSave) {
                                                  posQuoteState.quote
                                                               .setData('is_exchange', true)
                                                               .setData('retail_note', `Exchange from order #${d['retail_id']}`)
                                                               .setData('reference_number', d['reference_number']);
                                                  return this.refundActions.loadCreditmemoSuccess(d, false);
                                                } else {return this.refundActions.saveCreditmemoSuccess(d['items'][0], false);}
                                              })
                                              .catch((e) => {
                                                return Observable.of(this.refundActions.loadCreditmemoFailed('load_creditmemo_failed', e, false));
                                              });
                                 });
}
