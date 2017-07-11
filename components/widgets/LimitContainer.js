import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setLimit } from 'redactions/widgetEditor';

class LimitContainer extends React.Component {

  @Autobind
  handleLimitChange(event) {
    let newValue = null;
    try {
      newValue = parseInt(event.target.value, 10);
      if (isNaN(newValue) || newValue > 1000) {
        newValue = 1000;
      }
    } catch (err) {
      newValue = 1000;
    }
    this.props.setLimit(newValue);
  }

  render() {
    const { widgetEditor } = this.props;
    const limit = widgetEditor.limit;

    return (
      <div className="c-limit-container">
        <span className="text">
          Limit
        </span>
        <input
          value={limit}
          onChange={this.handleLimitChange}
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
  setLimit: (limit) => {
    dispatch(setLimit(limit));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(LimitContainer);
