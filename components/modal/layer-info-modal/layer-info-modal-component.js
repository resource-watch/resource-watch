import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';
import ReactMarkdown from 'react-markdown';

import { fetchDataset } from 'services/dataset';

function LayerInfoModal(props) {
  const { layer } = props;
  const [slug, setSlug] = useState(' ');

  useEffect(() => {
    fetchDataset(layer.dataset)
      .then((dataset) => {
        setSlug(dataset.slug);
      });
  }, []);

  return (
    <div className="c-layer-info-modal">
      <div className="layer-info-content c-markdown">
        <h2>{layer.name}</h2>
        <ReactMarkdown linkTarget="_blank" source={layer.description} />
        <div className="c-button-container -j-end">
          <Link route="explore_detail" params={{ id: slug }}>
            <a className="c-btn -primary">More info</a>
          </Link>
        </div>
      </div>
    </div>
  );
}

LayerInfoModal.propTypes = { layer: PropTypes.object.isRequired };

export default LayerInfoModal;
