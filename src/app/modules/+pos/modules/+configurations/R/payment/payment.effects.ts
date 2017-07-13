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

@Injectable()
export class ConfigurationsPaymentEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private configurationsPaymentService: ConfigurationsPaymentService,
              private configurationsPaymentActions: ConfigurationsPaymentActions,
              private entityActions: EntityActions,
              private notify: NotifyManager,
              private router: Router) { }
  
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
