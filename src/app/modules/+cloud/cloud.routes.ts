import {Routes} from "@angular/router";
import {DefaultContainerComponent} from "./view/default/default-container.component";
import {CloudComponent} from "./cloud.component";

export const CLOUD_ROUTES: Routes = [
  {
    path: '',
    component: CloudComponent,
    children: [
      {
        path: 'default',
        component: DefaultContainerComponent,
      }
    ]
  }
];
