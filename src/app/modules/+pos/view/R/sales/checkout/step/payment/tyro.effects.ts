import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {PosStepActions} from "../step.actions";
import {PosStepState} from "../step.state";
import {TyroService} from "./tyro.service";
import {TyroActions} from "./tyro.actions";
import * as _ from 'lodash';

@Injectable()
export class TyroEffects {
  
  constructor(private store$: Store<any>, private actions: Actions, private tyroService: TyroService) {}
  
  @Effect() processTyro = this.actions
                              .ofType(PosStepActions.ACTION_PROCESS_PAYMENT_3RD)
                              .filter((action: Action) => action.payload['payment3rdData']['type'] === 'tyro')
                              .withLatestFrom(this.store$.select('step'))
                              .map((z) => {
                                const action: Action             = z[0];
                                const posStepState: PosStepState = <any>z[1];
                                const payment                    = posStepState.paymentMethodUsed.find((p) => p.type === action.payload['payment3rdData']['type'])
    
                                // init data for tyro (TID-MID)
                                this.tyroService.initConfig(payment);
    
                                const isRefund = parseFloat(payment.amount + '') < 0;
                                const amount   = this.tyroService.convertAmount(Math.abs(payment.amount) + '');
    
    
                                setTimeout(() => {
                                  if (isRefund) {
                                    this.tyroService.doRefund(amount);
                                  }
                                  else {
                                    this.tyroService.doPurchase(amount);
                                  }
                                }, 100);
    
                                return {type: TyroActions.ACTION_WAIT_STREAM_FROM_TYRO};
                              });
  
  @Effect() selectAnswer = this.actions
                               .ofType(TyroActions.ACTION_SELECT_ANSWER)
                               .map((action: Action) => {
                                 setTimeout(() => {this.tyroService.answerCallback(action.payload['answer'])}, 100);
                                 return {type: TyroActions.ACTION_WAIT_STREAM_FROM_TYRO};
                               });
  
  @Effect() waitStreamFromTyro = this.actions
                                     .ofType(
                                       TyroActions.ACTION_WAIT_STREAM_FROM_TYRO,
                                     )
                                     .switchMap(() => {
                                       return this.tyroService.getTyroObservable()
                                                  .map((res) => {
                                                    if (_.indexOf(['receiptCallback',
                                                                   'questionCallback',
                                                                   'statusMessageCallback'], res['type']) > -1) {
                                                      return {
                                                        type: PosStepActions.ACTION_PAYMENT_3RD_UPDATE_INFO,
                                                        payload: {type: 'tyro', ...res['data']}
                                                      }
                                                    } else if (res  ['type'] === 'transactionCompleteCallback') {
                                                      return {
                                                        type: PosStepActions.ACTION_PAYMENT_3RD_PAY_SUCCESS,
                                                        payload: {type: 'tyro', ...res['data']}
                                                      }
                                                    } else if (res['type'] === 'error') {
                                                      return {
                                                        type: PosStepActions.ACTION_PAYMENT_3RD_PAY_FAIL,
                                                        payload: {type: 'tyro', ...res['data']}
                                                      }
                                                    }
                                                  });
                                     });
  
  @Effect() removeTyro = this.actions.ofType(PosStepActions.ACTION_REMOVE_PAYMENT_METHOD_FROM_ORDER)
                             .filter((action: Action) => action.payload['payment']['type'] === 'tyro')
                             .map(() => {
                               this.tyroService.canel();
                               return {type: TyroActions.ACTION_CANCEL_PAY};
                             })
}
