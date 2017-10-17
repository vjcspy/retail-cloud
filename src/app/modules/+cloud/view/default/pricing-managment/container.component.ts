import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'pricing-management-container',
             templateUrl: 'container.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class PricingManagementContainerComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
}
