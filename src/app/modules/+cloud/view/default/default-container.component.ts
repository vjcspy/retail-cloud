import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'default-container-component',
             template: `
               <router-outlet></router-outlet>`,
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class DefaultContainerComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
}
