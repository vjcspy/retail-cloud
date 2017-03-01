import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {ManageLicensesService} from "./manage-licenses.service";
import {LicenseCollection} from '../../../services/ddp/collections/licenses';
import {AngularMeteorDataTableComponent} from "../../../../code/angular/components/angular-meteor-datatable";
import * as _ from "lodash";

@Component({
             selector   : 'manage-licenses-grid',
             templateUrl: 'grid.html'
           })
export class ManageLicensesGridComponent implements OnInit {
  @ViewChild(AngularMeteorDataTableComponent) protected angularMeteorDtTable: AngularMeteorDataTableComponent;
  
  protected tableConfig = {
    actionsColumn: {edit: true, remove: true},
    columns      : [
      {data: "_id", title: "License ID"},
      {data: "key", title: "License Key"},
      {data: "has_product", title: "Products"},
      {data: "status", title: "Status"}
    ],
    columnDefs   : [
      {className: "", "targets": [0]},
      {className: "", orderable: false, "targets": [1]},
      {
        className: "", orderable: false,
        "targets": [2],
        render   : function (data, type, row) {
          let _html = "";
          if (_.isArray(data)) {
            _.forEach(data, product => {
              _html += `<span class="label label-warning">${product['product_id']}</span>&nbsp;`;
            });
          }
          return _html;
        }
      },
      {className: "text-center", orderable: false, "targets": [3]}
    ],
    bFilter      : false,
  };
  
  constructor(protected manageLicensesService: ManageLicensesService,
              protected licensesCollection: LicenseCollection) {
    this.manageLicensesService.viewState.headerText = "Grid";
  }
  
  ngOnInit(): void {
    this.angularMeteorDtTable.getCallBackObservable().subscribe((data) => (console.log(data)));
  }
  
}
