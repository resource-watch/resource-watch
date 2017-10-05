import React from 'react';
import PropTypes from 'prop-types';

class GlobeTooltip extends React.Component {
  getContent(val) { // eslint-disable-line class-methods-use-this
    if (val.type === 'url') {
      return (
        <div>
          <strong>{val.key}</strong>: <a href={val.value} target="_blank">{val.value}</a>
        </div>);
    } else { // eslint-disable-line no-else-return
      return <div><strong>{val.key}</strong>: {val.value}</div>;
    }
  }

  handleClick(event) { // eslint-disable-line class-methods-use-this
    // so that the tooltip is not closed automatically when clicking inside of it
    event.nativeEvent.stopImmediatePropagation();
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
              {this.getContent(val)}
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
