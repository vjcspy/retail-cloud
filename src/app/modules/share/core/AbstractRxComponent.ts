import {Subscription} from "rxjs";
import * as _ from "lodash";
import {OnDestroy} from "@angular/core";

export abstract class AbstractRxComponent implements OnDestroy {
  protected _subscription: {
    [propName: string]: Subscription;
  } = {};
  
  ngOnDestroy(): void {
    _.forEach(this._subscription, (sub: Subscription) => sub.unsubscribe());
  }
}
