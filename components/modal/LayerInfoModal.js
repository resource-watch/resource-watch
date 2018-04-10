import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// Redux
import { connect } from 'react-redux';

class LayerInfoModal extends React.Component {
  handleMoreInfo = () => {
    const { onRequestClose } = this.props;
    if (onRequestClose && typeof onRequestClose === 'function') {
      onRequestClose(false);
    }
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
  onRequestClose: PropTypes.func.isRequired,
  data: PropTypes.object,
  embed: PropTypes.bool
};

export default connect(
  state => ({
    embed: state.common.embed
  }),
  null
)(LayerInfoModal);
