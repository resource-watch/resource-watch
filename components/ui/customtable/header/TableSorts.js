import React from 'react';
import classnames from 'classnames';
import Icon from '../../Icon';

export default class TableFilters extends React.Component {
  render() {
    const { field, sort } = this.props;

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
}

TableFilters.propTypes = {
  field: React.PropTypes.string.isRequired,
  sort: React.PropTypes.object,
  onSort: React.PropTypes.func
};

TableFilters.defaultProps = {
  onChange: null,
  selected: null
};
