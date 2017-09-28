import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
             //moduleId: module.id,
             selector: 'account',
             templateUrl: 'account.component.html',
             styleUrls: ['css/signin.scss'],
             changeDetection: ChangeDetectionStrategy.OnPush,
             encapsulation: ViewEncapsulation.None,
           })
export class AccountComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
  
}
