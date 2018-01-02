import {
  ChangeDetectionStrategy, Component, Input, SimpleChange, SimpleChanges, AfterViewInit, OnInit,
  ChangeDetectorRef
} from '@angular/core';
import {AccountState} from "../../../../R/account/account.state";
import {AccountActions} from "../../../../R/account/account.actions";
import {AppStorage} from "../../../../services/storage";
import {NotifyManager} from "../../../../services/notify-manager";
import {LocalStorage} from "ngx-webstorage";
import * as _ from 'lodash';
import {SaleReportService} from "../../R/report/service";
import {AbstractRxComponent} from "../../../share/core/AbstractRxComponent";
import {DashboardReportService} from "../../R/dashboard/service";

@Component({
             // moduleId: module.id,
             selector: 'header-component',
             templateUrl: 'header.component.html',
             // changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class HeaderComponent extends AbstractRxComponent implements OnInit, AfterViewInit {
  @Input() accountState: AccountState;
  
  @LocalStorage('baseUrl')
  public baseUrl: string;
  
  constructor(public accountActions: AccountActions, protected storage: AppStorage, private notify: NotifyManager , public salesReportService : SaleReportService ,protected changeDetector: ChangeDetectorRef , public dashboardReportService : DashboardReportService) {
    super()
  }
  
  
  ngOnInit() {

    this._subscription['update_view']  =  this.salesReportService.updateOverLoadSteam().subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }
  
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (!this.baseUrl || this.baseUrl === "") {
  //     _.forEach(changes, (change: SimpleChange, key) => {
  //       if (key === 'accountState') {
  //         const currentState: AccountState = change.currentValue;
  //         if (currentState.urls.count() > 0) {
  //           const first = currentState.urls.find((v) => _.isString(v['url']) && v['url'] !== "");
  //           if (first) {
  //             this.selectWebsite(first['url']);
  //           }
  //         }
  //       }
  //     });
  //   }
  // }
  
  ngAfterViewInit(): void {
    if (_.isString(this.baseUrl) && this.baseUrl !== "") {
      this.accountActions.changeUrl(this.baseUrl);
    }
  }
  
  selectWebsite($event) {
    if (_.isString($event) && $event !== 'null' && this.baseUrl !== $event) {
      this.baseUrl = $event;
      this.accountActions.changeUrl(this.baseUrl);
      this.salesReportService.getChangeBaseUrlStream().next();
      this.dashboardReportService.getChangeBaseUrlStream().next();
    }
  }
  
  hasWebsite() {
    return this.accountState.urls.count() > 0;
  }
}
