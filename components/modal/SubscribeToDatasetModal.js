import React from 'react';
import PropTypes from 'prop-types';

class SubscribeToDatasetModal extends React.Component {

  constructor(props) {
    super(props);
  }

  handleSubscribe() {

  }

  render() {

    const { dataset } = this.props;
    const headerText = `Subscribe to ${dataset.attributes.name}`;

    return (
      <div className="c-subscribe-to-dataset-modal">
        <div className="share-content">
          <h1 className="c-text -header-normal -thin title">{headerText}</h1>
        </div>
        <div className="buttons-div">
          <button className="c-btn -primary" onClick={this.handleSubscribe}>
            Subscribe
          </button>
          <button className="c-btn -secondary" onClick={() => this.props.toggleModal()}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

SubscribeToDatasetModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  dataset: PropTypes.object.isRequired
};


export default SubscribeToDatasetModal;
