import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'user-management-container',
             templateUrl: 'user-management-container.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class UserManagementContainerComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
}
