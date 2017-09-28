import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'cloud-component',
             template: `
               <router-outlet></router-outlet>`,
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class CloudComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
}
