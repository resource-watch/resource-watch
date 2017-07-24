import React from 'react';
import PropTypes from 'prop-types';
import { format, time } from 'd3';

// Helpers
import { getTimeFormat } from 'utils/widgets/WidgetHelper';

// Global functions
const getRoundNumber = format('.0f');
const getSINumber = format('.2s');

class VegaChartTooltip extends React.Component {

  getParsedX() {
    const { item } = this.props;
    if (!item) return null;

    const { x } = item;

    if (x.type === 'number') {
      return getRoundNumber(x.value);
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
      <div>
        { this.props.item.x.label && <div>{this.props.item.x.label}</div> }
        <div>{this.getParsedX()}</div>
        { this.props.item.y && this.props.item.y.label && <div>{this.props.item.y.label}</div> }
        <div>{this.getParsedY()}</div>
      </div>
    );
  }
}

const columnType = PropTypes.shape({
  type: PropTypes.oneOf(['number', 'string', 'date']),
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  // Range needed to properly display the dates
  range: PropTypes.arrayOf(PropTypes.number)
});

VegaChartTooltip.propTypes = {
  item: PropTypes.shape({
    x: columnType,
    y: columnType
  })
};

export default VegaChartTooltip;
