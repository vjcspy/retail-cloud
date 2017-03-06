import {Product} from "../../models/Product";
import * as $q from "q";
import {OM} from "../../code/General/ObjectManager";
import {User} from "../../models/User";
import {Role} from "../../models/Role";
import * as _ from "lodash";
import {ProductVersion} from "../../models/ProductInterface";
import {License} from "../../models/License";

new ValidatedMethod({
  name: "license.add_product_to_license",
  validate: function () {
    const user = OM.create<User>(User).loadById(this.userId);
    if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES], Role.GROUP_CLOUD)) {
    } else {
      throw new Meteor.Error("license.add_product_to_license_error", "Access denied");
    }
  },
  run: function (data: Object) {
    let defer = $q.defer();
    const license = OM.create<License>(License).loadById(data['_id']);
    if(!license){
      throw new Meteor.Error("license.add_product.error", "License Not Found");
    }
    _.forEach(license._data, function(value, key){
      if(key != "_id" && key != "has_product"){
        license.unsetData(key);
      }
    });
    license._data.has_product.push(data['has_product']);
    license.setData("has_product", license._data.has_product);
    license.save().then(() => defer.resolve(), (err) => defer.reject(err));
    return defer.promise;
  }
});