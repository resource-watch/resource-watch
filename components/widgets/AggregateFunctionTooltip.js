import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import { initStore } from 'store';
import withRedux from 'next-redux-wrapper';
import { toggleTooltip } from 'redactions/tooltip';

// Components
// import CheckboxGroup from 'components/form/CheckboxGroup';
// import Button from 'components/ui/Button';


class AggregateFunctionTooltip extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.triggerMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.triggerMouseDown);
  }

  @Autobind
  triggerMouseDown(e) {
    const el = document.querySelector('.c-tooltip');
    const clickOutside = el && el.contains && !el.contains(e.target);
    if (clickOutside) {
      this.props.toggleTooltip(false);
    }
  }

  render() {
    return (
      <div>
        Aggregate functions
      </div>
    );
  }
}

AggregateFunctionTooltip.propTypes = {
  // store
  toggleTooltip: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  toggleTooltip: (opened, opts) => {
    dispatch(toggleTooltip(opened, opts));
  }
});

export default withRedux(initStore, null, mapDispatchToProps)(AggregateFunctionTooltip);
