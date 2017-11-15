import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import classNames from 'classnames';

// Utils
import { logEvent } from 'utils/analytics';

// Redux
import { connect } from 'react-redux';
import { setCategory } from 'components/widgets/editor/redux/widgetEditor';

// Components
import ColumnBox from 'components/widgets/editor/ui/ColumnBox';

const boxTarget = {
  drop(props, monitor) {
    props.setCategory(monitor.getItem());
    logEvent('Customise Visualisation', 'Select a category', monitor.getItem().alias || monitor.getItem().name);
  }
};

@DropTarget('columnbox', boxTarget, (connectDrop, monitor) => ({
  connectDropTarget: connectDrop.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
class CategoryContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      category: null
    };
  }


  render() {
    const { canDrop, connectDropTarget, widgetEditor } = this.props;
    const { category } = widgetEditor;

    const containerDivClass = classNames({
      '-release': canDrop,
      'columnbox-container': true
    });

    return connectDropTarget(
      <div className="c-column-container">
        <span className="text">
          Category
        </span>
        <div className={containerDivClass}>
          {!category &&
          <span className="placeholder">
            Drop here
          </span>
          }
          {category &&
            <ColumnBox
              name={category.name}
              alias={category.alias}
              type={category.type}
              closable
              configurable={category.type === 'number'}
              isA="category"
            />
          }
        </div>
      </div>

    );
  }
}

CategoryContainer.propTypes = {
  connectDropTarget: PropTypes.func,
  isOver: PropTypes.bool,
  canDrop: PropTypes.bool,
  widgetEditor: PropTypes.object
};

const mapStateToProps = state => ({
  widgetEditor: state.widgetEditor
});

const mapDispatchToProps = dispatch => ({
  setCategory: (category) => {
    dispatch(setCategory(category));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryContainer);
