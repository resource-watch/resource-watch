import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import classNames from 'classnames';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { addFilter } from 'redactions/widgetEditor';
import ColumnBox from 'components/widgets/ColumnBox';

const boxTarget = {
  drop(props, monitor) {
    props.addFilter(monitor.getItem());
  }
};

@DropTarget('columnbox', boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
class FilterContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      fields: []
    };

    // BINDINGS
  }


  render() {
    const { canDrop, isOver, connectDropTarget, widgetEditor } = this.props;
    const isActive = canDrop && isOver;
    const filters = widgetEditor.filters;

    const containerDivClass = classNames({
      '-filter-box': true,
      '-release': isActive
    });

    const boxText = isActive ? 'Release to drop' : 'Drag a column here';

    return connectDropTarget(
      <div className="c-filter-container">
        <h5>Filters</h5>
        <div className={containerDivClass}>
          { (!filters || filters.length === 0) &&
            boxText
          }
          {filters && filters.length > 0 && filters.map(val =>
            <ColumnBox
              key={val.name}
              name={val.name}
              type={val.type}
              closable
              configurable
              isA="filter"
            />
          )}
        </div>
      </div>
    );
  }
}

FilterContainer.propTypes = {
  connectDropTarget: PropTypes.func,
  isOver: PropTypes.bool,
  canDrop: PropTypes.bool,
  widgetEditor: PropTypes.object
};

const mapStateToProps = state => ({
  widgetEditor: state.widgetEditor
});

const mapDispatchToProps = dispatch => ({
  addFilter: (filter) => {
    dispatch(addFilter(filter));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(FilterContainer);
