import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import classNames from 'classnames';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setDimensionX } from 'redactions/widgetEditor';
import ColumnBox from 'components/widgets/ColumnBox';

const boxTarget = {
  drop(props, monitor) {
    props.setDimensionX(monitor.getItem());
  }
};

@DropTarget('columnbox', boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
class DimensionXContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dimensionX: null
    };
  }


  render() {
    const { canDrop, isOver, connectDropTarget, widgetEditor } = this.props;
    const isActive = canDrop && isOver;
    const { dimensionX } = widgetEditor;

    const containerDivClass = classNames({
      'c-column-container': true,
      '-release': isActive
    });

    return connectDropTarget(
      <div className={containerDivClass}>
        x
        {dimensionX &&
          <ColumnBox
            name={dimensionX.name}
            type={dimensionX.type}
            closable
            configurable={dimensionX.type === 'number'}
            isA="dimensionX"
          />
        }
      </div>
    );
  }
}

DimensionXContainer.propTypes = {
  connectDropTarget: PropTypes.func,
  isOver: PropTypes.bool,
  canDrop: PropTypes.bool,
  widgetEditor: PropTypes.object
};

const mapStateToProps = state => ({
  widgetEditor: state.widgetEditor
});

const mapDispatchToProps = dispatch => ({
  setDimensionX: (dimensionX) => {
    dispatch(setDimensionX(dimensionX));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(DimensionXContainer);
