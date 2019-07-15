import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// Redux
import { connect } from 'react-redux';

import { fetchDataset } from 'services/dataset';

// Styles
import './styles.scss';

function LayerInfoModal(props) {
  const { embed, layer } = props;
  const [slug, setSlug] = useState(' ');

  useEffect(() => {
    fetchDataset(layer.dataset)
      .then((response) => {
        setSlug(response.slug);
      });
  }, []);

  return (
    <div className="c-layer-info-modal">
      <div className="layer-info-content">
        <h2>{layer.name}</h2>
        <p>{layer.description}</p>
        <div className="buttons">
          {embed && (
            <a
              className="c-btn -primary"
              href={`${window.location.origin}/data/explore/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              More info
            </a>
          )}

          {!embed && (
            <Link route="explore_detail" params={{ id: slug }}>
              <a className="c-btn -primary">More info</a>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

LayerInfoModal.propTypes = {
  layer: PropTypes.object.isRequired,
  embed: PropTypes.bool.isRequired
};

export default connect(
  state => ({ embed: state.common.embed }),
  null
)(LayerInfoModal);
