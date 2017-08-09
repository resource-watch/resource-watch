import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux

import { connect } from 'react-redux';
import { toggleTooltip } from 'redactions/tooltip';

// Components
import Button from 'components/ui/Button';

const ORDER_BY_OPTIONS = [
  'asc', 'desc'
];

class OrderByTooltip extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      orderBy: props.orderBy
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.triggerMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.triggerMouseDown);
  }

  onApply() {
    this.props.onApply(this.state.orderBy);

    // We close the tooltip
    this.props.toggleTooltip(false);
  }

  @Autobind
  triggerMouseDown(e) {
    const el = document.querySelector('.c-tooltip');
    const clickOutside = el && el.contains && !el.contains(e.target);
    if (clickOutside) {
      this.props.toggleTooltip(false);
    }
  }

  @Autobind
  handleInputChange(event) {
    const newOrderBy = Object.assign({}, this.state.orderBy, { orderType: event.target.value });
    this.setState({ orderBy: newOrderBy });
  }

  render() {
    const { orderBy } = this.state;
    return (
      <div className="c-order-by-tooltip">
        Order by
        <div className="button-container">
          {ORDER_BY_OPTIONS.map((val, i) =>
            (
              <div className="radio-button" key={val}>
                <input
                  id={`radio-orderby-${i}`}
                  type="radio"
                  name="order"
                  value={val}
                  onChange={this.handleInputChange}
                  checked={val === orderBy.orderType}
                />
                <label htmlFor={`radio-orderby-${i}`}>{val}</label>
              </div>
            )
          )}
        </div>
        <Button
          properties={{ type: 'button', className: '-primary' }}
          onClick={() => this.onApply()}
        >
          Done
        </Button>
      </div>
    );
  }
}

OrderByTooltip.propTypes = {
  onApply: PropTypes.func.isRequired,
  orderBy: PropTypes.object,
  // store
  toggleTooltip: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  toggleTooltip: (opened, opts) => {
    dispatch(toggleTooltip(opened, opts));
  }
});

export default connect(null, mapDispatchToProps)(OrderByTooltip);
