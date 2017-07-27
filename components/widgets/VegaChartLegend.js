import React from 'react';
import PropTypes from 'prop-types';

// Components
import Title from 'components/ui/Title';

// Helpers
import { getSINumber } from 'utils/widgets/WidgetHelper';

class VegaChartLegend extends React.Component {

   /**
   * Render the "color" legend corresponding to the config
   * This legend is specific for marks which the color varies
   * @static
   * @param {object} config Check VegaChartLegend.propTypes.config for the types
   * @return {JSX}
   */
  static renderColorLegend(config) {
    // Kind of a trick, if there's something better, use it
    const uniqueId = config.values.slice(0, 5).map(v => v.label).join('');

    return (
      <div className="legend -color" key={uniqueId}>
        { config.label && <Title className="-default">{config.label}</Title> }
        <div className="items">
          { config.values.map(value => (
            <div className="item" key={value.label}>
              <span
                className={`shape -${config.shape || 'square'}`}
                style={{ backgroundColor: value.value }}
              />
              <span className="label">{value.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /**
   * Render the "size" legend corresponding to the config
   * This legend is specific for marks which the size varies
   * @static
   * @param {object} config Check VegaChartLegend.propTypes.config for the types
   * @return {JSX}
   */
  static renderSizeLegend(config) {
    // Kind of a trick, if there's something better, use it
    const uniqueId = config.values.slice(0, 5).map(v => v.label).join('');

    return (
      <div className="legend -size" key={uniqueId}>
        { config.label && <Title className="-default">{config.label}</Title> }
        <div className="items">
          { config.values.map(value => (
            <div className="item" key={value.label}>
              <div className="shape-container">
                <span
                  className={`shape -${config.shape || 'square'}`}
                  style={{
                    width: `${2 * value.value}px`,
                    height: `${2 * value.value}px`
                  }}
                />
              </div>
              <span className="label">{getSINumber(value.label)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /**
   * Render the legend corresponding to the config
   * @param {object} config Check VegaChartLegend.propTypes.config for the types
   */
  static renderLegend(config) { // eslint-disable-line consistent-return
    if (config.type === 'color') {
      return VegaChartLegend.renderColorLegend(config);
    } else if (config.type === 'size') {
      return VegaChartLegend.renderSizeLegend(config);
    }
  }

  render() {
    return (
      <div className="c-vega-chart-legend">
        <div className="container">
          { this.props.config.map(config => VegaChartLegend.renderLegend(config)) }
        </div>
      </div>
    );
  }
}

VegaChartLegend.propTypes = {
  config: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['color', 'size']),
    label: PropTypes.string,
    scale: PropTypes.string,
    shape: PropTypes.oneOf(['square', 'circle', 'line']),
    values: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }))
  })).isRequired
};

export default VegaChartLegend;
