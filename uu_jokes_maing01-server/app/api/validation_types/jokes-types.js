/* eslint-disable */
const jokesInitDtoInType = shape({
  uuAppProfileAuthorities: uri().isRequired("uuBtLocationUri"),
  uuBtLocationUri: uri().isRequired("uuAppProfileAuthorities"),
  state: oneOf(["active", "underConstruction", "closed"]),
  name: uu5String(4000),
});

const jokesPlugInBtDtoInType = shape({
  uuBtLocationUri: uri().isRequired(),
});

const jokesUpdateDtoInType = shape({
  name: uu5String(4000),
});

const jokesSetStateDtoInType = shape({
  state: oneOf(["active", "underConstruction", "closed"]),
});

const jokesMigrateDtoInType = shape({});
