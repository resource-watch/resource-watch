import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Link, Router } from 'routes';

// Redux
import { connect } from 'react-redux';

// Components
import Legend from 'components/app/pulse/Legend';
// import Spinner from 'components/ui/Spinner';
import DatasetWidgetChart from 'components/app/explore/DatasetWidgetChart';

function LayerCard(props) {
  const { layerActive, layerPoints, similarDatasets } = props.pulse;

  const className = classNames({
    'c-layer-card': true,
    '-hidden': layerActive === null
  });

  const datasetId = (layerActive !== null) ? layerActive.attributes.dataset : null;

  const similarWidgets = similarDatasets && similarDatasets
    .map(dataset => dataset.attributes.widget
      .find(widget => widget.attributes.default === true))
    .filter(value => typeof value !== 'undefined');

  return (
    <div className={className}>
      <h3>{layerActive && layerActive.attributes.name}</h3>
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
      <h5>Similar content</h5>
      <div className="similar-widgets">
        <div className="row list">
          {similarWidgets &&
            similarWidgets.map(widget =>
              (<div
                className="widget-card"
                onClick={() => Router.pushRoute('explore_detail', { id: widget.attributes.dataset })}
                role="button"
                tabIndex={-1}
              >
                <p>{widget.attributes.name}</p>
                <DatasetWidgetChart
                  key={widget.id}
                  widget={widget.attributes}
                  mode="thumbnail"
                />
              </div>
              ))
          }
        </div>
      </div>
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
