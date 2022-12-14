/* eslint-disable */
const jokeCreateDtoInType = shape({
  name: uu5String(1, 255).isRequired(),
  text: uu5String(1, 4000).isRequired("image"),
  categoryIdList: array(id(), 1, 10),
  image: binary().isRequired("text"),
});

const jokeGetDtoInType = shape({
  id: id().isRequired(),
});

const jokeUpdateDtoInType = shape({
  id: id().isRequired(),
  name: uu5String(1, 255),
  text: uu5String(1, 4000),
  categoryIdList: oneOf([array(id(), 10), "[]"]),
  image: binary(),
  deleteImage: boolean(),
});

const jokeUpdateVisibilityDtoInType = shape({
  id: id().isRequired(),
  visibility: boolean().isRequired(),
});

const jokeDeleteDtoInType = shape({
  id: id().isRequired(),
});

const jokeListDtoInType = shape({
  sortBy: oneOf(["name", "averageRating", "createTs"]),
  order: oneOf(["asc", "desc"]),
  categoryIdList: array(id(), 1, 10),
  visibility: boolean(),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer(),
  }),
});

const jokeAddRatingDtoInType = shape({
  id: id().isRequired(),
  rating: integer(5).isRequired(),
});
