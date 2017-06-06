import React from 'react';
import { DragSource } from 'react-dnd';
import { Autobind } from 'es-decorators';
import classNames from 'classnames';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { removeFilter } from 'redactions/widgetEditor';
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
    this.props.removeFilter({ name: this.props.name, type: this.props.type });
  }

  render() {
    const { isDragging, connectDragSource, name, type, closable } = this.props;
    const iconName = (type.toLowerCase() === 'string') ? 'icon-type' : 'icon-hash';
    const boxClass = classNames({
      'c-columnbox': true,
      '-dimmed': isDragging
    });

    return connectDragSource(
      <div className={boxClass}>
        {name}
        <Icon
          name={iconName}
          className="-smaller"
        />
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
      </div>
    );
  }
}

ColumnBox.propTypes = {
  name: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  closable: React.PropTypes.bool,
  configurable: React.PropTypes.bool,
  // Injected by React DnD:
  isDragging: React.PropTypes.bool.isRequired,
  connectDragSource: React.PropTypes.func.isRequired,
  // ACTIONS
  removeFilter: React.PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  removeFilter: (filter) => {
    dispatch(removeFilter(filter));
  }
});

export default DragSource('columnbox', columnBoxSource, collect)(withRedux(initStore, null, mapDispatchToProps)(ColumnBox));
