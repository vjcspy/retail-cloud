import * as _ from "underscore";
new ValidatedMethod({
  name: "api.get_permissions_role",
  validate: function () {
  },
  run: function (role_id: number) {
    try{
      const result = HTTP.call("GET", "http://mage2.xds.smartosc.com/xrest/v1/xretail/permission",
                               {params: {role_id: role_id}});
      let data = _.groupBy(result.data.items, (permission) => {
        return permission['group'];
      });
      return data;
    }catch (e){
      return e.data;
    }
  }
});