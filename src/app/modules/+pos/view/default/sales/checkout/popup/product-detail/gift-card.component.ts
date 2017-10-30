import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'gift-card-component',
             templateUrl: 'gift-card.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class PosDefaultSalesCheckoutPopupProductDetailGiftCardComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
}
