import React from 'react';
import { DragSource } from 'react-dnd';
import { Autobind } from 'es-decorators';
import classNames from 'classnames';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { removeFilter, removeColor, removeDimensionX, removeDimensionY, removeSize } from 'redactions/widgetEditor';
import { toggleTooltip } from 'redactions/tooltip';
import Icon from 'components/ui/Icon';
import FilterTooltip from 'components/widgets/FilterTooltip';

/**
 * Implements the drag source contract.
 */
const columnBoxSource = {
  beginDrag(props) {
    return {
      name: props.name,
      type: props.type,
      datasetID: props.datasetID,
      tableName: props.tableName
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
    }
  }

  @Autobind
  triggerConfigure(event) {
    const { isA, name, type, datasetID, tableName } = this.props;
    switch (isA) {
      case 'color':
        break;
      case 'size':
        break;
      case 'filter':
        this.props.toggleTooltip(true, {
          follow: false,
          position: { x: event.clientX, y: event.clientY },
          children: FilterTooltip,
          childrenProps: {
            name,
            type,
            datasetID,
            tableName
          }
        });
        break;
      case 'dimensionX':
        break;
      case 'dimensionY':
        break;
      default:
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
          <button onClick={this.triggerClose}>
            <Icon
              name="icon-cross"
              className="-smaller close-button"
            />
          </button>
        }
        {configurable &&
          <button onClick={this.triggerConfigure}>
            <Icon
              name="icon-cog"
              className="-smaller configure-button"
            />
          </button>
        }
      </div>
    );
  }
}

ColumnBox.propTypes = {
  tableName: React.PropTypes.string.isRequired,
  datasetID: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  isA: React.PropTypes.string,
  closable: React.PropTypes.bool,
  configurable: React.PropTypes.bool,
  // Injected by React DnD:
  isDragging: React.PropTypes.bool,
  connectDragSource: React.PropTypes.func,
  // ACTIONS
  removeFilter: React.PropTypes.func.isRequired,
  removeSize: React.PropTypes.func.isRequired,
  removeColor: React.PropTypes.func.isRequired,
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
  }
});

export default DragSource('columnbox', columnBoxSource, collect)(withRedux(initStore, null, mapDispatchToProps)(ColumnBox));
