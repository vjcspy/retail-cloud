import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from "@angular/core";

@Directive({selector: '[clickOutSide]'})
export class ClickOutSideDirective {
  @Output() outside  = new EventEmitter();
  @Input() clickOutSide;
  @Input() checkType = 1;
  
  constructor(private el: ElementRef) {
  }
  
  @HostListener('document:click', ['$event.target'])
  onClick(target) {
    if (this.clickOutSide === true) {
      if (this.checkType === 1) {
        if (this.el && !this.el.nativeElement.contains(target)) {
          this.outside.emit(false);
        }
      }
      
      if (this.checkType === 2) {
        if (!!target && target.className && target.className.indexOf('popup-overlay') > -1) {
          this.outside.emit(false);
        }
      }
    }
  }
}
