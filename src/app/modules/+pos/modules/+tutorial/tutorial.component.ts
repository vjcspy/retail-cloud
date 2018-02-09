import {Component, OnInit} from '@angular/core';
import {TutorialService} from "./tutorial.service";
/**
 * @public
 */
@Component({
             selector: 'tutorial',
             template: ''
           })
export class TourComponent implements OnInit {
  constructor(protected tourService: TutorialService) {
  
  }
  
  ngOnInit() {
    this.tourService.initStepTour();
  }
}
