export const getQueryParams = (state = {}, props) => {
  const {
    sort,
    pagination,
    search
  } = state;
  const {
    user: { id },
    subtab
  } = props;
  const { page, limit } = pagination;
  const isCollection = !['my_widgets', 'favourites'].includes(subtab);

  return ({
    'page[size]': limit,
    'page[number]': page,
    sort: sort === 'asc' ? 'updatedAt' : '-updatedAt',
    userId: id,
    ...search && search.length && { name: search },
    ...subtab === 'favourites' && { favourite: true },
    ...isCollection && { collection: subtab }
  });
};

export default { getQueryParams };
