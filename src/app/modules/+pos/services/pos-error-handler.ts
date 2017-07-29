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
    console.log('here');
    const notify = AppService.$Injector.get(NotifyManager);
    if (error instanceof GeneralException) {
      if (notify) {
        notify.error(error.getMessage());
        notify.info('Please manually F5 if app not responding');
      }
    } else {
      notify.error('app_has_crashed,please_manually_refresh_if_app_not_responding');
      super.handleError(error);
    }
  }
}
