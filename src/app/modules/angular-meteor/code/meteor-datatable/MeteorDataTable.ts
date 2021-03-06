import {MongoObservable} from "meteor-rxjs";
import {Observable, Subscription, Subject} from "rxjs";
import * as _ from "lodash";
import {EventEmitter} from "@angular/core";

export class MeteorDataTable {
  protected collection: MongoObservable.Collection<any>;
  protected _dtTable: any;
  protected _meteorDataTableSubscription: Subscription;
  
  constructor(protected elementSelector: any,
              protected dataTableOptions: Object,
              protected collectionObservable: Observable<MongoObservable.Collection<any>>,
              protected callBackSubject: EventEmitter<any>,
              protected collectionSelector = {}) {
    if (this.collectionObservable) {
      this._meteorDataTableSubscription = this.collectionObservable.subscribe((collection) => {
        this.collection = collection;
        this.resolve();
      });
    }
  }
  
  protected resolve() {
    if (typeof this._dtTable !== "undefined") {
      this._dtTable.draw();
      this.callBackSubject.next({type: "reDraw"});
    } else {
      this.initDataTable();
      let vm = this;
      setTimeout(() => {
        this.elementSelector.on('click', '.meteor-table-bt-edit', function () {
          vm.callBackSubject.emit({type: 'CLICK_EDIT', data: jQuery(this).attr('data-id')});
        });
      }, 100);
      setTimeout(() => {
        this.elementSelector.on('click', '.meteor-table-bt-remove', function () {
          vm.callBackSubject.emit({type: 'CLICK_REMOVE', data: jQuery(this).attr('data-id')});
        });
      }, 100);
    }
  }
  
  private initDataTable() {
    let options;
    if (_.isObject(this.dataTableOptions)) {
      options = Object.assign(this.getDefaultOption(), this.dataTableOptions);
    } else {
      options = this.getDefaultOption();
    }
    // add Column action
    if (options.hasOwnProperty('actionsColumn')) {
      let _numOfColumn = _.size(options.columns);
      options.columns.push({data: "_id", title: "Actions"});
      
      if (!options.hasOwnProperty('columnDefs')) {
        options['columnDefs'] = [];
      }
      options['columnDefs'].push({
                                   className: "action",
                                   orderable: false,
                                   // The `data` parameter refers to the data for the cell (defined by the
                                   // `data` option, which defaults to the column being worked with, in
                                   // this case `data: 0`.
                                   render(data, type, row) {
                                     let _html = `<div class="btn-group">`;
                                     if (options['actionsColumn']['edit'] === true) {
                                       _html += `<a class="link-action meteor-table-bt-edit" data-id="${data}">Edit </a>`;
                                     }
                                     if (options['actionsColumn']['remove'] === true) {
                                       _html += ` <a class="meteor-table-bt-remove link-action" data-toggle="modal" data-id="${data}">Delete</a>`;
                                     }
                                     _html += `</div>`;
          
                                     return _html;
          
                                   },
                                   targets: [_numOfColumn]
                                 });
    }
    this._dtTable = this.elementSelector.DataTable(options);
  }
  
  private getDefaultOption() {
    return {
      ajax: (request, drawCallback, settings) => {
        let json      = {};
        // searching
        let _selector = {};
        _.forEach(request['columns'], (v, index) => {
          if (v['searchable'] === true && !!v['search']['value']) {
            this.collectionSelector[v['data']] = new RegExp(v['search']['value']);
          }
        });
        // sort
        let options = {};
        if (_.size(request['order']) === 1) {
          let _columnName = request['columns'][request['order'][0]['column']]['data'];
          if (_columnName) {
            options['sort']              = {};
            options['sort'][_columnName] = request['order'][0]['dir'] === 'asc' ? 1 : -1;
          }
        }
        _selector = _.merge(_selector, this.collectionSelector);
        
        // output data
        json['recordsTotal']    = this.collection.collection.find(_selector).count();
        json['recordsFiltered'] = this.collection.collection.find(_selector).count();
        json['draw']            = request.draw; // Update the echo for each response
        
        options['skip']  = request['start'];
        options['limit'] = request['length'];
        
        json['data'] = this.collection.collection.find(_selector, options).fetch();
        drawCallback(json);
      },
      processing: true,
      serverSide: true,
      // scrollX       : true,
      paging: true,
      scrollCollapse: true,
      responsive: true,
      bSort: false,
      bFilter: true
    };
  }
  
  getMeteorDtTableSubscription(): Subscription {
    return this._meteorDataTableSubscription;
  }
  
}
