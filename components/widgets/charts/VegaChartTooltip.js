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

  getParsedValue(field) { // eslint-disable-line class-methods-use-this
    if (field.format && field.type === 'number') {
      return format(field.format)(field.value);
    } else if (field.type === 'date') {
      const date = new Date(field.value);
      // NOTE: it's important to have a default format for
      // the manually-created widgets, otherwise if field.format
      // is not defined, time.format will return a date
      // object and the app will crash in dev environment
      // and the tooltip won't show in prod
      const f = field.format || '%d %b %Y';
      return time.format(f)(date);
    }

    return field.value;
  }

  render() {
    const fieldsName = Object.keys(this.props.item).filter(f => f !== 'x');
    return (
      <div className="c-chart-tooltip">
        { this.props.item.x.label && (
          <div className="labels">
            { fieldsName.length && fieldsName.map(fieldName => (
              this.props.item[fieldName].label
                ? <span>{this.props.item[fieldName].label}</span>
                : false
            ))}
            <span>{this.props.item.x.label}</span>
          </div>
        )}
        <div className="values">
          { fieldsName.length && fieldsName.map(fieldName => (
            this.props.item[fieldName].value
              ? <span>{this.getParsedValue(this.props.item[fieldName])}</span>
              : false
          ))}
          <span>{this.getParsedX()}</span>
        </div>
      </div>
    );
  }
}

// const columnType = PropTypes.shape({
//   type: PropTypes.oneOf(['number', 'string', 'date']),
//   label: PropTypes.string,
//   format: PropTypes.string,
//   value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object])
// });

VegaChartTooltip.propTypes = {
  item: PropTypes.object
};

export default VegaChartTooltip;
