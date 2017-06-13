import React from 'react';
import { DropTarget } from 'react-dnd';
import classNames from 'classnames';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { addColor } from 'redactions/widgetEditor';
import ColumnBox from 'components/widgets/ColumnBox';

const boxTarget = {
  drop(props, monitor) {
    props.addColor(monitor.getItem());
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
      colors: []
    };

    // BINDINGS
  }


  render() {
    const { canDrop, isOver, connectDropTarget, widgetEditor } = this.props;
    const isActive = canDrop && isOver;
    const colors = widgetEditor.colors;

    const containerDivClass = classNames({
      'c-color-container': true,
      '-release': isActive
    });

    return connectDropTarget(
      <div className={containerDivClass}>
        Color
        {colors && colors.length > 0 && colors.map((val, i) =>
          <ColumnBox
            key={`${i}-columnbox`}
            name={val.name}
            type={val.type}
            closable={true}
            configurable={true}
            isA="color"
          />
        )}
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
  addColor: React.PropTypes.func
};

const mapStateToProps = state => ({
  widgetEditor: state.widgetEditor
});

const mapDispatchToProps = dispatch => ({
  addColor: (color) => {
    dispatch(addColor(color));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(ColorContainer);
