import {Injectable} from '@angular/core';
import {ToastsManager} from "ng2-toastr";
import {TranslateService} from "ng2-translate";

@Injectable()
export class NotifyManager {
  
  constructor(protected toast: ToastsManager,
              protected translate: TranslateService) { }
  
  public success(mess: string, title: string = null, options: Object = null): void {
    this.translate.get(mess).subscribe((_mess) => {
      if (!!title) {
        this.translate.get(title).subscribe((_title) => {
          if (!!options) {
            this.toast.success(_mess, _title, options);
          } else {
            this.toast.success(_mess, _title);
          }
        });
      } else {
        if (!!options) {
          this.toast.success(_mess, null, options);
        } else {
          this.toast.success(_mess);
        }
      }
    });
  }
  
  public warning(mess: string, title: string = null, options: Object = null): void {
    this.translate.get(mess).subscribe((_mess) => {
      if (!!title) {
        this.translate.get(title).subscribe((_title) => {
          if (!!options) {
            this.toast.warning(_mess, _title, options);
          } else {
            this.toast.warning(_mess, _title);
          }
        });
      } else {
        if (!!options) {
          this.toast.warning(_mess, null, options);
        } else {
          this.toast.warning(_mess);
        }
      }
    });
  }
  
  public info(mess: string, title: string = null, options: Object = null): void {
    this.translate.get(mess).subscribe((_mess) => {
      if (!!title) {
        this.translate.get(title).subscribe((_title) => {
          if (!!options) {
            this.toast.info(_mess, _title, options);
          } else {
            this.toast.info(_mess, _title);
          }
        });
      } else {
        if (!!options) {
          this.toast.info(_mess, null, options);
        } else {
          this.toast.info(_mess);
        }
      }
    });
  }
  
  public error(mess: string, title: string = null, options: Object = null): void {
    this.translate.get(mess).subscribe((_mess) => {
      if (!!title) {
        this.translate.get(title).subscribe((_title) => {
          if (!!options) {
            this.toast.error(_mess, _title, Object.assign({
                                                            animate: 'flyLeft',
                                                            positionClass: 'toast-bottom-left',
                                                            showCloseButton: true,
                                                            toastLife: 999999
                                                          }, !!options ? options : {}));
          } else {
            this.toast.error(_mess, _title, {
              animate: 'flyLeft',
              positionClass: 'toast-bottom-left',
              showCloseButton: true,
              toastLife: 999999
            });
          }
        });
      } else {
        if (!!options) {
          this.toast.error(_mess, null, Object.assign({
                                                        animate: 'flyLeft',
                                                        positionClass: 'toast-bottom-left',
                                                        showCloseButton: true,
                                                        toastLife: 999999
                                                      }, !!options ? options : {}));
        } else {
          this.toast.error(_mess, null, {
            animate: 'flyLeft',
            positionClass: 'toast-bottom-left',
            showCloseButton: true,
            toastLife: 999999
          });
        }
      }
    });
  }
}
