export const checkSlugExists = async (Model, query) => {
  return await Model.exists(query);
};
