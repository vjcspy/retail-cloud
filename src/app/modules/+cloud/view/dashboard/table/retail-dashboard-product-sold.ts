import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {ReportDashboardHelper} from "../../../R/dashboard/helper";
import * as _ from "lodash";

@Component({
             // moduleId: module.id,
             selector: 'retail-dashboard-table-product-trend',
             templateUrl: 'retail-dashboard-product-sold.html',
             styleUrls: [
               './retail-dashboard-product-sold.scss'
             ],
           })

export class RetailDashBoardTableProductSold {
  public sort_desc: boolean = true;
  public sort_measure: string = 'revenue';
  @Input('data_view') viewData  = [];
  
  constructor(protected changeDetector: ChangeDetectorRef) {}
  
  getListMeasure() {
    return ReportDashboardHelper.getListMeasureProductSold();
  }
  
  sortAmount(measure) {
    if (measure == 'revenue') {
      this.changeDetector.detectChanges();
      this.sort_measure             = measure;
      this.sort_desc                = !this.sort_desc;
      this.viewData['product_sold'] = _.reverse(this.viewData['product_sold']);
    }
  }
  
  getDataProductSold() {
    return this.viewData['product_sold'];
  }
}
