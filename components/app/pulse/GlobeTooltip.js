import React from 'react';
import PropTypes from 'prop-types';

class GlobeTooltip extends React.Component {

  handleClick(event) {
    event.nativeEvent.stopImmediatePropagation(); // so that the tooltip is not closed automatically when clicking inside of it
  }

  render() {
    return (
      <div
        className="c-globe-tooltip"
        onClick={this.handleClick}>
        {this.props.value.map(
          val =>
            (<div
              key={val.key}
            >
              <strong>{val.key}</strong>: {val.value}
            </div>)
        )}
      </div>
    );
  }
}

GlobeTooltip.propTypes = {
  // Define the chart data
  value: PropTypes.array.isRequired
};

export default GlobeTooltip;
