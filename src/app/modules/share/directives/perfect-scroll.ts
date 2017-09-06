import {AfterViewInit, Directive, ElementRef, EventEmitter, Output, Renderer2} from '@angular/core';
@Directive({selector: '[perfectScroll]'})

export class PerfectScrollDirective implements AfterViewInit {
  @Output() scrollEnd = new EventEmitter();
  
  constructor(private el: ElementRef, protected render: Renderer2) {
  }
  
  ngAfterViewInit(): void {
    if (this.el && this.el.nativeElement.className.indexOf('iz-perfect-scroll') == -1) {
      this.render.addClass(this.el.nativeElement, "iz-perfect-scroll");
      jQuery(this.el.nativeElement)['perfectScrollbar']();
      
      this.render.listen(this.el.nativeElement, 'ps-y-reach-end', (event) => {
        this.scrollEnd.emit(event);
      });
    }
  }
  
  update() {
    jQuery(this.el.nativeElement)['perfectScrollbar']('update');
  }
}
