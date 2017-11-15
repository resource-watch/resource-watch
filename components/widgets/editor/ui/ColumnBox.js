import React from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import { Autobind } from 'es-decorators';
import classNames from 'classnames';

// Store
import { connect } from 'react-redux';

import { removeFilter, removeColor, removeCategory, removeValue, removeSize, removeOrderBy, setOrderBy } from 'components/widgets/editor/redux/widgetEditor';
import { toggleTooltip } from 'redactions/tooltip';

// Components
import Icon from 'components/widgets/editor/ui/Icon';
import FilterTooltip from 'components/widgets/editor/tooltip/FilterTooltip';
import AggregateFunctionTooltip from 'components/widgets/editor/tooltip/AggregateFunctionTooltip';
import OrderByTooltip from 'components/widgets/editor/tooltip/OrderByTooltip';
import ColumnDetails from 'components/widgets/editor/tooltip/ColumnDetails';

// Utils
import { isFieldAllowed } from 'components/widgets/editor/helpers/WidgetHelper';

const NAME_MAX_LENGTH = 9;

/**
 * Implements the drag source contract.
 */
const columnBoxSource = {
  beginDrag(props) {
    return {
      name: props.name,
      alias: props.alias,
      type: props.type,
      datasetID: props.datasetID,
      tableName: props.tableName
    };
  }
};

/**
 * Specifies the props to inject into your component.
 */
function collect(connectDrop, monitor) {
  return {
    connectDragSource: connectDrop.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class ColumnBox extends React.Component {
  /**
   * Return the position of the click within the page taking
   * into account the scroll (relative to the page, not the
   * viewport )
   * @static
   * @param {MouseEvent} e Event
   * @returns {{ x: number, y: number }}
   */
  static getClickPosition(e) {
    return {
      x: window.scrollX + e.clientX,
      y: window.scrollY + e.clientY
    };
  }

  /**
   * Return the position of the center of the element within
   * the page taking into account the scroll (relative to
   * the page, not the viewport)
   * @static
   * @param {HTMLElement} node HTML node
   * @returns  {{ x: number, y: number }}
   */
  static getElementPosition(node) {
    const clientRect = node.getBoundingClientRect();
    return {
      x: window.scrollX + clientRect.left + (clientRect.width / 2),
      y: window.scrollY + clientRect.top + (clientRect.height / 2)
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      // Value of the aggregate function
      aggregateFunction: null,
      // Value of the aggregate function for size
      aggregateFunctionSize: null,
      // Value of the aggregate function for color
      aggregateFunctionColor: null
    };
  }

  componentDidMount() {
    // This condition is truthy when the column is opened
    // inside the filters container
    if (this.props.isA === 'filter') {
      const columnName = this.props.name;
      const filters = this.props.widgetEditor.filters;
      const filter = filters.find(f => f.name === columnName);
      // We assume that a filter is considered as "just been
      // dropped" if it still haven't been assigned a value
      const hasBeenDropped = !filter || !filter.value
        || (Array.isArray(filter.value) && !filter.value.length);

      // We ONLY open the filter tooltip if the user has just
      // dropped the column, not when we're restoring the state
      // of the editor
      if (hasBeenDropped) this.openFilterTooltip();
    }
  }

  componentWillReceiveProps(nextProps) {
    // We add a dragging cursor to the column box if it's being dragged
    // We have to set the CSS property to the body otherwise it won't be
    // taken into account
    if (!this.props.isDragging && nextProps.isDragging) {
      document.body.classList.toggle('-dragging', nextProps.isDragging);

      // We prevent the details tooltip from showing...
      if (!this.props.isA) this.onMouseOutColumn();
      // ...and close the details tooltip is eventually already opened
      this.props.toggleTooltip(false);
    }

    this.setState({ aggregateFunction: nextProps.widgetEditor.aggregateFunction });

    const sizeAggregateFunc = nextProps.widgetEditor.size &&
      nextProps.widgetEditor.size.aggregateFunction;
    this.setState({ aggregateFunctionSize: sizeAggregateFunc });

    const colorAggregateFunc = nextProps.widgetEditor.color &&
      nextProps.widgetEditor.color.aggregateFunction;
    this.setState({ aggregateFunctionColor: colorAggregateFunc });
  }

  @Autobind
  onApplyFilter(filter, notNullSelected) {
    if (this.props.onConfigure) {
      this.props.onConfigure({ name: this.props.name, value: filter, notNull: notNullSelected });
    }
  }

  @Autobind
  onApplyAggregateFunction(aggregateFunction) {
    this.setState({ aggregateFunction });

    // We don't want to save "none" in the store when in reality
    // there isn't any aggregate function applied
    const value = aggregateFunction === 'none' ? null : aggregateFunction;

    if (this.props.onConfigure) {
      this.props.onConfigure({ name: this.props.name, value });
    }
  }

  @Autobind
  onApplyAggregateFunctionSize(aggregateFunctionSize) {
    this.setState({ aggregateFunctionSize });

    if (this.props.onConfigure) {
      this.props.onConfigure(aggregateFunctionSize);
    }
  }

  @Autobind
  onApplyAggregateFunctionColor(aggregateFunctionColor) {
    this.setState({ aggregateFunctionColor });

    if (this.props.onConfigure) {
      this.props.onConfigure(aggregateFunctionColor);
    }
  }

  @Autobind
  onApplyOrderBy(orderBy) {
    this.setState({ orderBy });

    if (this.props.onSetOrderType) {
      this.props.onSetOrderType(orderBy);
    }
  }

  /**
   * Event handler executed when the user clicks
   * on the root element
   * @param {MouseEvent} [e] - Event
   */
  onClickColumn(e) {
    // Prevent the tooltip from automatically
    // closing right after opening it
    if (e) e.stopPropagation();

    this.detailsTooltipCloseOnMouseOut = false;
    this.openDetailsTooltip();
  }

  /**
   * Event handler executed when the user puts the
   * cursor on top of the root element
   */
  onMouseOverColumn() {
    this.detailsTooltipTimer = setTimeout(() => {
      this.detailsTooltipCloseOnMouseOut = true;
      this.openDetailsTooltip();
    }, 1500);
  }

  /**
   * Event handler executed when the user moves the
   * cursor away from the root element
   */
  onMouseOutColumn() {
    if (this.detailsTooltipTimer) {
      clearTimeout(this.detailsTooltipTimer);
      this.detailsTooltipTimer = null;
    }

    if (this.detailsTooltipCloseOnMouseOut) {
      this.detailsTooltipCloseOnMouseOut = false;
      this.closeDetailsTooltip();
    }
  }

  /**
   * Open the details tooltip
   */
  openDetailsTooltip() {
    if (!this.el) return;

    const rects = this.el.getBoundingClientRect();

    const position = {
      x: window.scrollX + rects.x + (rects.width / 2),
      y: window.scrollY + rects.y + (rects.height / 2)
    };

    this.props.toggleTooltip(true, {
      follow: false,
      position,
      direction: 'top',
      children: ColumnDetails,
      childrenProps: {
        name: this.props.alias || this.props.name,
        description: this.props.description,
        onClose: () => this.closeDetailsTooltip()
      }
    });
  }

  /**
   * Close the details tooltip
   */
  closeDetailsTooltip() {
    this.props.toggleTooltip(false);
  }

  @Autobind
  triggerClose() {
    const { isA } = this.props;
    switch (isA) {
      case 'color':
        this.props.removeColor({ name: this.props.name });
        break;
      case 'size':
        this.props.removeSize({ name: this.props.name });
        break;
      case 'filter':
        this.props.removeFilter({ name: this.props.name });
        break;
      case 'category':
        this.props.removeCategory();
        break;
      case 'value':
        this.props.removeValue();
        break;
      case 'orderBy':
        this.props.removeOrderBy();
        break;
      default:
    }
  }

  /**
   * Open the filter tooltip
   * NOTE: make sure the component is mounted before calling
   * this method (it needs to compute bounding rects)
   * @param {MouseEvent} [event] Click event
   */
  openFilterTooltip(event) {
    const { name, type, datasetID, tableName } = this.props;

    const position = event
      ? ColumnBox.getClickPosition(event)
      : ColumnBox.getElementPosition(this.settingsButton);

    this.props.toggleTooltip(true, {
      follow: false,
      position,
      children: FilterTooltip,
      childrenProps: {
        name,
        type,
        datasetID,
        tableName,
        onApply: this.onApplyFilter,
        isA: 'filter'
      }
    });
  }

  @Autobind
  triggerConfigure(event) {
    const { isA, name, type, datasetID, tableName, widgetEditor } = this.props;
    const { orderBy, aggregateFunction } = widgetEditor;

    switch (isA) {
      case 'color':
        this.props.toggleTooltip(true, {
          follow: false,
          position: ColumnBox.getClickPosition(event),
          children: AggregateFunctionTooltip,
          childrenProps: {
            name,
            type,
            datasetID,
            tableName,
            onApply: this.onApplyAggregateFunctionColor,
            aggregateFunction,
            onlyCount: type !== 'number',
            isA: 'color'
          }
        });
        break;
      case 'size':
        this.props.toggleTooltip(true, {
          follow: false,
          position: ColumnBox.getClickPosition(event),
          children: AggregateFunctionTooltip,
          childrenProps: {
            name,
            type,
            datasetID,
            tableName,
            onApply: this.onApplyAggregateFunctionSize,
            aggregateFunction,
            onlyCount: type !== 'number',
            isA: 'size'
          }
        });
        break;
      case 'filter':
        this.openFilterTooltip(event);
        break;
      case 'category':
        break;
      case 'value':
        this.props.toggleTooltip(true, {
          follow: false,
          position: ColumnBox.getClickPosition(event),
          children: AggregateFunctionTooltip,
          childrenProps: {
            name,
            type,
            datasetID,
            tableName,
            onApply: this.onApplyAggregateFunction,
            aggregateFunction,
            onlyCount: type !== 'number',
            isA: 'value'
          }
        });
        break;
      case 'orderBy':
        this.props.toggleTooltip(true, {
          follow: false,
          position: ColumnBox.getClickPosition(event),
          children: OrderByTooltip,
          childrenProps: {
            name,
            type,
            onApply: this.onApplyOrderBy,
            orderBy,
            isA: 'orderBy'
          }
        });
        break;
      default:
    }
  }

  render() {
    const { aggregateFunction, aggregateFunctionSize, aggregateFunctionColor } = this.state;
    const {
      isDragging,
      connectDragSource,
      name,
      alias,
      type,
      closable,
      configurable,
      isA,
      widgetEditor
    } = this.props;
    const { orderBy } = widgetEditor;

    const orderType = orderBy ? orderBy.orderType : null;
    let iconName;
    switch (isFieldAllowed({ columnType: type }).type) {
      case 'number':
        iconName = 'icon-item-number';
        break;
      case 'text':
        iconName = 'icon-item-category';
        break;
      case 'date':
        iconName = 'icon-item-date';
        break;
      default:
        iconName = 'icon-item-unknown';
    }

    const isConfigurable = (isA === 'filter') || (isA === 'value') ||
      (isA === 'orderBy');

    return connectDragSource(
      <div // eslint-disable-line jsx-a11y/no-static-element-interactions
        // FIXME: which role to assign to the element to make it accessible?
        className={classNames({ 'c-columnbox': true, '-dimmed': isDragging })}
        title={isA ? alias || name : ''}
        onClick={e => !isA && this.onClickColumn(e)}
        onMouseOver={() => !isA && this.onMouseOverColumn()}
        onMouseOut={() => !isA && this.onMouseOutColumn()}
        ref={(node) => { this.el = node; }}
      >
        <Icon
          name={iconName}
          className="-smaller"
        />
        { ((alias || name).length > NAME_MAX_LENGTH) ? `${(alias || name).substr(0, NAME_MAX_LENGTH - 1)}...` : (alias || name) }
        {isA === 'value' && aggregateFunction &&
          <div className="aggregate-function">
            {aggregateFunction}
          </div>
        }
        {isA === 'size' && aggregateFunctionSize && aggregateFunctionSize !== 'none' &&
          <div className="aggregate-function">
            {aggregateFunctionSize}
          </div>
        }
        {isA === 'color' && aggregateFunctionColor && aggregateFunctionColor !== 'none' &&
          <div className="aggregate-function">
            {aggregateFunctionColor}
          </div>
        }
        {isA === 'orderBy' && orderType &&
          <div className="order-by">
            {orderType}
          </div>
        }
        {closable &&
          <button
            type="button"
            onClick={this.triggerClose}
          >
            <Icon
              name="icon-cross"
              className="-smaller close-button"
            />
          </button>
        }
        {configurable && isConfigurable &&
          <button
            type="button"
            onClick={this.triggerConfigure}
            ref={(node) => { this.settingsButton = node; }}
          >
            <Icon
              name="icon-cog"
              className="-smaller configure-button"
            />
          </button>
        }
      </div>
    );
  }
}

ColumnBox.propTypes = {
  // NOTE: Don't make any of the following props as required as React will
  // throw prop checks errors because of react-dnd (don't know why)
  tableName: PropTypes.string,
  datasetID: PropTypes.string,
  name: PropTypes.string,
  alias: PropTypes.string,
  description: PropTypes.string,
  type: PropTypes.string,
  isA: PropTypes.string,
  closable: PropTypes.bool,
  configurable: PropTypes.bool,
  onConfigure: PropTypes.func,
  onSetOrderType: PropTypes.func,
  // Store
  widgetEditor: PropTypes.object.isRequired,
  // Injected by React DnD:
  isDragging: PropTypes.bool,
  connectDragSource: PropTypes.func,
  // ACTIONS
  removeFilter: PropTypes.func.isRequired,
  removeSize: PropTypes.func.isRequired,
  removeColor: PropTypes.func.isRequired,
  removeCategory: PropTypes.func.isRequired,
  removeValue: PropTypes.func.isRequired,
  removeOrderBy: PropTypes.func.isRequired,
  setOrderBy: PropTypes.func.isRequired,
  toggleTooltip: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  widgetEditor: state.widgetEditor
});

const mapDispatchToProps = dispatch => ({
  removeFilter: (filter) => {
    dispatch(removeFilter(filter));
  },
  removeColor: (color) => {
    dispatch(removeColor(color));
  },
  removeSize: (size) => {
    dispatch(removeSize(size));
  },
  removeCategory: (category) => {
    dispatch(removeCategory(category));
  },
  removeValue: (value) => {
    dispatch(removeValue(value));
  },
  removeOrderBy: (value) => {
    dispatch(removeOrderBy(value));
  },
  setOrderBy: (value) => {
    dispatch(setOrderBy(value));
  },
  toggleTooltip: (opened, opts) => {
    dispatch(toggleTooltip(opened, opts));
  }
});


export default DragSource('columnbox', columnBoxSource, collect)(connect(mapStateToProps, mapDispatchToProps)(ColumnBox));
