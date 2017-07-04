import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import classNames from 'classnames';
import { Autobind } from 'es-decorators';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setOrderBy } from 'redactions/widgetEditor';

// Components
import ColumnBox from 'components/widgets/ColumnBox';

const boxTarget = {
  drop(props, monitor) {
    props.setOrderBy(Object.assign({}, monitor.getItem(), { orderType: 'asc' }));
  }
};

@DropTarget('columnbox', boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
class SortContainer extends React.Component {

  @Autobind
  handleSetOrderType(orderBy) {
    this.props.setOrderBy(orderBy);
  }

  render() {
    const { canDrop, isOver, connectDropTarget, widgetEditor } = this.props;
    const isActive = canDrop && isOver;
    const orderBy = widgetEditor.orderBy;

    const containerDivClass = classNames({
      'c-column-container': true,
      'c-sort-container': true,
      '-release': isActive
    });

    return connectDropTarget(
      <div className={containerDivClass}>
        Sorting
        {orderBy &&
          <ColumnBox
            name={orderBy.name}
            type={orderBy.type}
            closable
            configurable
            isA="orderBy"
            onSetOrderType={this.handleSetOrderType}
          />
        }
      </div>
    );
  }
}

SortContainer.propTypes = {
  connectDropTarget: PropTypes.func,
  isOver: PropTypes.bool,
  canDrop: PropTypes.bool,
  // Store
  setOrderBy: PropTypes.func,
  widgetEditor: PropTypes.object
};

const mapStateToProps = state => ({
  widgetEditor: state.widgetEditor
});

const mapDispatchToProps = dispatch => ({
  setOrderBy: (orderBy) => {
    dispatch(setOrderBy(orderBy));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(SortContainer);
