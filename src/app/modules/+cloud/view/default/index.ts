import {SidebarComponent} from "./sidebar.component";
import {HeaderComponent} from "./header.component";
import {CloudSaleReportPage} from "../report/report.component";
import {ReportFilterComponent} from "../report/filter/filter.component";
import {CloudSaleReportTableComponent} from "../report/table-data/report-table.component";
import {CloudSaleReportItemDetailComponent} from "../report/table-data/items/report-item-detail.component";
import {CloudSaleReportDateRangerItemComponent} from "../report/table-data/items/report-item-dateranger.coponent";
import {CloudSaleReportItemComponent} from "../report/table-data/items/report-item.component";
import {DashboardPage} from "../dashboard/dashboard";
import {RetailDashboardChart} from "../dashboard/chart/retail-dashboard-chart";
import {ChartLineTime} from "../dashboard/chart/element/chart-line-time";
import {BarChart} from "../dashboard/chart/element/bar-chart";

export const CLOUD_DEFAULT_COMPONENTS = [
  SidebarComponent,
  HeaderComponent,

  DashboardPage,
  CloudSaleReportPage,
  ReportFilterComponent,
  CloudSaleReportTableComponent,
  CloudSaleReportItemDetailComponent,
  CloudSaleReportDateRangerItemComponent,
  CloudSaleReportItemComponent,

  RetailDashboardChart,
  ChartLineTime,
  BarChart
];
