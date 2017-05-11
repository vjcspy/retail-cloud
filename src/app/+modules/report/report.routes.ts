import {Routes} from "@angular/router";
import {ContainerComponent} from "../../cloud/cloud-container/container";
import {DashboardPage} from "./pages/dashboard/dashboard";

export const ROUTES: Routes = [
  {
    path: '',
    component: ContainerComponent,
    children: [
      {
        path: '',
        component: DashboardPage
      }
    ]
  },
];
