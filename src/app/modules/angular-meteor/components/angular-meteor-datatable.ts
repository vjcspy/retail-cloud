import {Component, OnInit, Input, ViewChild, ElementRef, ViewEncapsulation, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {Observable,} from "rxjs";
import {MongoObservable} from "meteor-rxjs";
import {AbstractSubscriptionComponent} from "../../../code/AbstractSubscriptionComponent";
import {MeteorDataTable} from "../code/meteor-datatable/MeteorDataTable";
import * as _ from 'lodash';

@Component({
             encapsulation: ViewEncapsulation.None,
             selector: 'angular-meteor-datatable',
             templateUrl: 'angular-meteor-datatable.html',
             styleUrls: ['angular-meteor-datatable.scss'],
             changeDetection: ChangeDetectionStrategy.OnPush,
           })
export class AngularMeteorDataTableComponent extends AbstractSubscriptionComponent implements OnInit {
  public data = {
    filterPopupState: false
  };
  
  @Input('collectionObservable') private collectionObservable: Observable<MongoObservable.Collection<any>>;
  @Input('tableConfig') private tableConfig: any;
  @Input('defaultCollectionSelector') private defaultCollectionSelector = {}; // Default selector for collection
  
  @ViewChild('dataTable') protected dataTable: ElementRef;
  
  protected meteorDataTable: MeteorDataTable;
  
  @Output() event = new EventEmitter();
  
  constructor() {
    super();
  }
  
  ngOnInit() {
    this._initTable();
  }
  
  private _initTable() {
    this.meteorDataTable =
      new MeteorDataTable(jQuery(this.dataTable.nativeElement), this.tableConfig, this.collectionObservable, this.event, this.defaultCollectionSelector);
    
    this.subscribeObservable('dataTable', () => this.meteorDataTable.getMeteorDtTableSubscription());
    this.subscribeObservable('show_modal_when_click_remove_button',
                             () => this.event
                                       .asObservable()
                                       .filter(x => x['type'] === "CLICK_REMOVE")
                                       .subscribe(data => {
                                         if (data['data']) {
                                           this.data['removeId'] = data['data'];
                                           jQuery('#meteor-dt-remove-modal')['modal']('show');
                                         }
                                       }));
    
  }
  
  newRecord() {
    this.event.emit({type: "NEW_RECORD"});
  }
  
  removeRecord() {
    this.event.emit({type: "APPROVE_REMOVE_RECORD", data: this.data['removeId']});
  }
  
  protected filterComponents;
  
  getFilterComponentData() {
    if (typeof this.filterComponents === 'undefined') {
      this.filterComponents = [];
      if (_.isArray(this.tableConfig['columnDefs'])) {
        const columnData      = this.tableConfig['columns'];
        this.filterComponents = _.reduce(this.tableConfig['columnDefs'], (results, columnDef: Object) => {
          if (columnDef.hasOwnProperty('izFilter')) {
            const filter = columnDef['izFilter'];
            _.forEach(columnDef['targets'], (columnIndex) => {
              const column  = columnData[columnIndex];
              const existed = _.find(results, (f) => f['data'] === column['data']);
              if (!existed) {
                if (!filter.hasOwnProperty('value')) {
                  filter['value'] = null;
                }
                results.push(Object.assign({}, {...filter}, {data: column['data']}));
              }
            });
          }
          
          return results;
        }, []);
      }
    }
    
    return this.filterComponents;
  }
  
  angularMeteorFilterData() {
    this.event.emit({type: "START_FILTER", data: [...this.filterComponents]});
  }
}
