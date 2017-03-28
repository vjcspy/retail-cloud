new ValidatedMethod({
  name: "api.get_roles",
  validate: function () {
  },
  run: function (data: Object) {
    try{
      const result = HTTP.call("GET", "http://mage2.xds.smartosc.com/xrest/v1/xretail/role");
      return result.data;
    }catch (e){
      return e.data;
    }
  }
});