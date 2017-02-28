import {Component , OnInit} from "@angular/core";
@Component({
               selector: 'x-report-dashboard',
               templateUrl: 'dashboard.report.html',
           })
export class DashboardReportComponent implements OnInit {
    constructor() { }

    ngOnInit() {
        this.initPageJs();
    }

    initPageJs() {
        jQuery(() => {
            // Init page helpers (Slick Slider plugin)
            if (typeof OneUI != "undefined")
                OneUI.initHelpers('slick');
        });
    }
}