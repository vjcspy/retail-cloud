import {Directive, ElementRef, Input, Renderer, HostListener} from '@angular/core';
@Directive({selector: '[inputNumber]'})
export class InputNumberDirective {
    constructor(el: ElementRef, renderer: Renderer) {
        // renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'yellow');
    }
    
    @Input('isDecimal') isDecimal: string;

    @HostListener('keyup', ['$event.target'])
    onKeyup(target) {
        if (this.isDecimal != '1') {
            target['value'] = target['value'].replace(/[^0-9.-]/g, '');
            if (isNaN(target['value']))
                target['value'] = 0;
            target['value'] = Math.abs(parseFloat(target['value']));
        }
    }
}
