import {ComponentRef, Injectable} from '@angular/core';

@Injectable()
export class DialogInfoData {
  isOpening: boolean = false;
  title: string      = null;
  content: string    = null;
  componentElem: ComponentRef<any>;
  
  constructor() { }
  
  infoOK() {
    this.isOpening = false;
    if (this.componentElem) {
      this.componentElem.destroy();
    }
  }
}
