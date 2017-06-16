import {Directive, ElementRef, EventEmitter, HostListener, Output} from "@angular/core";

@Directive({selector: '[clickOutSide]'})
export class ClickOutSideDirective {
  @Output() outside = new EventEmitter();
  
  constructor(private el: ElementRef) {
  }
  
  @HostListener('document:click', ['$event.target'])
  onClick(target) {
    if (this.el && !this.el.nativeElement.contains(target)) {
      this.outside.emit(false);
    }
  }
}
