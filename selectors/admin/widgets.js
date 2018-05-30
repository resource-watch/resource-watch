import { createSelector } from 'reselect';

const widgets = state => state.widgets.widgets.list;
const filters = state => state.widgets.widgets.filters;

/**
 * Return the widgets that comply with the filters
 * @param {object[]} widgets Datasets to filter
 * @param {{ key: string, value: string|number }[]} filters Filters to apply to the widgets
 */
const getFilteredWidgets = (widgets, filters) => { // eslint-disable-line no-shadow
  if (!filters.length) {
    return widgets.map(widget => ({
      ...widget,
      owner: widget.user && widget.user.email,
      role: widget.user && widget.user.role
    }));
  }

  const cleanFilters = filters.filter(filter => !filter.orderDirection);

  return widgets.filter((widget) => { // eslint-disable-line arrow-body-style
    return cleanFilters.every((filter) => {
      if (filter.key === 'id') return widget.id === filter.value;
      if (!widget[filter.key]) return false;

      if (typeof filter.value === 'string') {
        return widget[filter.key].toLowerCase().match(filter.value.toLowerCase());
      }

      return widget[filter.key] === filter.value;
    });
  }).map(widget => ({
    ...widget,
    owner: widget.user && widget.user.email,
    role: widget.user && widget.user.role
  }));
};

export default createSelector(widgets, filters, getFilteredWidgets);
