import {SidebarComponent} from "./sidebar.component";
import {HeaderComponent} from "./header.component";
import {CloudSaleReportPage} from "../report/report.component";
import {ReportFilterComponent} from "../report/filter/filter.component";
import {CloudSaleReportTableComponent} from "../report/table-data/report-table.component";
import {CloudSaleReportItemDetailComponent} from "../report/table-data/items/report-item-detail.component";
import {CloudSaleReportDateRangerItemComponent} from "../report/table-data/items/report-item-dateranger.coponent";
import {CloudSaleReportItemComponent} from "../report/table-data/items/report-item.component";

export const CLOUD_DEFAULT_COMPONENTS = [
  SidebarComponent,
  HeaderComponent,

  CloudSaleReportPage,
  ReportFilterComponent,
  CloudSaleReportTableComponent,
  CloudSaleReportItemDetailComponent,
  CloudSaleReportDateRangerItemComponent,
  CloudSaleReportItemComponent
];
