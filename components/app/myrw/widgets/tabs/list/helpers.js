export const getQueryParams = (state = {}, props) => {
  const {
    sort,
    pagination,
    search,
  } = state;
  const {
    user: { id },
    subtab,
  } = props;
  const { page, limit } = pagination;
  const isCollection = !['my_widgets', 'favorites'].includes(subtab);

  return ({
    application: process.env.NEXT_PUBLIC_APPLICATIONS,
    'page[size]': limit,
    'page[number]': page,
    sort: sort === 'asc' ? 'updatedAt' : '-updatedAt',
    ...search && search.length && { name: search },
    ...subtab === 'favorites' && { favourite: true },
    ...(subtab !== 'favorites' && !isCollection) && { userId: id },
    ...isCollection && { collection: subtab },
  });
};

export default { getQueryParams };
