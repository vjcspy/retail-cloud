import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {AccountState} from "../../../R/account/account.state";
import {Observable} from "rxjs/Observable";

@Component({
             // moduleId: module.id,
             selector: 'default-container-component',
             templateUrl: 'default-container.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class DefaultContainerComponent implements OnInit {
  accountState$: Observable<AccountState>;
  
  constructor(protected store$: Store<any>) {
    this.accountState$ = this.store$.select('account');
  }
  
  ngOnInit() { }
}
