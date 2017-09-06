import {Directive, HostListener} from "@angular/core";

@Directive({selector: '[enterBlur]'})
export class EnterBlurDirective {
  constructor() {
  }
  
  @HostListener('keyup', ['$event'])
  onKeyup($event) {
    if ($event['code'] === 'Enter') {
      $event.target.blur();
    }
  }
}
