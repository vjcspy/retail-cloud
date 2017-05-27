import {Component, OnInit} from '@angular/core';
import {SlimLoadingBarService} from "ng2-slim-loading-bar";
import {ProgressBarService} from "../../../share/provider/progess-bar";

@Component({
             // moduleId: module.id,
             selector: 'pos-checkout',
             templateUrl: 'checkout.component.html'
           })
export class PosCheckoutComponent implements OnInit {
  constructor(private progressBar: ProgressBarService) {}
  
  ngOnInit(): void {
    this.progressBar.start();
    setInterval(() => this.progressBar.randomIncrements(), 1000);
  }
}
