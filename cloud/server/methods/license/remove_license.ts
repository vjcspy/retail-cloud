import {Product} from "../../models/Product";
import * as $q from "q";
import {OM} from "../../code/General/ObjectManager";
import {User} from "../../models/User";
import {Role} from "../../models/Role";
import * as _ from "lodash";
import {License} from "../../models/License";

new ValidatedMethod({
  name: "license.remove_license",
  validate: function () {
    const user = OM.create<User>(User).loadById(this.userId);
    if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES], Role.GROUP_CLOUD)) {
    } else {
      throw new Meteor.Error("license.remove_license_error", "Access denied");
    }
  },
  run: function (data: string) {
    let defer = $q.defer();
    const license = OM.create<License>(License).loadById(data);
    if(!license){
      throw new Meteor.Error("license.error_remove", "License Not Found");
    }
    license.remove().then(() => defer.resolve(), (err) => defer.reject(err));
    return defer.promise;
  }
});