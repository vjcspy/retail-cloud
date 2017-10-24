import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";

@Component({
             // moduleId: module.id,
             selector: 'product-list',
             templateUrl: 'list.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class CProductListComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
  
  test() {
    MeteorObservable.call('base.test_method')
                    .subscribe((res) => console.log(res),
                               (err) => console.log(err));
  }
}
