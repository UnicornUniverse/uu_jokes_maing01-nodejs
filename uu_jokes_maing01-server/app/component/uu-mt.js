const UuT = require("./uu-t");

class UuMt extends UuT {
  constructor(uuMtUri, session) {
    super(uuMtUri, session);
    this.uuMtUri = this.uuTUri;
  }

  UUMT_APP_CODE = "uu-myterritory-maing01";

  UUMT = {
    USER_PREFERENCE_PROPERTY: {
      CREATEORUPDATE: "userPreferenceProperty/createOrUpdate",
      DELETE: "userPreferenceProperty/delete",
      LOADFIRST: "userPreferenceProperty/loadFirst",
    },
  };
}

module.exports = UuMt;
