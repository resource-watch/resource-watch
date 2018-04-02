import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import LayoutEmbed from 'layout/layout/layout-embed';
import Map from 'components/ui/map/Map';
import { Legend, LegendItemTypes } from 'wri-api-components';

// Utils
import LayerManager from 'utils/layers/LayerManager';

class EmbedMapSwipe extends React.Component {
  static propTypes = {
    layerGroups: PropTypes.array,
    zoom: PropTypes.number,
    latLng: PropTypes.object,
    isLoadedExternally: PropTypes.bool
  };

  static defaultProps = {
    layerGroups: [],
    zoom: 3,
    latLng: { lat: 0, lng: 0 }
  };

  render() {
    const {
      zoom,
      latLng,
      layerGroups,
      isLoadedExternally
    } = this.props;

    return (
      <LayoutEmbed
        title="Map swipe"
        description=""
      >
        <div className="c-embed-widget">
          <div className="widget-title">
            Map swipe
          </div>

          <div
            className={classnames({
              'widget-content': true,
              '-external': isLoadedExternally
            })}
          >
            <Map
              swipe
              mapConfig={{
                zoom,
                latLng
              }}
              layerGroups={layerGroups}
              LayerManager={LayerManager}
            />

          </div>

          <div className="widget-footer">
            {layerGroups.map(lg => (
              <Legend
                maxHeight={150}
                sortable={false}
                layerGroups={[lg]}
                LegendItemTypes={<LegendItemTypes />}
              />
            ))}
          </div>
          {/* {isLoadedExternally && (
            <div className="widget-footer">
              Powered by
              <a href="/" target="_blank" rel="noopener noreferrer">
                <img
                  className="embed-logo"
                  src="/static/images/logo-embed.png"
                  alt="Resource Watch"
                />
              </a>
            </div>
          )} */}
        </div>
      </LayoutEmbed>
    );
  }
}

export default EmbedMapSwipe;
