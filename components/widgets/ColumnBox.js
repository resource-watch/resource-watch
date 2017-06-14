import React from 'react';
import { DragSource } from 'react-dnd';
import { Autobind } from 'es-decorators';
import classNames from 'classnames';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { removeFilter, removeColor, removeDimensionX, removeDimensionY, removeSize } from 'redactions/widgetEditor';
import { toggleTooltip } from 'redactions/tooltip';
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
      case 'dimensionX':
        this.props.removeDimensionX();
        break;
      case 'dimensionY':
        this.props.removeDimensionY();
        break;
      default:
        console.log('Unknown column box isA value: ', isA);
    }
  }

  @Autobind
  triggerConfigure(event) {
    const { isA } = this.props;
    switch (isA) {
      case 'color':
        console.log('color', this.props);
        break;
      case 'size':
        console.log('size', this.props);
        break;
      case 'filter':
        console.log('color', this.props);
        break;
      case 'dimensionX':
        console.log('dimensionX', this.props);
        break;
      case 'dimensionY':
        console.log('dimensionY', this.props);
        break;
      default:
        console.log('Unknown column box isA value: ', isA);
    }

    this.props.toggleTooltip(true, {
      follow: false,
      position: { x: event.clientX, y: event.clientY }
    });
    debugger;
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
  removeDimensionX: React.PropTypes.func.isRequired,
  removeDimensionY: React.PropTypes.func.isRequired,
  toggleTooltip: React.PropTypes.func.isRequired
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
  removeDimensionX: (dimensionX) => {
    dispatch(removeDimensionX(dimensionX));
  },
  removeDimensionY: (dimensionY) => {
    dispatch(removeDimensionY(dimensionY));
  },
  toggleTooltip: (opened, opts) => {
    dispatch(toggleTooltip(opened, opts));
  },
});

export default DragSource('columnbox', columnBoxSource, collect)(withRedux(initStore, null, mapDispatchToProps)(ColumnBox));
