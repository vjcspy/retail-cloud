import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {AngularMeteorDataTableComponent} from "../../../../code/angular/components/angular-meteor-datatable";
import * as _ from "lodash";
import {Router} from "@angular/router";
import {PriceCollection} from "../../../services/ddp/collections/prices";
import {ManagePricingsService} from "./manage-pricings.service";

@Component({
             selector   : 'manage-products-grid',
             templateUrl: 'grid.html'
           })
export class ManagePricingsGridComponent implements OnInit {
  @ViewChild(AngularMeteorDataTableComponent) protected angularMeteorDtTable: AngularMeteorDataTableComponent;
  
  protected tableConfig = {
    actionsColumn: {edit: true, remove: true},
    columns      : [
      {data: "name", title: "Name"},
      {data: "versions", title: "Versions"},
    ],
    columnDefs   : [
      {className: "hidden-xs", targets: [1]},
      {className: "text-center", targets  : [2]}
    ],
    bFilter      : false,
  };
  
  constructor(protected manageProductService: ManagePricingsService,
              protected pricingsCollection: PriceCollection,
              protected router: Router) {
    this.manageProductService.viewState.headerText = "Grid";
  }
  
  ngOnInit(): void {
    this.angularMeteorDtTable.getCallBackObservable().subscribe((data) => {
      if (data.event == "clickEdit") {
        this.router.navigateByUrl('cloud/pricings/' + data.data);
      }
      if (data.event == 'newRecord') {
        this.router.navigate(['/cloud/pricings/create']);
      }
    });
  }
}
