import {Injectable} from '@angular/core';

@Injectable()
export class PermissionService {
  
  constructor() { }
  
  userCan(permission: string) {
    return true;
  }
}
