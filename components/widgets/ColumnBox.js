import React from 'react';
import { DragSource } from 'react-dnd';

/**
 * Implements the drag source contract.
 */
const columnBoxSource = {
  beginDrag(props) {
    return {
      name: props.name
    };
  }
};

/**
 * Specifies the props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class ColumnBox extends React.Component {

  constructor(props) {
    super(props);

    // BINDINGS
  }

  render() {
    const { isDragging, connectDragSource, name } = this.props;
    return connectDragSource(
      <div className="c-columnbox">
        {name}
      </div>
    );
  }
}

ColumnBox.propTypes = {
  name: React.PropTypes.string,
  type: React.PropTypes.string,
  // Injected by React DnD:
  isDragging: React.PropTypes.bool.isRequired,
  connectDragSource: React.PropTypes.func.isRequired
};

export default DragSource('columnbox', columnBoxSource, collect)(ColumnBox);
