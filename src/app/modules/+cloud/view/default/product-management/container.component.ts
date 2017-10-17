import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'product-management-container',
             templateUrl: 'container.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class ProductManagementContainerComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
}
