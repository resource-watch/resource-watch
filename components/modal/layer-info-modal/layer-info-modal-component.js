import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// Redux
import { connect } from 'react-redux';

class LayerInfoModal extends React.Component {
  static propTypes = {
    layer: PropTypes.object,
    embed: PropTypes.bool
  };

  render() {
    const { embed, layer } = this.props;

    return (
      <div className="layer-info-modal">
        <div className="layer-info-content">
          <h2>{layer.name}</h2>
          <p>{layer.description}</p>
          <div className="buttons">
            {embed &&
              <a
                className="c-btn -primary"
                href={`${window.location.origin}/data/explore/${layer.dataset}`}
                target="_blank"
              >
                More info
              </a>
            }

            {!embed &&
              <Link
                route="explore_detail"
                params={{ id: layer.dataset }}
              >
                <a
                  className="c-btn -primary"
                  href={`${window.location.origin}/data/explore/${layer.dataset}`}
                  target="_blank"
                >
                  More info
                </a>
              </Link>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    embed: state.common.embed
  }),
  null
)(LayerInfoModal);
