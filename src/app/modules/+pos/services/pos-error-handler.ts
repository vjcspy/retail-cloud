import {ErrorHandler, Injectable} from "@angular/core";
import {NotifyManager} from "../../../services/notify-manager";
import {AppService} from "../../../app.service";
import {GeneralException} from "../core/framework/General/Exception/GeneralException";

@Injectable()
export class PosErrorHandler extends ErrorHandler {
  
  constructor() {
    super(false);
  }
  
  handleError(error: any): void {
    // delegate to the default handler
    if (error instanceof GeneralException) {
      const notify = AppService.$Injector.get(NotifyManager);
      if (notify) {
        notify.error(error.getMessage());
        notify.info('Please manually F5 if app not responding');
      }
    } else {
      super.handleError(error);
    }
  }
}
