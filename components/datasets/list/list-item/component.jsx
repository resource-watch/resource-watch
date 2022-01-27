import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Link from 'next/link';
import { Tooltip } from 'vizzuality-components';

// components
import Icon from 'components/ui/icon';
import LoginRequired from 'components/ui/login-required';
import CollectionsPanel from 'components/collections-panel';
import WidgetChart from 'components/charts/widget-chart';
import MapThumbnail from 'components/map/thumbnail';
import PlaceholderChart from 'components/charts/placeholder-chart';
import ForwardLink from 'components/forward-link';

// hooks
import useBelongsToCollection from 'hooks/collection/belongs-to-collection';

// utils
import { getTooltipContainer } from 'utils/tooltip';
import { getDateConsideringTimeZone } from 'utils/utils';

// lib
import { Media } from 'lib/media';

const DatasetListItem = (props) => {
  const { dataset, widget, layer, mode, user, actions, tags, metadata } = props;
  const { isInACollection } = useBelongsToCollection(dataset.id, user.token);
  const renderChart = useCallback(() => {
    const isWidgetMap = widget && widget.widgetConfig.type === 'map';
    const isEmbedWidget = widget && widget.widgetConfig.type === 'embed';

    if (mode !== 'grid') return null;

    if (widget && !isWidgetMap && !isEmbedWidget) {
      return (
        <div className="list-item-chart">
          <WidgetChart widget={widget} thumbnail />
        </div>
      );
    }

    if (layer || isWidgetMap) {
      return (
        <div className="list-item-chart">
          <MapThumbnail layer={layer} />
        </div>
      );
    }

    return (
      <div className="list-item-chart">
        <Link href={`/data/explore/${dataset.slug}`} passHref>
          <ForwardLink>
            <PlaceholderChart />
          </ForwardLink>
        </Link>
      </div>
    );
  }, [mode, widget, layer, dataset]);

  const starIconName = classnames({
    'icon-star-full': isInACollection,
    'icon-star-empty': !isInACollection,
  });
  const starIconClass = classnames({
    '-small': true,
    '-filled': isInACollection,
    '-empty': !isInACollection,
  });

  const dateLastUpdated = getDateConsideringTimeZone(dataset.dataLastUpdated);

  return (
    <div className={`c-dataset-list-item -${mode}`}>
      {/* CHART */}
      <Media greaterThanOrEqual="md">{renderChart()}</Media>

      {/* CHART MOBILE */}
      <Media at="sm">
        <Link href={`/data/explore/${dataset.slug}`}>{renderChart()}</Link>
      </Media>

      {/* INFO */}
      <div className="info">
        <div className="detail">
          {/* Title */}
          <div className="title-container">
            <h4>
              <Link href={`/data/explore/${dataset.slug}`} passHref>
                <ForwardLink>
                  {(metadata && metadata.info && metadata.info.name) || dataset.name}
                </ForwardLink>
              </Link>

              {/* Favorite dataset icon */}
              <LoginRequired>
                <Tooltip
                  overlay={<CollectionsPanel resource={dataset} resourceType="dataset" />}
                  overlayClassName="c-rc-tooltip"
                  placement="bottomRight"
                  trigger="click"
                  getTooltipContainer={getTooltipContainer}
                  monitorWindowResize
                >
                  <button type="button" className="c-btn favourite-button">
                    <Icon name={starIconName} className={starIconClass} />
                  </button>
                </Tooltip>
              </LoginRequired>
            </h4>
          </div>

          {/* Source */}
          <div className="metadata-container">
            {metadata && metadata.source && (
              <p>
                Source: &nbsp;
                {metadata.source}
              </p>
            )}
          </div>

          {/* Last update */}
          <div className="last-update-container">
            {dateLastUpdated && (
              <p>
                Last update: &nbsp;
                {dateLastUpdated}
              </p>
            )}
          </div>

          {!!tags && React.cloneElement(tags, { ...props })}
        </div>

        {!!actions && React.cloneElement(actions, { ...props })}
      </div>
    </div>
  );
};

DatasetListItem.defaultProps = {
  mode: 'grid',
  widget: null,
  layer: null,
  metadata: null,
  tags: null,
  actions: null,
};

DatasetListItem.propTypes = {
  dataset: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    dataLastUpdated: PropTypes.string,
  }).isRequired,
  widget: PropTypes.shape({
    widgetConfig: PropTypes.shape({
      type: PropTypes.string,
    }),
  }),
  layer: PropTypes.shape({}),
  metadata: PropTypes.shape({
    source: PropTypes.string,
    info: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
  mode: PropTypes.string,
  user: PropTypes.shape({
    token: PropTypes.string,
  }).isRequired,
  tags: PropTypes.node,
  actions: PropTypes.node,
};

export default DatasetListItem;
