import React from 'react';
import { DropTarget } from 'react-dnd';
import classNames from 'classnames';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { addFilter } from 'redactions/widgetEditor';

const boxTarget = {
  drop(props, monitor) {
    props.addFilter(monitor.getItem());
  }
}

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
    const { canDrop, isOver, connectDropTarget } = this.props;
    const isActive = canDrop && isOver;

    const containerDivClass = classNames({
      'filter-box': true,
      '-release': isActive
    });

    return connectDropTarget(
      <div className="c-filter-container">
        <h5>Filters</h5>
        <div className={containerDivClass}>
          {isActive ?
            'Release to drop' :
            'Drag a column here'
          }
        </div>
      </div>
    );
  }
}

FilterContainer.propTypes = {
  connectDropTarget: React.PropTypes.func.isRequired,
  isOver: React.PropTypes.bool.isRequired,
  canDrop: React.PropTypes.bool.isRequired,

  // STORE
  filters: React.PropTypes.array,

  // ACTIONS
  addFilter: React.PropTypes.func
};

const mapStateToProps = state => ({
  filters: state.filters
});

const mapDispatchToProps = dispatch => ({
  addFilter: (filter) => {
    dispatch(addFilter(filter));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(FilterContainer);
