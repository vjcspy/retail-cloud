import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {ReceiptActions} from "./receipt.actions";
import {RootActions} from "../../../../../../R/root.actions";
import {PosStepActions} from "../checkout/step/step.actions";
import {PosGeneralState} from "../../../../R/general/general.state";
import {ReceiptService} from "./receipt.service";

@Injectable()
export class ReceiptEffects {
  
  constructor(private store$: Store<any>, private actions$: Actions, private receiptService: ReceiptService) { }
  
  
  @Effect() printReceipt = this.actions$
                               .ofType(
                                 ReceiptActions.ACTION_PRINT_SALE_RECEIPT,
                                 PosStepActions.ACTION_SAVED_ORDER)
                               .withLatestFrom(this.store$.select('general'))
                               .filter(([action, generalState]) => {
                                 return action.type === PosStepActions.ACTION_SAVED_ORDER ?
                                   !!(generalState as PosGeneralState).register['is_print_receipt'] : true;
                               })
                               .map(() => {
                                 this.receiptService.printReceipt();
                                 
                                 return {type: RootActions.ACTION_NOTHING, payload: {mess: "Just print receipt"}};
                               });
}
