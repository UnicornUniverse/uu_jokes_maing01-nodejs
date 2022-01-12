/* eslint-disable */

const preferenceDeleteDtoInType = shape({
  mtMainBaseUri: uri().isRequired(),
  code: string(/^\w{3,96}$/).isRequired(),
  scope: oneOf(["vendor", "app", "subApp", "uuAppWorkspace"]).isRequired(),
});

const preferenceLoadFirstDtoInType = shape({
  mtMainBaseUri: uri().isRequired(),
  codeList: array(string(), 5).isRequired(),
});

const preferenceCreateOrUpdateDtoInType = shape({
  mtMainBaseUri: uri().isRequired(),
  code: string(/^\w{3,96}$/).isRequired(),
  scope: oneOf(["vendor", "app", "subApp", "uuAppWorkspace"]),
  data: shape({}, true, 1000),
});
