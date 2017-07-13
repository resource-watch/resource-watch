import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import debounce from 'lodash/debounce';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setLimit } from 'redactions/widgetEditor';

class LimitContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      limit: props.widgetEditor.limit || 1000
    };
  }

  @Autobind
  handleLimitChange(newLimit) {
    // We round the number to an integer
    let limit = Math.round(newLimit);

    // We also restrict it to [[1, 1000]]
    limit = Math.max(Math.min(limit, 1000), 1);

    this.setState({ limit });
    this.props.setLimit(limit);
  }

  render() {
    return (
      <div className="c-limit-container">
        <span className="text">
          Limit
        </span>
        <input
          type="number"
          step="1"
          min="1"
          max="1000"
          value={this.state.limit}
          onChange={e => this.handleLimitChange(e.target.value)}
        />
      </div>
    );
  }
}

LimitContainer.propTypes = {
  // Store
  widgetEditor: PropTypes.object.isRequired,
  setLimit: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  widgetEditor: state.widgetEditor
});

const mapDispatchToProps = dispatch => ({
  setLimit: debounce((limit) => {
    dispatch(setLimit(limit));
  }, 500)
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(LimitContainer);
