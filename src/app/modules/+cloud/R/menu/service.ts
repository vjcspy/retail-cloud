import {Injectable} from '@angular/core';
import {AuthenticateService} from "../../../../services/authenticate";
import {List} from "immutable";
import {MenuElemInterface} from "./state";
import {Router} from "@angular/router";

@Injectable()
export class MenuService {
  
  constructor(protected auth: AuthenticateService, protected router: Router) { }
  
  initMenu(): List<MenuElemInterface> {
    let menu: MenuElemInterface[] = [];
    
    if (this.auth.isAdmin(null)) {
      menu.push(...[
        {
          path: '/cloud/default/license/list',
          name: 'License Management',
          iconClass: 'ion-social-buffer',
        },
        {
          path: '/cloud/default/product/list',
          name: 'Product Management',
          iconClass: 'ion-social-buffer',
        },
      ]);
    }
    
    if (this.auth.isUser(null)) {
      menu.push(...[
        {
          path: '/cloud/default/c-product/list',
          name: 'Connect Products',
          iconClass: 'ion-social-buffer',
        },
      ]);
    }
    
    if (this.auth.userCan('access_to_user_management') || this.auth.userCan('view_edit_create_delete_role') || this.auth.isAdmin(null)) {
      let _user: MenuElemInterface = {
        path: '',
        name: 'User management',
        iconClass: 'ion-android-options',
        children: []
      };
      
      if (this.auth.userCan('access_to_user_management') || this.auth.isAdmin(null)) {
        _user.children.push({
                              name: 'Users',
                              path: '/cloud/default/user-management/cashier/list',
                            });
      }
      
      if (this.auth.userCan('view_edit_create_delete_role')) {
        _user.children.push({
                              name: 'Shop Roles',
                              path: '/cloud/user-management/roles',
                            });
      }
      
      menu.push(_user);
    }
    
    let _accounts: MenuElemInterface = {
      path: '',
      name: 'Account',
      iconClass: 'ion-person',
      children: []
    };
    
    if (this.auth.isShopOwner(null)) {
      _accounts.children.push({
                                name: 'License',
                                path: '/cloud/default/account/license/list',
                              });
      _accounts.children.push({
                                name: 'Payment method',
                                path: '/cloud/default/account/license/list',
                              });
      _accounts.children.push({
                                name: 'Invoices History',
                                path: '/cloud/default/account/license/list',
                              });
    }
    
    _accounts.children.push({
                              name: 'Account Information',
                              path: '/cloud/default/account/license/list',
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
                      name: 'Connect POS'
                    },
                    {
                      path: '',
                      name: 'Report'
                    }
                  ]
                });
    }
    
    return List.of(...menu);
  }
}
