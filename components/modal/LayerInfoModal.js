import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// Redux
import { connect } from 'react-redux';
import { toggleModal } from 'redactions/modal';

class LayerInfoModal extends React.Component {
  constructor(props) {
    super(props);

    // ------------------- Bindings -----------------------
    this.handleMoreInfo = this.handleMoreInfo.bind(this);
    // ----------------------------------------------------
  }

  handleMoreInfo() {
    this.props.toggleModal(false);
    Router.pushRoute('explore_detail', { id: this.props.data.dataset });
  }

  render() {
    const { embed, data } = this.props;

    return (
      <div className="layer-info-modal">
        <div className="layer-info-content">
          <h2>{data.name}</h2>
          <p>{data.description}</p>
          <div className="buttons">
            {embed &&
              <a
                className="c-btn -primary"
                href={`${window.location.origin}/data/explore/${data.dataset}`}
                target="_blank"
              >
                More info
              </a>
            }

            {!embed &&
              <button
                className="c-btn -primary"
                onClick={this.handleMoreInfo}
              >
                More info
              </button>
            }
          </div>
        </div>
      </div>
    );
  }
}

LayerInfoModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  data: PropTypes.object,
  embed: PropTypes.bool
};

export default connect(
  state => ({
    embed: state.common.embed
  }),
  { toggleModal }
)(LayerInfoModal);
