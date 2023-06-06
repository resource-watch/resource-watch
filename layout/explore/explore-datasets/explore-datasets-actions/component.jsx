import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import Icon from 'components/ui/icon';
import LoginRequired from 'components/ui/login-required';

// Tooltip
import { Tooltip } from 'vizzuality-components';
import CollectionsPanel from 'components/collections-panel';
import { getTooltipContainer } from 'utils/tooltip';

// hooks
import useBelongsToCollection from 'hooks/collection/belongs-to-collection';
import useFetchCollection from 'hooks/collection/fetch-collection';

const ExploreDatasetsActions = (props) => {
  const {
    dataset,
    layer,
    user,
    selectedCollection,
    layerGroups,
    toggleMapLayerGroup,
    resetMapLayerGroupsInteraction,
  } = props;
  const { isInACollection } = useBelongsToCollection(dataset.id, user.token);
  const { refetch } = useFetchCollection(
    selectedCollection,
    user.token,
    {},
    {
      enabled: !!(selectedCollection && user.token),
    },
  );
  const isActive = useMemo(
    () => !!layerGroups.find((l) => l.dataset === dataset.id),
    [dataset, layerGroups],
  );

  const handleToggleLayerGroup = useCallback(
    (event) => {
      event.stopPropagation();

      toggleMapLayerGroup({ dataset, toggle: !isActive });
      resetMapLayerGroupsInteraction();
    },
    [isActive, dataset, toggleMapLayerGroup, resetMapLayerGroupsInteraction],
  );

  const handleToggleFavorite = useCallback(() => {
    if (selectedCollection) refetch();
  }, [selectedCollection, refetch]);

  const handleToggleCollection = useCallback(() => {
    if (selectedCollection) refetch();
  }, [selectedCollection, refetch]);

  const userIsLoggedIn = user.token;
  const datasetName = dataset?.metadata[0]?.info?.name;

  const starIconName = classnames({
    'icon-star-full': isInACollection,
    'icon-star-empty': !isInACollection,
  });
  const starIconClass = classnames({
    '-small': true,
    '-filled': true,
    '-empty': !isInACollection,
  });

  return (
    <div className="c-explore-datasets-actions">
      <button
        className={classnames({
          'c-button': true,
          '-secondary': !isActive,
          '-primary': isActive,
          '-compressed': true,
          '-disable': !layer,
          '-fullwidth': true,
        })}
        type="button"
        disabled={!layer}
        onClick={handleToggleLayerGroup}
      >
        {isActive ? 'Active' : 'Add to map'}
      </button>
      <LoginRequired>
        <Tooltip
          overlay={
            <CollectionsPanel
              resource={dataset}
              resourceType="dataset"
              onClick={(e) => e.stopPropagation()}
              onKeyPress={(e) => e.stopPropagation()}
              onToggleFavorite={handleToggleFavorite}
              onToggleCollection={handleToggleCollection}
            />
          }
          overlayClassName="c-rc-tooltip"
          placement="bottomRight"
          trigger="click"
          getTooltipContainer={getTooltipContainer}
          monitorWindowResize
        >
          <button
            type="button"
            className="c-button -secondary -compressed"
            tabIndex={-1}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <Icon name={starIconName} className={starIconClass} />
          </button>
        </Tooltip>
      </LoginRequired>
    </div>
  );
};

ExploreDatasetsActions.defaultProps = {
  selectedCollection: null,
};

ExploreDatasetsActions.propTypes = {
  dataset: PropTypes.shape({
    id: PropTypes.string.isRequired,
    metadata: PropTypes.arrayOf(
      PropTypes.shape({
        info: PropTypes.shape({
          name: PropTypes.string,
        }),
      }),
    ),
  }).isRequired,
  layer: PropTypes.shape({}).isRequired,
  selectedCollection: PropTypes.string,
  layerGroups: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  toggleMapLayerGroup: PropTypes.func.isRequired,
  resetMapLayerGroupsInteraction: PropTypes.func.isRequired,
  user: PropTypes.shape({
    token: PropTypes.string,
  }).isRequired,
};

export default ExploreDatasetsActions;
