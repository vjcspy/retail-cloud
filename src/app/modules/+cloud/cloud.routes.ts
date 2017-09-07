import {Routes} from "@angular/router";
import {CloudComponent} from "./cloud.component";
import {CloudDefaultContainerComponent} from "./views/default/container.component";

export const CLOUD_ROUTES: Routes = [
  {
    path: '',
    component: CloudComponent,
    children: [
      {
        path: 'default',
        component: CloudDefaultContainerComponent
      }
    ],
  },
];
