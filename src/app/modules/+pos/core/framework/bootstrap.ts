import * as _ from "lodash";
import {RegisterDiscount} from "../local/discount/register";
import {ProviderInterface} from "./General/ProviderInterface";
import {EventContainer} from "./General/Event/EventContainer";
import {RegisterAwGiftcard} from "../local/aw-giftcard/register";

export class Bootstrap {
  static PROVIDERS: ProviderInterface[] = [
    new RegisterDiscount(),
    new RegisterAwGiftcard(),
  ];
  
  static run(): void {
    // Fresh event listener
    EventContainer.fresh();
    
    _.forEach(Bootstrap.PROVIDERS, (provider: ProviderInterface) => {
      provider.boot();
    });
  }
}
