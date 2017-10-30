import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SaleReportService} from "../../../../R/report/service";

@Component({
             selector: '[sale-report-item]',
             templateUrl: 'report-item.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class CloudSaleReportItemComponent {
  @Input('list_date') list_date       = [];
  @Input('data_filter') data_filter = [];
  @Input('measures') measures = [];
  @Input('item') item                 = [];
  @Input('is_date_ranger') is_date_ranger ;
  @Input('additionData') additionData = [];
  @Input('typeDisplay') typeDisplay ;
  @Input('colspanTotal') colspanTotal ;
  @Input('is_item_has_detail_data') canViewDetail: boolean;
  @Input('detail_item_value') detail_item_value: boolean;
  
  constructor(protected service: SaleReportService, protected route: ActivatedRoute) {
  }
  
  getFullnameUserReport(userId) {
    //     let userReport     = _.find(this.route.snapshot.data['users'], (row) => row['_id'] == userId);
    //     if (userReport)
    //         if (userReport['profile']['first_name'] || userReport['profile']['first_name'])
    //           return (userReport['profile']['first_name'] + userReport['profile']['last_name']);
    //         else
    //           return userReport['username'];
    //     else
    return userId;
  }
  
  protected isDateRanger() {
    if (this.data_filter['dateTimeState'] == "compare" ) {
      return false;
    }
    return true;
  }
  
  protected selectMoreInfo(is_total:boolean = false) {
    if (this.service.viewData['list_item_detail'].length == 0 || this.item['value'] != this.detail_item_value ) {
      if(is_total){
        this.service.getMoreItemData('total');
      }else{
        this.service.getMoreItemData(this.item['value']);
      }
    } else {
      this.service.viewDataFilter['display_item_detail'] = !this.service.viewDataFilter['display_item_detail'];
    }
  }
  
  protected getColspanForItem(value) {
    return (value == 'name') ? 3 : 1;
  }
  
  isDisplayItemDetail(addition) {
    if (addition == 'name'){
      return true;
    }
    return false;
  }
  
  customizeChevron() {
    if (this.service.viewDataFilter['display_item_detail'] && this.item['value'] == this.detail_item_value) {
      return false;
    }
    return true;
  }
}
