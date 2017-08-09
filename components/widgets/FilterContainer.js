import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { addFilter, setFilterValue } from 'redactions/widgetEditor';
import ColumnBox from 'components/widgets/ColumnBox';

const boxTarget = {
  drop(props, monitor) {
    props.addFilter(monitor.getItem());
  }
};

@DropTarget('columnbox', boxTarget, (connectDrop, monitor) => ({
  connectDropTarget: connectDrop.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
class FilterContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      fields: []
    };
  }

  setFilter({ name, value, notNull }) {
    this.props.setFilterValue(name, value, notNull);
  }


  render() {
    const { canDrop, connectDropTarget, widgetEditor } = this.props;
    const filters = widgetEditor.filters;

    const containerDivClass = classNames({
      'filter-box': true,
      '-release': canDrop
    });

    return connectDropTarget(
      <div className="c-filter-container">
        <span className="text">
          Filters
        </span>
        <div className={containerDivClass}>
          {(!filters || filters.length === 0) &&
          <span className="placeholder">
            Drop here
          </span>
          }
          {filters && filters.length > 0 && filters.map(val => (
            <ColumnBox
              key={val.name}
              name={val.name}
              type={val.type}
              datasetID={val.datasetID}
              tableName={val.tableName}
              closable
              configurable
              isA="filter"
              onConfigure={filter => this.setFilter(filter)}
            />
          ))}
        </div>
      </div>
    );
  }
}

FilterContainer.propTypes = {
  connectDropTarget: PropTypes.func,
  canDrop: PropTypes.bool,
  widgetEditor: PropTypes.object,
  // Redux
  setFilterValue: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  widgetEditor: state.widgetEditor
});

const mapDispatchToProps = dispatch => ({
  addFilter: (filter) => {
    dispatch(addFilter(filter));
  },
  setFilterValue: (name, value, notNull) => {
    dispatch(setFilterValue(name, value, notNull));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterContainer);
