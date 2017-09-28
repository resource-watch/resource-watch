import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Link } from 'routes';

// Redux
import { connect } from 'react-redux';

// Components
import Legend from 'components/app/pulse/Legend';

function LayerCard(props) {
  const { layerActive, layerPoints } = props.pulse;

  const className = classNames({
    'c-layer-card': true,
    '-hidden': layerActive === null
  });

  const datasetId = (layerActive !== null) ? layerActive.attributes.dataset : null;

  return (
    <div className={className}>
      <h2>{layerActive && layerActive.attributes.name}</h2>
      <p>{layerActive && layerActive.attributes.description}</p>
      {layerPoints && layerPoints.length > 0 &&
        <p>Number of objects: {layerPoints.length}</p>
      }
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
  pulse: PropTypes.object
};

const mapStateToProps = state => ({
  pulse: state.pulse
});

export default connect(mapStateToProps, null)(LayerCard);
