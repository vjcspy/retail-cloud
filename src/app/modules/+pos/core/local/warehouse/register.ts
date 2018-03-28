import {ProviderInterface} from "../../framework/General/ProviderInterface";

export class RegisterBmsWarehouse implements ProviderInterface {
  boot() {
    this.registerObserver();
  }

  registerObserver(): void {
  }
}
