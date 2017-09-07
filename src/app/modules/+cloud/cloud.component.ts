import {Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'cloud',
             template: `
               <router-outlet></router-outlet>`
           })

export class CloudComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
}
