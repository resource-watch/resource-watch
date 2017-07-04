import React from 'react';
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

TableHeader.propTypes = {
  actions: React.PropTypes.object,
  columns: React.PropTypes.array,
  columnValues: React.PropTypes.object,
  columnQueries: React.PropTypes.object,
  filters: React.PropTypes.bool,
  sort: React.PropTypes.object,
  onFilter: React.PropTypes.func,
  onSort: React.PropTypes.func,
  onSearch: React.PropTypes.func
};

TableHeader.defaultProps = {
  columns: [],
  columnValues: {},
  columnQueries: {},
  filters: true,
  filteredData: [],
  onFilter: null,
  onSort: null,
  onSearch: null
};
