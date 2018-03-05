import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {Router} from "@angular/router";
import {ConfigurationsPaymentService} from "./payment.service";
import {ConfigurationsPaymentActions} from "./payment.actions";
import * as _ from 'lodash';
import {PaymentDB} from "../../../../database/xretail/db/payment";
import {Observable} from "rxjs/Observable";
import {EntityActions} from "../../../../R/entities/entity/entity.actions";
import {NotifyManager} from "../../../../../../services/notify-manager";
import {PosEntitiesActions} from "../../../../R/entities/entities.actions";
import {PosEntitiesState} from "../../../../R/entities/entities.state";
import {RetailConfigActions} from "../retail-config/retail-config.actions";
import * as _ from 'lodash';

@Injectable()
export class ConfigurationsPaymentEffects {

  constructor(private store$: Store<any>,
              private actions$: Actions,
              private configurationsPaymentService: ConfigurationsPaymentService,
              private configurationsPaymentActions: ConfigurationsPaymentActions,
              private entityActions: EntityActions,
              private notify: NotifyManager,
              private retailConfigActions: RetailConfigActions,
              private router: Router) {
  }

  @Effect() takeSnapshotPayment = this.actions$
                                      .ofType(
                                        PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS,
                                        EntityActions.ACTION_PUSH_MANY_ENTITY
                                      )
                                      .filter(() => this.router.isActive('pos/configurations/default/pos', false))
                                      .filter((action) => action.payload.hasOwnProperty('entityCode') ?
                                        action.payload['entityCode'] === PaymentDB.getCode() : true)
                                      .withLatestFrom(this.store$.select('entities'))
                                      .switchMap((z) => {
                                        const entitiesState: PosEntitiesState = <any>z[1];
                                        let payment                           = false;
                                        if (entitiesState.payment.isFinished === true) {
                                          payment                                           = true;
                                          this.configurationsPaymentService.paymentSnapshot = <any>entitiesState.payment.items
                                                                                                                .filter((v) => _.indexOf(['gift_card', 'reward_point', 'pay_pal'], v['type']) < 0);

                                        }

                                        return Observable.from([this.retailConfigActions.isLoadedDepend({payment}, false)]);
                                      });

  @Effect() savePayment = this.actions$
                              .ofType(
                                ConfigurationsPaymentActions.ACTION_SAVE_PAYMENT
                              )
                              .withLatestFrom(this.store$.select('general'))
                              .switchMap((z) => {
                                const action = z[0];
                                return this.configurationsPaymentService.createSavePaymentRequest(action.payload['payments'], <any>z[1])
                                           .filter((data) => data.hasOwnProperty('items') && !_.isEmpty(data['items']))
                                           .map((data) => {
                                             return data['items'];
                                           })
                                           .switchMap((items) => {
                                             let payment = new PaymentDB();
                                             this.notify.success("save_payment_successfully");
                                             return Observable.fromPromise(payment.savPayments(items))
                                                              .switchMap(() => Observable.from([
                                                                this.configurationsPaymentActions.savePaymentSuccess(items, false),
                                                                this.entityActions.pushManyEntity(items, PaymentDB.getCode(), 'id', false)
                                                              ]))
                                                              .catch((e) => Observable.of(this.configurationsPaymentActions.savePaymentFailed('save_payment_failed', e, false)));
                                           })
                                           .catch((e) => Observable.of(this.configurationsPaymentActions.savePaymentFailed('save_payment_failed_from_sv', e, false)));
                              });
}
