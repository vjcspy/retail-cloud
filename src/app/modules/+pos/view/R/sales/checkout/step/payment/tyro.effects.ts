import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {PosStepActions} from "../step.actions";
import {PosStepState} from "../step.state";
import {TyroService} from "./tyro.service";
import {TyroActions} from "./tyro.actions";
import * as _ from 'lodash';
import {TyroPayment} from "../../../../../../services/payment-integrate/tyro";
import {EntityActions} from "../../../../../../R/entities/entity/entity.actions";
import {PosEntitiesActions} from "../../../../../../R/entities/entities.actions";
import {PaymentDB} from "../../../../../../database/xretail/db/payment";
import {List} from "immutable";
import {PosEntitiesState} from "../../../../../../R/entities/entities.state";

@Injectable()
export class TyroEffects {
  
  constructor(private store$: Store<any>, private actions: Actions, private tyroService: TyroService, private tyroPayment: TyroPayment) {}
  
  @Effect() initTestGateway = this.actions
                                  .ofType(
                                    EntityActions.ACTION_PUSH_MANY_ENTITY,
                                    PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS
                                  )
                                  .filter((action: Action) => !!action.payload['entityCode'] && action.payload['entityCode'] === PaymentDB.getCode())
                                  .withLatestFrom(this.store$.select('entities'))
                                  .map((z: any) => {
                                    const action: Action = z[0];
                                    let payments: List<PaymentDB>;
                                    if (action.type === EntityActions.ACTION_PUSH_MANY_ENTITY) {
                                      payments = action.payload['items'];
                                    } else {
                                      payments = (z[1] as PosEntitiesState)[PaymentDB.getCode()].items;
                                    }
                                    const tyro = payments.find((_p) => _p['type'] === 'tyro');
                                    if (tyro) {
                                      const paymentData = tyro['payment_data'];
                                      if (paymentData && paymentData['gateway']) {
                                        if (paymentData['gateway'] === 'iclientsimulator') {
                                          window['tyro_gateway'] = "https://iclientsimulator.test.tyro.com/";
                                        } else if (paymentData['gateway'] === 'iclient') {
                                          window['tyro_gateway'] = "https://iclient.test.tyro.com/";
                                        }
                                        console.log('set ok');
                                      }
                                    }
    
                                    return {type: TyroActions.ACTION_SET_TYRO_GATEWAY};
                                  });
  
  @Effect() initTyroConfig = this.actions
                                 .ofType(
                                   PosStepActions.ACTION_ADD_PAYMENT_METHOD_TO_ORDER
                                 )
                                 .filter((action: Action) => action.payload['payment']['type'] === 'tyro')
                                 .map((action: Action) => {
    
                                   // init data for tyro (TID-MID)
                                   this.tyroPayment.initConfig(action.payload['payment']);
    
                                   return {type: TyroActions.ACTION_INITED_TYRO_CONFIG};
                                 });
  
  @Effect() processTyro = this.actions
                              .ofType(PosStepActions.ACTION_PROCESS_PAYMENT_3RD)
                              .filter((action: Action) => action.payload['payment3rdData']['type'] === 'tyro')
                              .withLatestFrom(this.store$.select('step'))
                              .map((z) => {
                                const action: Action             = z[0];
                                const posStepState: PosStepState = <any>z[1];
                                const payment                    = posStepState.paymentMethodUsed.find((p) => p.type === action.payload['payment3rdData']['type']);
    
                                const isRefund = parseFloat(payment.amount + '') < 0;
                                const amount   = this.tyroService.convertAmount(Math.abs(payment.amount) + '');
    
                                setTimeout(() => {
                                  if (isRefund) {
                                    this.tyroService.doRefund(amount);
                                  } else {
                                    this.tyroService.doPurchase(amount);
                                  }
                                }, 100);
    
                                return {type: TyroActions.ACTION_WAIT_STREAM_FROM_TYRO};
                              });
  
  @Effect() selectAnswer = this.actions
                               .ofType(TyroActions.ACTION_SELECT_ANSWER)
                               .map((action: Action) => {
                                 setTimeout(() => {this.tyroService.answerCallback(action.payload['answer']);}, 100);
                                 return {type: TyroActions.ACTION_WAIT_STREAM_FROM_TYRO};
                               });
  
  @Effect() waitStreamFromTyro = this.actions
                                     .ofType(
                                       TyroActions.ACTION_WAIT_STREAM_FROM_TYRO,
                                     )
                                     .switchMap(() => {
                                       return this.tyroService.getTyroObservable()
                                                  .map((res) => {
                                                    console.log(res);
                                                    if (_.indexOf(['receiptCallback',
                                                                   'questionCallback',
                                                                   'statusMessageCallback'], res['type']) > -1) {
                                                      return {
                                                        type: PosStepActions.ACTION_PAYMENT_3RD_UPDATE_INFO,
                                                        payload: {type: 'tyro', ...res['data']}
                                                      };
                                                    } else if (res  ['type'] === 'transactionCompleteCallback') {
                                                      return {
                                                        type: PosStepActions.ACTION_PAYMENT_3RD_PAY_SUCCESS,
                                                        payload: {type: 'tyro', ...res['data']}
                                                      };
                                                    } else if (res['type'] === 'error') {
                                                      return {
                                                        type: PosStepActions.ACTION_PAYMENT_3RD_PAY_FAIL,
                                                        payload: {type: 'tyro', ...res['data']}
                                                      };
                                                    }
                                                  });
                                     });
  
  @Effect() removeTyro = this.actions.ofType(PosStepActions.ACTION_REMOVE_PAYMENT_METHOD_FROM_ORDER)
                             .filter((action: Action) => action.payload['payment']['type'] === 'tyro')
                             .map(() => {
                               this.tyroService.canel();
                               return {type: TyroActions.ACTION_CANCEL_PAY};
                             });
}
