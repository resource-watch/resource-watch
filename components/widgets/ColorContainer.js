import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import classNames from 'classnames';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setColor } from 'redactions/widgetEditor';
import ColumnBox from 'components/widgets/ColumnBox';

const boxTarget = {
  drop(props, monitor) {
    const newColor = Object.assign(
      {},
      monitor.getItem(),
      { aggregateFunction: 'none' }
    );
    props.setColor(newColor);
  }
};

@DropTarget('columnbox', boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
class ColorContainer extends React.Component {

  setAggregateFunction(value) {
    const newColor = Object.assign(
      {},
      this.props.widgetEditor.color,
      { aggregateFunction: value }
    );
    this.props.setColor(newColor);
  }

  render() {
    const { canDrop, isOver, connectDropTarget, widgetEditor } = this.props;
    const isActive = canDrop && isOver;
    const color = widgetEditor.color;

    const containerDivClass = classNames({
      'c-column-container': true,
      '-release': isActive
    });

    return connectDropTarget(
      <div className={containerDivClass}>
        Color
        {color &&
          <ColumnBox
            name={color.name}
            type={color.type}
            closable
            configurable
            onConfigure={aggregateFunction => this.setAggregateFunction(aggregateFunction)}
            isA="color"
          />
        }
      </div>
    );
  }
}

ColorContainer.propTypes = {
  connectDropTarget: PropTypes.func,
  isOver: PropTypes.bool,
  canDrop: PropTypes.bool,

  // Store
  widgetEditor: PropTypes.object.isRequired,
  setColor: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  widgetEditor: state.widgetEditor
});

const mapDispatchToProps = dispatch => ({
  setColor: (color) => {
    dispatch(setColor(color));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(ColorContainer);
