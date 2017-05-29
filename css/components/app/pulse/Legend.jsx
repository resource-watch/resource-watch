import React from 'react';
import LegendType from 'components/pulse/LegendType';

class Legend extends React.Component {

  render() {
    if (this.props.layerActive) {
      return (
        <div className="c-legend">
          <div className="l-container">
            <ul className="c-legend-list">
              <li className="c-legend-item">
                <header className="legend-item-header">
                  <h3 className={this.props.className.color}>
                    <span className="name">{this.props.layerActive.name}</span>
                  </h3>
                </header>
                <LegendType config={this.props.layerActive.legendConfig} className={this.props.className} />
              </li>
            </ul>
          </div>
        </div>
      );
    }
    return null;
  }
}

Legend.propTypes = {
  layerActive: React.PropTypes.object,
  className: React.PropTypes.object
};

Legend.defaultProps = {
  layerActive: null,
  className: {}
};

export default Legend;
