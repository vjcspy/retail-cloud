import {Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'cloud-default-container',
             template: `
               <router-outlet></router-outlet>`
           })

export class CloudDefaultContainerComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
}
