import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import debounce from 'lodash/debounce';

// Redux
import { connect } from 'react-redux';

import { setLimit } from 'redactions/widgetEditor';

// Maximum value for the query limit
const LIMIT_MAX_VALUE = 500;

class LimitContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      limit: props.widgetEditor.limit || LIMIT_MAX_VALUE
    };
  }

  @Autobind
  handleLimitChange(newLimit) {
    // We round the number to an integer
    let limit = Math.round(newLimit);

    // We also restrict it to [[1, LIMIT_MAX_VALUE]]
    limit = Math.max(Math.min(limit, LIMIT_MAX_VALUE), 1);

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
          max={LIMIT_MAX_VALUE}
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

export default connect(mapStateToProps, mapDispatchToProps)(LimitContainer);
