import React from 'react';
import { DropTarget } from 'react-dnd';
import classNames from 'classnames';

const boxTarget = {
  drop() {

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
  canDrop: React.PropTypes.bool.isRequired
};

export default FilterContainer;
