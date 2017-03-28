import * as _ from "underscore";
new ValidatedMethod({
  name: "api.update_xretail_permission",
  validate: function () {
  },
  run: function (data: any) {
    try{
      const result = HTTP.call("POST", "http://mage2.xds.smartosc.com/xrest/v1/xretail/permission",
                               {params: data});
      return true;
    }catch (e){
      return e.data;
    }
  }
});