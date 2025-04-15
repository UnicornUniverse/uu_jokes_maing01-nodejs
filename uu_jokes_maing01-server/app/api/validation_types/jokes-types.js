/* eslint-disable */
const jokesInitDtoInType = shape({
  uuAppProfileAuthorities: uri().isRequired("uuBtLocationUri"),
  uuBtLocationUri: uri().isRequired("uuAppProfileAuthorities"),
  name: uu5String(1000).isRequired(),
  state: oneOf(["active", "underConstruction"]),
  desc: uu5String(5000),
});

const jokesPlugInBtDtoInType = shape({
  uuBtLocationUri: uri().isRequired(),
});

const jokesUpdateDtoInType = shape({
  name: uu5String(1000).isNotNull(),
  desc: uu5String(5000),
});

const jokesSetStateDtoInType = shape({
  state: oneOf(["active", "underConstruction", "closed"]),
});

const jokesMigrateDtoInType = shape({});
