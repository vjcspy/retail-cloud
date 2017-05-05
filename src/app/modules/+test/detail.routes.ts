import {DetailComponent} from './detail.component';

export const routes = [
  {
    path: '', children: [
    {path: '', component: DetailComponent},
    {path: 'child-test', loadChildren: './+child-test#ChildDetailModule'}
  ]
  },
];
