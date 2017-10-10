import React from 'react';
import PropTypes from 'prop-types';
import { format, time } from 'd3';

class VegaChartTooltip extends React.Component {
  getParsedX() {
    const { item } = this.props;
    if (!item) return null;

    const { x } = item;

    if (x.format && x.type === 'number') {
      return format(x.format)(x.value);
    } else if (x.type === 'date') {
      const date = new Date(x.value);
      // NOTE: it's important to have a default format for
      // the manually-created widgets, otherwise if x.format
      // is not defined, time.format will return a date
      // object and the app will crash in dev environment
      // and the tooltip won't show in prod
      const f = x.format || '%d %b %Y';
      return time.format(f)(date);
    }

    return x.value;
  }

  getParsedY() {
    const { item } = this.props;
    if (!item) return null;

    const { y } = item;
    if (!y) return null;

    if (y.format && y.type === 'number') {
      return format(y.format)(y.value);
    } else if (y.type === 'date') {
      const date = new Date(y.value);
      // NOTE: it's important to have a default format for
      // the manually-created widgets, otherwise if y.format
      // is not defined, time.format will return a date
      // object and the app will crash in dev environment
      // and the tooltip won't show in prod
      const f = y.format || '%d %b %Y';
      return time.format(f)(date);
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
  format: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object])
});

VegaChartTooltip.propTypes = {
  item: PropTypes.shape({
    x: columnType,
    y: columnType
  })
};

export default VegaChartTooltip;
