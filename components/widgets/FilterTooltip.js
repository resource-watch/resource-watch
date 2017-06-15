import React from 'react';
import { Autobind } from 'es-decorators';
import { toggleTooltip } from 'redactions/tooltip';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

class FilterTooltip extends React.Component {

  constructor(props) {
    super(props);

  }

  componentDidMount() {
    document.addEventListener('mousedown', this.triggerMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.triggerMouseDown);
  }

  @Autobind
  triggerMouseDown() {
    this.props.toggleTooltip(false);
  }

  render() {
    return (
      <div className="c-filter-tooltip">
        Tooltip
      </div>
    );
  }
}

FilterTooltip.propTypes = {
  // Define the chart data
  value: React.PropTypes.object
};

const mapDispatchToProps = dispatch => ({
  toggleTooltip: (opened, opts) => {
    dispatch(toggleTooltip(opened, opts));
  }
});

export default withRedux(initStore, null, mapDispatchToProps)(FilterTooltip);
