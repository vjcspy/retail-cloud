import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'c-product-container',
             template: `<router-outlet></router-outlet>`,
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class CProductContainerComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
}
