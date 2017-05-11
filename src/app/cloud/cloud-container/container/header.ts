import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
             selector: 'z-header',
             templateUrl: 'header.html'
           })
export class HeaderComponent implements OnInit {
  constructor(protected router: Router) { }
  
  ngOnInit() { }
  
  protected _signOut() {
  
  }
}
