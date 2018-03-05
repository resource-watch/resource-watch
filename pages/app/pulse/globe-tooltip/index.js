import { Component, createElement } from 'react';
import { connect } from 'react-redux';

import GlobeTooltipComponent from './component';

const mapStateToProps = state => ({
  contextLayersPulse: state.contextLayersPulse
});

class GlobeTooltipContainer extends Component {
  render() {
    return createElement(GlobeTooltipComponent, {
      ...this.props
    });
  }
}

export default connect(mapStateToProps, null)(GlobeTooltipContainer);
