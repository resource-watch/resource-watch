import React from 'react';
import classNames from 'classnames';
import Legend from 'components/app/pulse/Legend';
import { Link } from 'routes';

function LayerCard(props) {
  const { layerActive } = props;
  console.log('layerActive', layerActive);

  const className = classNames({
    'c-layer-card': true,
    '-hidden': layerActive === null
  });

  const datasetId = (layerActive !== null) ? layerActive.attributes.dataset : null;

  return (
    <div className={className}>
      <h2>{layerActive && layerActive.attributes.name}</h2>
      <p>{layerActive && layerActive.attributes.description}</p>
      <Legend
        layerActive={layerActive}
        className={{ color: '-dark' }}
      />
      { datasetId &&
        <Link
          route={'explore_detail'}
          params={{ id: datasetId }}
        >
          <a className="link_button" >Explore the data</a>
        </Link>
      }
    </div>
  );
}

LayerCard.propTypes = {
  // PROPS
  layerActive: React.PropTypes.object
};

export default LayerCard;
