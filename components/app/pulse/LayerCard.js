import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Link, Router } from 'routes';

// Redux
import { connect } from 'react-redux';
import { setSimilarWidgets } from 'redactions/pulse';

// Components
import Legend from 'components/app/pulse/Legend';
// import Spinner from 'components/ui/Spinner';
import DatasetWidgetChart from 'components/app/explore/DatasetWidgetChart';

// Services
import WidgetService from 'services/WidgetService';

import { LAYERS_PLANET_PULSE } from 'utils/layers/pulse_layers';

class LayerCard extends React.Component {
  componentWillReceiveProps(nextProps) {
    this.loadWidgets(nextProps);
  }

  loadWidgets(nextProps) {
    const { pulse } = nextProps;
    const layerActive = pulse.layerActive && pulse.layerActive.id;

    if (layerActive) {
      let found = false;
      for (let i = 0; i < LAYERS_PLANET_PULSE.length && !found; i++) {
        found = LAYERS_PLANET_PULSE[i].layers.find(obj => obj.id === layerActive);
      }
      if (found) {
        const { widgets } = found;
        if (widgets && widgets.length && widgets.length > 0) {
          const widgetService = new WidgetService(widgets[0], { apiURL: process.env.WRI_API_URL });
          widgetService.fetchData().then((response) => {
            this.props.setSimilarWidgets([response]);
          });
        }
      } else {
        this.props.setSimilarWidgets([]);
      }
    }
  }

  render() {
    const { layerActive, layerPoints, similarWidgets } = this.props.pulse;

    const className = classNames({
      'c-layer-card': true,
      '-hidden': layerActive === null
    });

    const datasetId = (layerActive !== null) ? layerActive.attributes.dataset : null;

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
        {similarWidgets &&
          <div>
            <h5>Similar content</h5>
            <div className="similar-widgets">
              <div className="row list">
                {similarWidgets.map(widget =>
                  (<div
                    key={widget.id}
                    className="widget-card"
                    onClick={() => Router.pushRoute('explore_detail', { id: widget.attributes.dataset })}
                    role="button"
                    tabIndex={-1}
                  >
                    <div className="widget-title">
                      {widget.attributes.name}
                    </div>
                    <DatasetWidgetChart
                      widget={widget.attributes}
                      mode="thumbnail"
                    />
                  </div>
                  ))
                }
              </div>
            </div>
          </div>
        }
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
}

LayerCard.propTypes = {
  // PROPS
  pulse: PropTypes.object,

  // Actions
  setSimilarWidgets: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  pulse: state.pulse
});

const mapDispatchToProps = dispatch => ({
  setSimilarWidgets: (widgets) => { dispatch(setSimilarWidgets(widgets)); }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerCard);
