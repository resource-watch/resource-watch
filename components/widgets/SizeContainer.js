import React from 'react';
import { DropTarget } from 'react-dnd';
import classNames from 'classnames';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { addSize } from 'redactions/widgetEditor';
import ColumnBox from 'components/widgets/ColumnBox';

const boxTarget = {
  drop(props, monitor) {
    props.addSize(monitor.getItem());
  }
};

@DropTarget('columnbox', boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
class SizeContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      sizes: []
    };

    // BINDINGS
  }


  render() {
    const { canDrop, isOver, connectDropTarget, widgetEditor } = this.props;
    const isActive = canDrop && isOver;
    const sizes = widgetEditor.sizes;

    const containerDivClass = classNames({
      'c-size-container': true,
      '-release': isActive
    });

    return connectDropTarget(
      <div className={containerDivClass}>
        Size
        {sizes && sizes.length > 0 && sizes.map((val, i) =>
          <ColumnBox
            key={`${i}-columnbox`}
            name={val.name}
            type={val.type}
            closable={true}
            configurable={true}
            isA="size"
          />
        )}
      </div>
    );
  }
}

SizeContainer.propTypes = {
  connectDropTarget: React.PropTypes.func.isRequired,
  isOver: React.PropTypes.bool.isRequired,
  canDrop: React.PropTypes.bool.isRequired,

  // STORE
  sizes: React.PropTypes.array,

  // ACTIONS
  addSize: React.PropTypes.func
};

const mapStateToProps = state => ({
  widgetEditor: state.widgetEditor
});

const mapDispatchToProps = dispatch => ({
  addSize: (size) => {
    dispatch(addSize(size));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(SizeContainer);
