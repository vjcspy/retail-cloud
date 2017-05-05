import {Routes} from '@angular/router';

import {DataResolver} from './app.resolver';
import {NoContentComponent} from "./modules/no-content/no-content.component";
import {HomeComponent} from "./modules/home/home.component";

export const ROUTES: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'test', loadChildren: './modules/+test#DetailModule'},
  {path: '**', component: NoContentComponent},
];
