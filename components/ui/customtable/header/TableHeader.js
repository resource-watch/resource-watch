import React from 'react';
import PropTypes from 'prop-types';
import TableHeaderActions from './TableHeaderActions';

export default function TableHeader(props) {
  const {
    actions,
    columns,
    columnValues,
    columnQueries,
    filters,
    sort,
    onFilter,
    onSort,
    onSearch
  } = props;
  const actionsShowed = actions.list.filter(a => a.show);

  return (
    <thead>
      <tr>
        {columns.map((c, index) => (
          <th key={index} className={c.type || ''}>
            <span className="th-wrapper">
              <span>{c.label}</span>

              <TableHeaderActions
                field={c.value}
                values={columnValues[c.value]}
                selected={columnQueries[c.value]}
                filters={filters}
                sort={sort}
                onFilter={onFilter}
                onSort={onSort}
                onSearch={onSearch}
              />
            </span>
          </th>
        ))}
        {actions.show && actionsShowed.length &&
          <th colSpan={`${actionsShowed.length}`} />
        }
      </tr>
    </thead>
  );
}

TableHeader.defaultProps = {
  columns: [],
  columnValues: {},
  columnQueries: {},
  filters: true,
  onFilter: null,
  onSort: null,
  onSearch: null,
  sort: null,
  actions: {}
};

TableHeader.propTypes = {
  actions: PropTypes.object,
  columns: PropTypes.array,
  columnValues: PropTypes.object,
  columnQueries: PropTypes.object,
  filters: PropTypes.bool,
  sort: PropTypes.object,
  onFilter: PropTypes.func,
  onSort: PropTypes.func,
  onSearch: PropTypes.func
};
