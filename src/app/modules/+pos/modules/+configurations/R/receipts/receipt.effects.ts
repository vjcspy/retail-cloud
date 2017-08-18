import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {PosEntitiesActions} from "../../../../R/entities/entities.actions";
import {Router} from "@angular/router";
import {PosEntitiesState} from "../../../../R/entities/entities.state";
import {ConfigurationsReceiptActions} from "./receipt.actions";
import {ConfigurationsReceiptService} from "./receipt.service";
import {ReceiptDB} from "../../../../database/xretail/db/receipt";
import {Observable} from "rxjs/Observable";
import {NotifyManager} from "../../../../../../services/notify-manager";
import {EntityActions} from "../../../../R/entities/entity/entity.actions";
import * as _ from 'lodash';

@Injectable()
export class ConfigurationsReceiptEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private router: Router,
              private configurationsReceiptActions: ConfigurationsReceiptActions,
              private configurationsReceiptService: ConfigurationsReceiptService,
              private notify: NotifyManager,
              private entityActions: EntityActions) { }
  
  @Effect() checkLoadedDependency = this.actions$
                                        .ofType(
                                          PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS
                                        )
                                        .filter(() => this.router.isActive('pos/configurations/default/pos', false))
                                        .withLatestFrom(this.store$.select('entities'))
                                        .map((z) => {
                                          const entitiesState: PosEntitiesState = <any>z[1];
    
                                          let loaded = false;
                                          if (entitiesState.receipts.isFinished === true) {
                                            loaded = true;
                                          }
    
                                          return this.configurationsReceiptActions.loadedDependency(loaded, false);
                                        });
  
  @Effect() saveReceipt = this.actions$
                              .ofType(
                                ConfigurationsReceiptActions.ACTION_SAVE_RECEIPT
                              )
                              .withLatestFrom(this.store$.select('general'))
                              .switchMap((z) => {
                                const action: Action = z[0];
                                let receiptData      = action.payload['receipt'];
    
                                return this.configurationsReceiptService.createRequestSaveReceipt(receiptData, <any>z[1])
                                           .filter((data) => data.hasOwnProperty('items') && _.size(data['items']) === 1)
                                           .switchMap((data) => {
                                             let receipt = new ReceiptDB();
                                             receipt.addData(data['items'][0]);
                                             return Observable.fromPromise(receipt.save(data['items'][0]))
                                                              .switchMap(() => {
                                                                this.notify.success("receipt_setting_updated");
                                                                return Observable.from([
                                                                                         this.configurationsReceiptActions.saveReceiptSuccess(receipt, false),
                                                                                         this.entityActions.pushEntity(receipt, ReceiptDB.getCode(), 'id', false)
                                                                                       ]);
                                                              })
                                                              .catch((e) => Observable.of(this.configurationsReceiptActions.saveReceiptFail('can_not_save_receipt', e, false)));
                                           })
                                           .catch((e) => Observable.of(this.configurationsReceiptActions.saveReceiptFail('can_not_save_receipt_from_sv', e, false)));
                              });
  
  @Effect() removeLicenseWhenSelect = this.actions$
                                          .ofType(ConfigurationsReceiptActions.ACTION_SELECT_RECEIPT)
                                          .map(() => {
                                            setTimeout(() => {
                                              jQuery("a:contains('Unlicensed Froala Editor')").remove();
                                            }, 250);
    
                                            return this.configurationsReceiptActions.removedLicenseEditor(false);
                                          });
}
