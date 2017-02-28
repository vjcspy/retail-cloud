import {Component, OnInit} from "@angular/core";
import {RequestService} from "../service/request";
import {ApiService} from "../service/api.service";
import * as $q from "q";
import * as _ from "lodash";
@Component({
               selector: 'x-report-dashboard',
               templateUrl: 'dashboard.report.html',
           })
export class DashboardReportComponent implements OnInit {
    viewData = {};
    _reportType:string;
    _timeRanger:string;

    constructor(protected requestService:RequestService, protected apiService:ApiService) {
        this.getReportTypeData();
        this.loadDashboardReport();
        this.reloadData();
    }

    ngOnInit() {
        // this.initChartJs();
    }

    reloadData() {
        this.viewData = {
            report_type: [],
            revenue: [],
            transaction_count: [],
            customer_count: [],
            gross_profit: [],
            discount: [],
            discount_percent: [],
            cart_value: [],
            cart_size: []
        }
    }

    initChartJs() {
        let revenue_chart     = new Chart(jQuery("#report_chart_revenue"), {
            type: 'horizontalBar',
            data: {
                fill: false,
                label: "revenue",
                labels: this.viewData['report_type'],
                datasets: [{
                    data: this.viewData['revenue'],
                    backgroundColor: "rgba(75,192,192,5)",
                }]
            },
            options: {legend: {display: false}}
        });
        let transaction_count = new Chart(jQuery("#report_chart_transaction_count"), {
            type: 'horizontalBar',
            data: {
                label: "transaction_count",
                labels: this.viewData['report_type'],
                datasets: [{
                    data: this.viewData['transaction_count'],
                    backgroundColor: "rgba(75,192,192,5)",
                }],
            }, options: {legend: {display: false}}
        });
        let customer_count    = new Chart(jQuery("#report_chart_customer_count"), {
            type: 'horizontalBar',
            data: {
                label: "Customer count",
                labels: this.viewData['report_type'],
                datasets: [{
                    data: this.viewData['customer_count'],
                    backgroundColor: "rgba(75,192,192,5)",
                }],
            }, options: {legend: {display: false}}
        });
        let gross_profit      = new Chart(jQuery("#report_chart_gross_profit"), {
            type: 'horizontalBar',
            data: {
                label: "Gross Profit",
                labels: this.viewData['report_type'],
                datasets: [{
                    data: this.viewData['gross_profit'],
                    backgroundColor: "rgba(75,192,192,5)",
                }],
            }, options: {legend: {display: false}}
        });

    }

    initChartTotalJs() {
        let revenue_chart = new Chart(jQuery("#report_chart_revenue_by_time"), {
            type: 'line',
            data: {
                label: "revenue",
                labels: this.viewData['report_type'],
                datasets: [{
                    data: this.viewData['revenue'],
                    backgroundColor: "rgba(75,192,192,5)",
                }]
            },
            options: {legend: {display: false}}
        });
    }

    loadDashboardReport() {
        let deferred = $q.defer();
        this.requestService.makePost(this.apiService.get('dashboard'), {
            report_type: this.getReportTypeData()['value'],
            date_time: "2000-11-01\/2049-11-30"
        }).subscribe(
            (data) => {
                this.reloadData();
                console.log(this.viewData);
                if (_.isObject(data)) {
                    _.forEach(data['items'], (item) => {
                        this.viewData['report_type'].push(item['scope_data']);
                        this.viewData['revenue'].push(item['revenue']);
                        this.viewData['transaction_count'].push(item['transaction_count']);
                        this.viewData['customer_count'].push(item['customer_count']);
                        this.viewData['gross_profit'].push(item['gross_profit']);
                        this.viewData['discount'].push(item['discount_amount']);
                        this.viewData['discount_percent'].push(item['discount_percent']);
                        this.viewData['cart_size'].push(item['total_cart_size']);
                        this.viewData['cart_value'].push(item['total_cart_value']);
                    });
                    deferred.resolve(data);
                    this.initChartJs();
                } else {
                    throw new Error("Some problem occur when load data sales report");
                }
            }
        );
        return deferred.promise;
    }

    getListReportType():Object {
        return {
            data: [
                {id: 1, label: "Outlet", value: "outlet"},
                {id: 2, label: "Magento website", value: "website"},
                {id: 3, label: "Store View", value: "store"},

            ],
            isMultiSelect: false,
            label: "report_type",
            site: "dashboard"
        };
    }


    getReportTypeData() {
        if (this._reportType == null) {
            return this._reportType = this.getListReportType()['data'][0];
        }
        return this._reportType;
    }

    // getListTimeRanger():Object {
    //     return {
    //         data: [
    //             {id: 1, label: "Day", value: "day"},
    //             {id: 2, label: "Week", value: "week"},
    //             {id: 3, label: "Month", value: "month"},
    //         ],
    //         isMultiSelect: false,
    //         label: "time_ranger",
    //         site: "dashboard"
    //     }
    // }

    // getTimeRangerData() {
    //     if (this._timeRanger == null) {
    //         return this._timeRanger = this.getListTimeRanger()['data'][0];
    //     }
    //     return this._reportType;
    // }
    //
    // getListRealTimeRanger():Object {
    //     let timeRanger = this.getTimeRangerData();
    //     let data       = {};
    //     if (timeRanger['value'] == "day") {
    //         data :[
    //
    //         ]
    //     }
    //     return {
    //         data: data,
    //         isMultiSelect: false,
    //         label: "real_time_ranger",
    //         site: "dashboard"
    //     }
    // }
}