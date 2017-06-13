import React from 'react';
import { DragSource } from 'react-dnd';
import { Autobind } from 'es-decorators';
import classNames from 'classnames';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { removeFilter, removeColor, removeDimension, removeSize } from 'redactions/widgetEditor';
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

  @Autobind
  triggerClose() {
    const { isA } = this.props;
    switch (isA) {
      case 'color':
        this.props.removeColor({ name: this.props.name });
        break;
      case 'size':
        this.props.removeSize({ name: this.props.name });
        break;
      case 'filter':
        this.props.removeFilter({ name: this.props.name });
        break;
      case 'dimension':
        this.props.removeDimension({ name: this.props.name });
        break;
      default:
        console.log('Unknown column box isA value: ', isA);
    }
  }

  render() {
    const { isDragging, connectDragSource, name, type, closable, configurable } = this.props;
    const iconName = (type.toLowerCase() === 'string') ? 'icon-type' : 'icon-hash';
    const boxClass = classNames({
      'c-columnbox': true,
      '-dimmed': isDragging
    });

    return connectDragSource(
      <div className={boxClass}>
        <Icon
          name={iconName}
          className="-smaller"
        />
        {name}
        {closable &&
          <a
            onClick={this.triggerClose}
          >
            <Icon
              name="icon-cross"
              className="-smaller close-button"
            />
          </a>
        }
        {configurable &&
          <a
            onClick={this.triggerConfigure}
          >
            <Icon
              name="icon-cog"
              className="-smaller configure-button"
            />
          </a>
        }
      </div>
    );
  }
}

ColumnBox.propTypes = {
  name: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  isA: React.PropTypes.string,
  closable: React.PropTypes.bool,
  configurable: React.PropTypes.bool,
  // Injected by React DnD:
  isDragging: React.PropTypes.bool.isRequired,
  connectDragSource: React.PropTypes.func.isRequired,
  // ACTIONS
  removeFilter: React.PropTypes.func.isRequired,
  removeSize: React.PropTypes.func.isRequired,
  removeColor: React.PropTypes.func.isRequired.isRequired,
  removeDimension: React.PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  removeFilter: (filter) => {
    dispatch(removeFilter(filter));
  },
  removeColor: (color) => {
    dispatch(removeColor(color));
  },
  removeSize: (size) => {
    dispatch(removeSize(size));
  },
  removeDimension: (dimension) => {
    dispatch(removeDimension(dimension));
  }
});

export default DragSource('columnbox', columnBoxSource, collect)(withRedux(initStore, null, mapDispatchToProps)(ColumnBox));
