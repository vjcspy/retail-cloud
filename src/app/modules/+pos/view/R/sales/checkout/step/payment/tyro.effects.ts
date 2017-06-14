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
                              .switchMap((z) => {
                                const action: Action             = z[0];
                                const posStepState: PosStepState = <any>z[1];
                                const payment                    = posStepState.paymentMethodUsed.find((p) => p.type === action.payload['payment3rdData']['type'])
    
                                // init data for tyro (TID-MID)
                                this.tyroService.initConfig(payment);
    
                                const isRefund = parseFloat(payment.amount + '') < 0;
                                const amount   = this.tyroService.convertAmount(Math.abs(payment.amount) + '');
    
    
                                if (isRefund) {
                                  this.tyroService.doRefund(amount);
                                }
                                else {
                                  this.tyroService.doPurchase(amount);
                                }
    
                                return this.tyroService.getTyroObservable()
                                           .map((res) => {
                                             if (_.indexOf(['receiptCallback', 'questionCallback', 'statusMessageCallback'], res['type']) > -1) {
                                               return {
                                                 type: PosStepActions.ACTION_PAYMENT_3RD_UPDATE_INFO,
                                                 payload: {type: 'tyro', additionData: res['data']}
                                               }
                                             } else if (res['type'] === 'transactionCompleteCallback') {
                                               return {
                                                 type: PosStepActions.ACTION_PAYMENT_3RD_PAY_SUCCESS,
                                                 payload: {type: 'tyro', additionData: res['data']}
                                               }
                                             } else if (res['type'] === 'error') {
                                               return {
                                                 type: PosStepActions.ACTION_PAYMENT_3RD_PAY_FAIL,
                                                 payload: {type: 'tyro', additionData: res['data']}
                                               }
                                             }
                                           });
                              });
  
  @Effect() selectAnswer = this.actions.ofType(TyroActions.ACTION_SELECT_ANSWER)
                               .switchMap((action) => {
                                 this.tyroService.answerCallback(action.payload['answer']);
                                 return this.tyroService.getTyroObservable()
                                            .map((res) => {
                                              if (_.indexOf(['receiptCallback', 'questionCallback', 'statusMessageCallback'], res['type']) > -1) {
                                                return {
                                                  type: PosStepActions.ACTION_PAYMENT_3RD_UPDATE_INFO,
                                                  payload: {type: 'tyro', additionData: res['data']}
                                                }
                                              } else if (res  ['type'] === 'transactionCompleteCallback') {
                                                return {
                                                  type: PosStepActions.ACTION_PAYMENT_3RD_PAY_SUCCESS,
                                                  payload: {type: 'tyro', additionData: res['data']}
                                                }
                                              } else if (res['type'] === 'error') {
                                                return {
                                                  type: PosStepActions.ACTION_PAYMENT_3RD_PAY_FAIL,
                                                  payload: {type: 'tyro', additionData: res['data']}
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
