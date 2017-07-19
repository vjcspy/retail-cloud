import {ApplicationRef, ComponentFactoryResolver, Injectable, NgZone} from '@angular/core';
import {ToastOptions, ToastsManager} from "ng2-toastr";

@Injectable()
export class CustomToastOptions extends ToastsManager {
  constructor(componentFactoryResolver: ComponentFactoryResolver, ngZone: NgZone, appRef: ApplicationRef, options: ToastOptions) {
    super(componentFactoryResolver, ngZone, appRef, Object.assign(options, {
      positionClass: "toast-top-center",
      toastLife: 3456,
      animate: 'fade',
      // dismiss: 'click',
      tapToDismiss: true,
      showCloseButton: true,
    }));
  }
}
