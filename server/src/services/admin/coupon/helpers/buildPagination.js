export const buildPagination = ({ page = 1, limit = 10 }) => {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  return {
    skip: (parsedPage - 1) * parsedLimit,
    limit: parsedLimit,
    page: parsedPage,
  };
};
