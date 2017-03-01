import {Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {RequestService} from "../service/request";
import {ApiService} from "../service/api.service";
import * as $q from "q";
import * as _ from "lodash";
import * as moment from  "moment";

@Component({
               selector: 'x-report-dashboard',
               templateUrl: 'dashboard.report.html',
           })
export class DashboardReportComponent implements OnInit {
    viewData          = {};
    viewDataLineChart = {};
    _reportType:string;
    _dateTimeOption:string;
    _dataTimeSelect:string;
    @ViewChild('dateSelectFrom') dateSelectFrom:ElementRef;

    constructor(protected requestService:RequestService, protected apiService:ApiService) {
        this.initDateTimeRangerJs();
        this.getReportTypeData();
        this.getDateTimeOptionData();
        this.loadDashboardReport();
        this.reloadData();
    }

    ngOnInit() {
        this.initDateTimeRangerJs();
    }


    reloadData() {
        this.viewData          = {
            report_type: [],
            revenue: [],
            transaction_count: [],
            customer_count: [],
            gross_profit: [],
            discount: [],
            discount_percent: [],
            cart_value: [],
            cart_size: []
        };
        this.viewDataLineChart = {
            report_type: [],
            revenue: []
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
        let revenue_chart_time = new Chart(jQuery("#report_chart_revenue_by_time"), {
            type: 'line',
            data: {
                label: "revenue",
                labels: this.viewDataLineChart['report_type'],
                datasets: [{
                    data: this.viewDataLineChart['revenue'],
                    backgroundColor: "rgba(75,192,192,5)",
                }]
            },
            options: {legend: {display: false}}
        });
    }

    initDateTimeRangerJs(){
        if (this.dateSelectFrom)
            jQuery(this.dateSelectFrom.nativeElement)['daterangepicker']({
                                                                             // "timePicker": false,
                                                                             "autoUpdateInput": true,
                                                                             // "opens": "center",
                                                                             // "startDate": moment(),
                                                                             // locale: {
                                                                             //     format: 'DD MM YYYY'
                                                                             // },
                                                                             ranges: {
                                                                                 'Today': [moment(), moment()],
                                                                                 'This Week': [moment().startOf('week'), moment().endOf('week')],
                                                                                 'Last Week': [moment().subtract(1, 'week').startOf('week'),
                                                                                               moment().subtract(1, 'week').endOf('week')],
                                                                                 'This Month': [moment().startOf('month'), moment().endOf('month')],
                                                                                 'Last Month': [moment().subtract(1, 'month').startOf('month'),
                                                                                                moment().subtract(1, 'month').endOf('month')]
                                                                             }
                                                                         }, (start, end, label) => {
                if (label == "Today") {
                    this._dateTimeOption = this.getListDateTimeOption()['data'][0];
                } else if (label == "This Week" || label == "Last Week") {
                    this._dateTimeOption = this.getListDateTimeOption()['data'][1];
                } else if (label == "This Month" || label == "Last Month") {
                    this._dateTimeOption = this.getListDateTimeOption()['data'][2];
                }
                this._dataTimeSelect = start.format('YYYY-MM-DD')+"\/"+moment(end,"x").format("YYYY-MM-DD") ;
            });
    }

    loadDashboardReport() {
        let deferred = $q.defer();
        this.requestService.makePost(this.apiService.get('dashboard'), {
            report_type: this.getReportTypeData()['value'],
            date_time: this._dataTimeSelect
        }).subscribe(
            (data) => {
                this.reloadData();
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

                    // if (this._timeRanger['value'] == "day") {
                    //     this.viewDataLineChart['report_type'] = [moment().subtract(6, 'days').format('DD MMMM'),
                    //                                              moment().subtract(5, 'days').format('DD MMMM'),
                    //                                              moment().subtract(4, 'days').format('DD MMMM'),
                    //                                              moment().subtract(3, 'days').format('DD MMMM'),
                    //                                              moment().subtract(2, 'days').format('DD MMMM'),
                    //                                              moment().subtract(1, 'days').format('DD MMMM'),
                    //                                              moment().format('DD MMMM')];
                    // } else if (this._timeRanger['value'] == "week") {
                    //
                    // } else if (this._timeRanger['value'] == "month") {
                    // }


                    _.forEach(data['data_value'], (itemTotal) => {
                        this.viewDataLineChart['report_type'].push(moment(itemTotal['scope_data'], "YYYY-MM-DD").format('DD MMMM'));
                        this.viewDataLineChart['revenue'].push(itemTotal['revenue']);

                    });
                    deferred.resolve(data);
                    this.initChartJs();
                    this.initChartTotalJs();
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

    getListDateTimeOption():Object {
        return {
            data: [
                {id: 1, label: "Day", value: "day"},
                {id: 2, label: "Week", value: "week"},
                {id: 3, label: "Month", value: "month"},
            ],
            isMultiSelect: false,
            label: "time_ranger",
            site: "dashboard"
        }
    }

    getDateTimeOptionData() {
        if (this._dateTimeOption == null) {
            return this._dateTimeOption = this.getListDateTimeOption()['data'][0];
        }
        return this._dateTimeOption;
    }

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