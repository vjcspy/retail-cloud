import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import * as _ from "lodash";

@Component({
             // moduleId: module.id,
             selector: 'retail-dashboard-table-topUser',
             templateUrl: 'retail-dashboard-table-user.html',
             styleUrls: [
               './retail-dashboard-table-user.scss'
             ],
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class RetailDashboardTableUser implements OnInit {
  @Input('data_view') data_view = [];
  
  isSortAsc: boolean;
  
  constructor(protected changeDetector: ChangeDetectorRef) {
    this.isSortAsc = false;
  }
  
  checkDataNullForHidden() {
    if (this.data_view.length == 0) {
      return true;
    } else
      return false;
  }
  
  ngOnInit() {
    this.resoveSoftData();
  };
  
  sortRevenue(): void {
    this.isSortAsc = !this.isSortAsc;
    this.resoveSoftData();
  }
  
  resoveSoftData() {
    let listDataSoft = _.sortBy(this.data_view, [(item) => {
      return parseFloat(item['revenue']);
    }]);
    if (this.isSortAsc) {
      //noinspection TypeScriptUnresolvedFunction
      listDataSoft = _.reverse(listDataSoft);
    }
    this.data_view = listDataSoft;
    this.changeDetector.detectChanges();
  }
  
  sortItem() {
    if (this.isSortAsc === true) {
      return "datatable-sorting-down"
    }
    return "datatable-sorting-up";
  }
}
