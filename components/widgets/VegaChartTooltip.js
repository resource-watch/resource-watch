import React from 'react';
import PropTypes from 'prop-types';
import { time } from 'd3';

// Helpers
import { getTimeFormat, get2DecimalFixedNumber, getSINumber } from 'utils/widgets/WidgetHelper';

class VegaChartTooltip extends React.Component {

  getParsedX() {
    const { item } = this.props;
    if (!item) return null;

    const { x } = item;

    if (x.type === 'number') {
      return get2DecimalFixedNumber(x.value);
    } else if (x.type === 'date') {
      const date = new Date(x.value);
      return time.format(getTimeFormat(x.range))(date);
    }

    return x.value;
  }

  getParsedY() {
    const { item } = this.props;
    if (!item) return null;

    const { y } = item;
    if (!y) return null;

    if (y.type === 'number') {
      return getSINumber(y.value);
    } else if (y.type === 'date') {
      const date = new Date(y.value);
      return time.format(getTimeFormat(y.range))(date);
    }

    return y.value;
  }


  render() {
    return (
      <div className="c-chart-tooltip">
        { this.props.item.x.label && (
          <div className="labels">
            { this.props.item.y.label && <span>{this.props.item.y.label}</span> }
            <span>{this.props.item.x.label}</span>
          </div>
        )}
        <div className="values">
          { this.props.item.y.value && <span>{this.getParsedY()}</span> }
          <span>{this.getParsedX()}</span>
        </div>
      </div>
    );
  }
}

const columnType = PropTypes.shape({
  type: PropTypes.oneOf(['number', 'string', 'date']),
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  // Range needed to properly display the dates
  // Either a timestamp or a date object
  range: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.object]))
});

VegaChartTooltip.propTypes = {
  item: PropTypes.shape({
    x: columnType,
    y: columnType
  })
};

export default VegaChartTooltip;
