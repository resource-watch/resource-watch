import React from 'react';
import { DropTarget } from 'react-dnd';
import classNames from 'classnames';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setColor } from 'redactions/widgetEditor';
import ColumnBox from 'components/widgets/ColumnBox';

const boxTarget = {
  drop(props, monitor) {
    props.setColor(monitor.getItem());
  }
};

@DropTarget('columnbox', boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
class ColorContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      color: null
    };

    // BINDINGS
  }


  render() {
    const { canDrop, isOver, connectDropTarget, widgetEditor } = this.props;
    const isActive = canDrop && isOver;
    const color = widgetEditor.color;

    const containerDivClass = classNames({
      'c-color-container': true,
      '-release': isActive
    });

    return connectDropTarget(
      <div className={containerDivClass}>
        Color
        {color &&
          <ColumnBox
            name={color.name}
            type={color.type}
            closable={true}
            configurable={true}
            isA="color"
          />
        }
      </div>
    );
  }
}

ColorContainer.propTypes = {
  connectDropTarget: React.PropTypes.func.isRequired,
  isOver: React.PropTypes.bool.isRequired,
  canDrop: React.PropTypes.bool.isRequired,

  // STORE
  colors: React.PropTypes.array,

  // ACTIONS
  setColor: React.PropTypes.func
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
