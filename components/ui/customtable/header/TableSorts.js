import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../../Icon';

function TableSorts(props) {
  const { field, sort, onSort } = props;

  return (
    <div>
      <button
        className={classnames({
          '-active': sort.field === field && sort.value === 1
        })}
        onClick={() => onSort && onSort({
          field,
          value: 1
        })}
      >
        <Icon name="icon-arrow-up" className="-tiny" />
      </button>

      <button
        className={classnames({
          '-active': sort.field === field && sort.value === -1
        })}
        onClick={() => onSort && onSort({
          field,
          value: -1
        })}
      >
        <Icon name="icon-arrow-down" className="-tiny" />
      </button>
    </div>
  );
}

TableSorts.propTypes = {
  field: PropTypes.string.isRequired,
  onSort: PropTypes.func.isRequired,
  sort: PropTypes.object
};

export default TableSorts;
