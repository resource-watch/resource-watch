import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import classNames from 'classnames';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setDimensionY } from 'redactions/widgetEditor';
import ColumnBox from 'components/widgets/ColumnBox';

const boxTarget = {
  drop(props, monitor) {
    props.setDimensionY(monitor.getItem());
  }
};

@DropTarget('columnbox', boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
class DimensionYContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dimensionY: null
    };
  }


  render() {
    const { canDrop, isOver, connectDropTarget, widgetEditor } = this.props;
    const isActive = canDrop && isOver;
    const dimensionY = widgetEditor.dimensionY;

    const containerDivClass = classNames({
      'c-column-container': true,
      '-release': isActive
    });

    return connectDropTarget(
      <div className={containerDivClass}>
        y
        {dimensionY &&
          <ColumnBox
            name={dimensionY.name}
            type={dimensionY.type}
            closable
            configurable={dimensionY.type === 'number'}
            isA="dimensionY"
          />
        }
      </div>
    );
  }
}

DimensionYContainer.propTypes = {
  connectDropTarget: PropTypes.func,
  isOver: PropTypes.bool,
  canDrop: PropTypes.bool,
  widgetEditor: PropTypes.object
};

const mapStateToProps = state => ({
  widgetEditor: state.widgetEditor
});

const mapDispatchToProps = dispatch => ({
  setDimensionY: (dimensionY) => {
    dispatch(setDimensionY(dimensionY));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(DimensionYContainer);
