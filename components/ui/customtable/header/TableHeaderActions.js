import React from 'react';
import PropTypes from 'prop-types';
import TableFilters from './TableFilters';
import TableSorts from './TableSorts';

function TableHeaderActions() {
  return (
    <div className="c-table-header-actions">
      <ul>
        <li className="action sortby-action">
          <TableSorts {...this.props} />
        </li>

        {this.props.filters &&
          <li className="action filter-action">
            <TableFilters {...this.props} />
          </li>
        }
      </ul>
    </div>
  );
}

TableHeaderActions.propTypes = {
  field: PropTypes.string.isRequired,
  values: PropTypes.array,
  selected: PropTypes.array,
  filters: PropTypes.bool,
  onFilter: PropTypes.func,
  onSort: PropTypes.func
};

TableHeaderActions.defaultProps = {
  onChange: null,
  selected: null,
  filters: true
};

export default TableHeaderActions;
