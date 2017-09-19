import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {ReceiptActions} from "./receipt.actions";
import {RootActions} from "../../../../../../R/root.actions";
import {ReceiptService} from "./receipt.service";
import {ReceiptState} from "./receipt.state";
import {NotifyManager} from "../../../../../../services/notify-manager";
import {Observable} from "rxjs";

@Injectable()
export class ReceiptEffects {
  
  constructor(private store$: Store<any>, private actions$: Actions, private receiptService: ReceiptService, private receiptActions: ReceiptActions, private notify: NotifyManager) { }
  
  @Effect() printReceipt = this.actions$
                               .ofType(
                                 ReceiptActions.ACTION_PRINT_SALE_RECEIPT,
                                 ReceiptActions.ACTION_SEND_RECEIPT_EMAIL
                               )
                               .map(() => {
                                 this.receiptService.printReceipt();
    
                                 return {type: RootActions.ACTION_NOTHING, payload: {mess: "Just print receipt"}};
                               });
  
  @Effect() sendEmailData = this.actions$.ofType(ReceiptActions.ACTION_RESOLVED_RECEIPT_EMAIL)
                                .withLatestFrom(this.store$.select('receipt'))
                                .withLatestFrom(this.store$.select('general'), (z, z1) => [...z, z1])
                                .switchMap((z) => {
                                  const receiptState: ReceiptState = <any>z[1];
                                  return this.receiptService.sendEmailReceipt(receiptState.salesReceipt.emailReceipt.template,
                                                                              receiptState.salesReceipt.emailReceipt.email,
                                                                              receiptState.salesReceipt.emailReceipt.name,
                                                                              receiptState.salesReceipt.orderOffline,
                                                                              receiptState.salesReceipt.settingReceipt,
                                                                              <any>z[2])
                                             .map(() => {
                                               this.notify.success("send_email_success");
                                               return this.receiptActions.sentReceiptEmail(false);
                                             })
                                             .catch((e) => {
                                               return Observable.of(this.receiptActions.sendReceiptEmailFailed(e, false));
                                             });
                                });
}
