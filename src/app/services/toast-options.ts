import {Injectable} from '@angular/core';
import {ToastOptions} from "ng2-toastr";

@Injectable()
export class CustomToastOptions extends ToastOptions {
  animate: 'flyLeft';
  positionClass: 'toast-bottom-left';
  showCloseButton: true;
  toastLife: 5500;
  newestOnTop = false;
}
