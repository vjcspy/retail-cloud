import {Subscription} from "rxjs";
import * as _ from "lodash";

export abstract class AbstractSubscriptionComponent {
  protected _stream = {};
  protected _subscriptions: {
    [propName: string]: Subscription;
  }                 = {};
  
  ngOnDestroy(): void {
    _.forEach(this._subscriptions, (sub) => sub.unsubscribe());
  }
  
  protected subscribeObservable(name: string, subscriptionFunc: () => Subscription) {
    if (this._subscriptions.hasOwnProperty(name)) {
      this._subscriptions[name].unsubscribe()
    }
    this._subscriptions[name] = subscriptionFunc();
  }
}
