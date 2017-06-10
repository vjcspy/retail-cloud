import {Directive, ElementRef, Input, Renderer, HostListener} from '@angular/core';

@Directive({selector: '[inputQty]'})
export class InputQtyDirective {
  constructor(el: ElementRef, renderer: Renderer) {
    // renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'yellow');
  }
  
  @HostListener('keyup', ['$event'])
  onKeyup(event) {
    if (event.key != '.' && event.key != "Backspace") {
      let target      = event.target;
      target['value'] = target['value'].replace(/[^0-9.-]/g, '');
      if (isNaN(target['value']))
        target['value'] = 0;
      target['value'] = Math.abs(parseFloat(target['value']));
    }
  }
}
