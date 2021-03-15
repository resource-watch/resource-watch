import { createSelector } from 'reselect';

// states
const search = (state) => state.search;

export const selectedSearchItem = createSelector(
  [search],
  (_search) => {
    if (!_search.selected || !_search.list.length
       || (_search.list.length < (_search.selected - 1))) return null;

    return _search.list[_search.selected - 1];
  },
);

export default { selectedSearchItem };
