import {Injectable} from '@angular/core';
import {AuthenticateService} from "../../../../services/authenticate";
import {MenuElemInterface} from "./state";
import {Router} from "@angular/router";

@Injectable()
export class MenuService {
  
  constructor(protected auth: AuthenticateService, protected router: Router) { }
  
  initMenu(): MenuElemInterface[] {
    let menu: MenuElemInterface[] = [];
    
    if (this.auth.isAdmin(null)) {
      menu.push(...[
        {
          path: '/cloud/default/license/list',
          name: 'License Management',
          iconClass: 'ion-social-buffer',
          priority: 1,
        },
        {
          path: '/cloud/default/product/list',
          name: 'Product Management',
          iconClass: 'ion-ios-briefcase',
          priority: 2,
        },
        {
          path: '/cloud/default/pricing/list',
          name: 'Pricing Management',
          iconClass: 'ion-ios-pricetags-outline',
          priority: 2,
        },
      ]);
    }
    
    if (this.auth.isUser(null)) {
      menu.push(...[
        {
          path: '/cloud/default/c-product/list',
          name: 'Connect Products',
          iconClass: 'ion-social-buffer',
          priority: 3,
        },
      ]);
    }
    
    if (this.auth.userCan('access_to_user_management') || this.auth.userCan('view_edit_create_delete_role') || this.auth.isAdmin(null)) {
      let _user: MenuElemInterface = {
        path: '',
        name: 'User management',
        iconClass: 'ion-android-options',
        children: [],
        priority: 4,
      };
      
      if (this.auth.userCan('access_to_user_management') || this.auth.isAdmin(null)) {
        _user.children.push({
                              name: 'Users',
                              path: '/cloud/default/user-management/cashier/list',
                              priority: 4.1,
                            });
      }
      
      if (this.auth.userCan('view_edit_create_delete_role')) {
        _user.children.push({
                              name: 'Shop Roles',
                              path: '/cloud/user-management/roles',
                              priority: 4.2,
                            });
      }
      
      menu.push(_user);
    }
    
    let _accounts: MenuElemInterface = {
      path: '',
      name: 'Account',
      iconClass: 'ion-person',
      children: [],
      priority: 6,
    };
    
    if (this.auth.isShopOwner(null)) {
      _accounts.children.push({
                                name: 'License',
                                path: '/cloud/default/account/license/list',
                                priority: 6.1,
                              });
      _accounts.children.push({
                                name: 'Payment method',
                                path: '/cloud/default/account/license/list',
                                priority: 6.2,
                              });
    }
    
    _accounts.children.push({
                              name: 'Account Information',
                              path: '/cloud/default/account/license/list',
                              priority: 6.4,
                            });
    
    menu.push(_accounts);
    
    if (this.auth.isUser(null)) {
      menu.push({
                  path: '',
                  name: 'Documentation',
                  iconClass: 'ion-android-list',
                  children: [
                    {
                      path: '',
                      name: 'Connect POS',
                      priority: 7.1,
                    },
                    {
                      path: '',
                      name: 'Report',
                      priority: 7.2,
                    }
                  ],
                  priority: 7,
                });
    }
    
    return menu;
  }
}
