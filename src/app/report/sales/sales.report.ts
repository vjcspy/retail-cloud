import {Component, OnInit, Input} from "@angular/core";
import {RequestService} from "../service/request";
import * as $q from "q";
import * as _ from "lodash";
import {ApiService} from "../service/api.service";
@Component({
               selector: 'x-report-sales',
               templateUrl: 'sales.report.html'
           })
export class SalesReportComponent {

    viewData = {};
    @Input('typeReport') _typeReport:any;
    @Input('measure') _measure:any;

    constructor(protected requestService:RequestService, protected apiService:ApiService) {
        this.refreshData();
        this.ngOnInitDataTable();
        this.getTypeReport();
        this.getMeasure();
    }

    refreshData() {
        this.viewData = {
            data: [],
            recordsTotal: "",
            recordsFiltered: "",
            draw: "",
            typeReport: "",
            measure: ""
        }
    }

    getListReportType():Object {
        return {
            data: [
                {id: 1, label: "Sales Report", value: "sales_summary"},
                {id: 2, label: "Outlet", value: "outlet"},
                {id: 3, label: "Register", value: "register"},
                {id: 4, label: "Customer email", value: "customer"},
                {id: 5, label: "Customer group", value: "customer_group"},
                {id: 6, label: "Magento website", value: "magento_website"},
                {id: 8, label: "Product", value: "product"},
                {id: 9, label: "Category", value: "category"},
            ],
            isMultiSelect: false,
            label: "report_type"
        };
    }

    getListMeasure():Object {
        return {
            "data": [
                {id: 1, label: "Cart size", value: "cart_size"},
                {id: 2, label: "Cart value", value: "cart_value"},
                {id: 3, label: "Cart value(incl tax) ", value: "cart_value_incl_tax"},
                {id: 4, label: "Customer count ", value: "customer_count"},
                {id: 5, label: "Discount value", value: "discount_amount"},
                {id: 6, label: "Discount percent ", value: "discount_percent"},
                {id: 7, label: "First sale", value: "first_sale"},
                {id: 8, label: "Item sold", value: "item_sold"},
                {id: 9, label: "Last sale", value: "last_sale"},
                {id: 10, label: "Order count", value: "order_count"},
                {id: 11, label: "Return percent", value: "refund_percent"},
                {id: 12, label: "Return count", value: "refund_order_count"},
                {id: 13, label: "Transaction count", value: "transaction_count"},
            ],
            "isMultiSelect": false,
            "label": "measure"
        };
    }


    getViewData() {
        return this.viewData;
    }


    // loadSalesReport() {
    //     let deferred = $q.defer();
    //     this.requestService.makePost(this.apiService.get('salesreport'), {
    //         report_type: this.getTypeReport()['value'],
    //         measure: this.getMeasure()['value'],
    //     }).subscribe(
    //         (data)=> {
    //             if (_.isObject(data)) {
    //                 this.refreshData();
    //                 let _id = 1;
    //                 _.forEach(data['data'], (item) => {
    //                     item['id'] = ++_id;
    //                     this.viewData['data'].push(item);
    //                 });
    //                 this.viewData['recordsTotal'] = this.viewData['recordsFiltered'] = data['records_total'];
    //                 this.viewData['draw']       = this.viewData['draw'];
    //                 this.viewData['reportType'] = this._typeReport['label'];
    //                 if (this._measure['label']) {
    //                     this.viewData['measure'] = this._measure['label'];
    //                 }
    //                 deferred.resolve(data);
    //             } else {
    //                 throw new Error("Some problem occur when load data sales report");
    //             }
    //         });
    //     return deferred.promise;
    // }

    getTypeReport() {
        if (this._typeReport == null) {
            return this._typeReport = this.getListReportType()['data'][0];
        }
        return this._typeReport;
    }

    getMeasure() {
        if (this._measure == null) {
            return this._measure = {id: 0, label: "", value: ""};
        }
        return this._measure;
    }


    ngOnInit():void {
        this.ngOnInitDataTable();
        // console.log(table.dataTable().fnSettings().aoColumns.length);
    }

    ngOnInitDataTable():void {
        let table = jQuery('#reportDatatable');
        if (table) {
            table.dataTable({
                                "processing": true,
                                scrollCollapse: true,
                                "paging": true,
                                "serverSide": true,
                                "ajax": {
                                    "type": 'POST',
                                    "url": this.apiService.get('salesreport'),
                                    // "report_type": this.getTypeReport()['value'],
                                    // "measure": this.getMeasure()['value'],
                                },
                                // "columnDefs": [
                                //     {className : "" , "targets" : [0]},
                                //     {}
                                // ],
                                "columns": [
                                    {"data": "data_selected"},
                                    // { "items": "_measure['value']" },
                                    {"data": "revenue"},
                                    {"data": "total_cost"},
                                    {"data": "gross_profit"},
                                    {"data": "margin"},
                                    {"data": "tax"},
                                    {"data": "total_sales"}
                                ]
                            });
        }
        table.dataTable().api();
    }
}