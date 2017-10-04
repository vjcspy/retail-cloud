import {Component, OnInit, Input, ViewChild, ElementRef, ViewEncapsulation, Output, EventEmitter} from '@angular/core';
import {Observable,} from "rxjs";
import {MongoObservable} from "meteor-rxjs";
import {AbstractSubscriptionComponent} from "../../../code/AbstractSubscriptionComponent";
import {MeteorDataTable} from "../code/meteor-datatable/MeteorDataTable";

@Component({
             encapsulation: ViewEncapsulation.None,
             selector: 'angular-meteor-datatable',
             templateUrl: 'angular-meteor-datatable.html',
             styleUrls: ['angular-meteor-datatable.scss']
           })
export class AngularMeteorDataTableComponent extends AbstractSubscriptionComponent implements OnInit {
  public data = {};
  
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
    this.subscribeObservable('click_remove_button', () => this.event
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
}
