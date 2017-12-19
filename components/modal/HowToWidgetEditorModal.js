import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

import { toggleModal } from 'redactions/modal';

class HowToWidgetEditorModal extends React.Component {
  constructor(props) {
    super(props);

    // ------------------- Bindings -----------------------
    this.handleOkGotIt = this.handleOkGotIt.bind(this);
    // ----------------------------------------------------
  }

  handleOkGotIt() {
    this.props.toggleModal(false);
  }

  render() {
    return (
      <div className="c-how-to-widget-editor-modal">
        <h2>How to customize the visualization</h2>
        <div className="container">
          <div className="container1">
            <h3>1</h3>
            <div>
              Start selecting a visualization type
            </div>
            <div className="image-container">
              <img alt="" src="/static/images/components/modal/howto-step1.png" />
            </div>
          </div>
          <div className="container2">
            <h3>2</h3>
            <div>
              Then drag and drop elements from the list to the boxes to draw up your chart
            </div>
            <div className="image-container">
              <img alt="" src="/static/images/components/modal/howto-step2.png" />
            </div>
          </div>
        </div>
        <div className="actions">
          <button
            className="c-button -primary"
            onClick={this.handleOkGotIt}
          >
          Ok, got it
          </button>
        </div>
      </div>
    );
  }
}

HowToWidgetEditorModal.propTypes = {
  // Store
  toggleModal: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  toggleModal: (open) => { dispatch(toggleModal(open)); }
});


export default connect(null, mapDispatchToProps)(HowToWidgetEditorModal);
