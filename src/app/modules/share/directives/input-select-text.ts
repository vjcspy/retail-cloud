import {Directive, ElementRef, Renderer, HostListener} from '@angular/core';
@Directive({selector: '[inputSelectText]'})
export class InputSelectTextDirective {
  constructor(el: ElementRef, renderer: Renderer) {
    // renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'yellow');
  }
  
  @HostListener('focus', ['$event.target'])
  onFocus(target) {
    target.select();
  }
}
