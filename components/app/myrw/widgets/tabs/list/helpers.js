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
    application: process.env.APPLICATIONS,
    'page[size]': limit,
    'page[number]': page,
    sort: sort === 'asc' ? 'updatedAt' : '-updatedAt',
    ...search && search.length && { name: search },
    ...subtab === 'favourites' && { favourite: true },
    ...(subtab !== 'favourites' && !isCollection) && { userId: id },
    ...isCollection && { collection: subtab }
  });
};

export default { getQueryParams };
