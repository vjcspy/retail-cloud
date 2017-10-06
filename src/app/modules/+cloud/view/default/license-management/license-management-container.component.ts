import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'license-management-container',
             templateUrl: 'license-management-container.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class LicenseManagementContainer implements OnInit {
  constructor() { }
  
  ngOnInit() { }
}
