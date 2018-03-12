import { createSelector } from 'reselect';

// Get the layers and filters from state

const search = state => state.search;

// Create a function to compare the current layers and the current layersShownIds
const selectedSearchItem = (search) => {
  if (!search.selected || !search.list.length || (search.list.length < (search.selected - 1))) {
    return null;
  }

  return search.list[search.selected - 1];
};

// Export the selector
export default createSelector(
  search,
  selectedSearchItem
);
