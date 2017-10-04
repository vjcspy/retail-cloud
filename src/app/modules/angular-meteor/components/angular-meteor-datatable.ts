import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  ViewEncapsulation
} from '@angular/core';
import {
  Observable,
  Subject
} from "rxjs";
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
  protected data = {
    openFilter: false
  };
  
  @Input('collectionObservable') private collectionObservable: Observable<MongoObservable.Collection<any>>;
  @Input('tableConfig') private tableConfig: any;
  @Input('defaultCollectionSelector') private defaultCollectionSelector = {}; // Default selector for collection
  
  @ViewChild('dataTable') dataTable: ElementRef;
  
  meteorDataTable: MeteorDataTable;
  protected callBackSubject: Subject<any> = new Subject(); // call back from data table
  
  constructor() {
    super();
  }
  
  ngOnInit() {
    this._initTable();
  }
  
  private _initTable() {
    jQuery(this.dataTable.nativeElement).find('thead th').each(() => {
      let title = $(this).text();
      $(this).html('<input type="text" placeholder="Search ' + title + '" />');
    });
    this.meteorDataTable =
      new MeteorDataTable(jQuery(this.dataTable.nativeElement), this.tableConfig, this.collectionObservable, this.callBackSubject, this.defaultCollectionSelector);
    
    this.subscribeObservable('dataTable', () => this.meteorDataTable.getMeteorDtTableSubscription());
    this.subscribeObservable('click_remove_button', () => this.callBackSubject
                                                              .asObservable()
                                                              .filter(x => x['event'] === "clickRemove")
                                                              .subscribe(data => {
                                                                if (data['data']) {
                                                                  this.data['removeId'] = data['data'];
                                                                  jQuery('#meteor-dt-remove-modal')['modal']('show');
                                                                }
                                                              }));
    
  }
  
  newRecord() {
    this.callBackSubject.next({event: "newRecord"});
  }
  
  removeRecord() {
    this.callBackSubject.next({event: "removeRecord", data: this.data['removeId']});
  }
  
  getCallBackObservable(): Observable<any> {
    return this.callBackSubject.asObservable().share();
  }
}
