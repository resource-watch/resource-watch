import React from 'react';
import { DragSource } from 'react-dnd';
import classNames from 'classnames';
import Icon from 'components/ui/Icon';

/**
 * Implements the drag source contract.
 */
const columnBoxSource = {
  beginDrag(props) {
    return {
      name: props.name,
      type: props.type
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
    const { isDragging, connectDragSource, name, type } = this.props;
    const iconName = ( type === 'string' ) ? 'icon-type' : 'icon-hash';
    const boxClass = classNames({
      'c-columnbox': true,
      '-dimmed': isDragging
    });

    return connectDragSource(
      <div className={boxClass}>
        {name}
        <Icon
          name={iconName}
          className="-small"
        />
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
