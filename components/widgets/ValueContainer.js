import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import classNames from 'classnames';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setValue, setAggregateFunction } from 'redactions/widgetEditor';
import ColumnBox from 'components/widgets/ColumnBox';

const boxTarget = {
  drop(props, monitor) {
    props.setValue(monitor.getItem());
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
      value: null
    };
  }

  setAggregateFunction({ value }) {
    this.props.setAggregateFunction(value);
  }

  render() {
    const { canDrop, isOver, connectDropTarget, widgetEditor } = this.props;
    const isActive = canDrop && isOver;
    const value = widgetEditor.value;

    const containerDivClass = classNames({
      'c-column-container': true,
      '-release': isActive
    });

    return connectDropTarget(
      <div className={containerDivClass}>
        Value
        {value &&
          <ColumnBox
            name={value.name}
            type={value.type}
            closable
            configurable={value.type === 'number'}
            onConfigure={aggregateFunction => this.setAggregateFunction(aggregateFunction)}
            isA="value"
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
  widgetEditor: PropTypes.object,
  // Redux
  setAggregateFunction: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  widgetEditor: state.widgetEditor
});

const mapDispatchToProps = dispatch => ({
  setValue: (value) => {
    dispatch(setValue(value));
  },
  setAggregateFunction: (value) => {
    dispatch(setAggregateFunction(value));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(DimensionYContainer);
