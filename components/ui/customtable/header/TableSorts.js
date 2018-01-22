import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../../Icon';

function TableFilters(props) {
  const { field, sort } = props;

  return (
    <div>
      <button
        className={classnames({
          '-active': sort.field === field && sort.value === 1
        })}
        onClick={() => this.props.onSort && this.props.onSort({
          field: this.props.field,
          value: 1
        })}
      >
        <Icon name="icon-arrow-up" className="-tiny" />
      </button>

      <button
        className={classnames({
          '-active': sort.field === field && sort.value === -1
        })}
        onClick={() => this.props.onSort && this.props.onSort({
          field: this.props.field,
          value: -1
        })}
      >
        <Icon name="icon-arrow-down" className="-tiny" />
      </button>
    </div>
  );
}

TableFilters.propTypes = {
  field: PropTypes.string.isRequired,
  sort: PropTypes.object
};

TableFilters.defaultProps = {
  onChange: null,
  selected: null
};
