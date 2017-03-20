import {OM} from "../../code/General/ObjectManager";
import {User} from "../../models/User";
import {Role} from "../../models/Role";

new ValidatedMethod({
  name: "user.remove_user",
  validate: function () {
    const user = OM.create<User>(User).loadById(this.userId);
    if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN], Role.GROUP_CLOUD)) {
    } else {
      throw new Meteor.Error("user.remove_user_error", "Access denied");
    }
  },
  run: function (data: string) {
    const user = Meteor.users.findOne({_id: data});
    if(!user){
      throw new Meteor.Error("user.error_remove", "User Not Found");
    }
    Meteor.users.remove({_id: data}, (err, res) => {
      if (err){
        throw new Meteor.Error('user.remove_user_error', 'Remove Error');
      }
    });
  }
});