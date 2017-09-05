import React from 'react';
import PropTypes from 'prop-types';

class GlobeTooltip extends React.Component {

  constructor(props) {
    super(props);

    // Bindings
    this.getContent = this.getContent.bind(this);
  }

  getContent() {
    let counter = 0;
    return (
      <ul>
        {
          Object.keys(this.props.value).map(
            key => <li key={`tooltip_li_${counter += 1}`}><strong>{key}</strong>: {this.props.value[key]}</li>)
        }
      </ul>
    );
  }

  render() {
    return (
      <div className="c-globe-tooltip">
        {this.getContent()}
      </div>
    );
  }
}

GlobeTooltip.propTypes = {
  // Define the chart data
  value: PropTypes.object
};

export default GlobeTooltip;
