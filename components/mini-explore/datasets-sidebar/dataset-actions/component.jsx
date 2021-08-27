import {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Tooltip } from 'vizzuality-components';

// Components
import Icon from 'components/ui/icon';
import LoginRequired from 'components/ui/login-required';
import CollectionsPanel from 'components/collections-panel';

// hooks
import useBelongsToCollection from 'hooks/collection/belongs-to-collection';
import {
  useMe,
} from 'hooks/user';

// utils
import { logEvent } from 'utils/analytics';

// styles
import './styles.scss';

const MiniExploreDatasetsActions = (props) => {
  const {
    dataset,
    layer,
    handleAddMap,
  } = props;
  const {
    data: user,
  } = useMe();
  const {
    isInACollection,
    refetch,
  } = useBelongsToCollection(dataset.id, user?.token);

  const handleToggleFavorite = useCallback((isFavorite, resource) => {
    const datasetName = resource?.metadata[0]?.info?.name;

    if (isFavorite) {
      logEvent('Mini Explore Menu', 'Add dataset to favorites', datasetName);
    } else {
      logEvent('Mini Explore Menu', 'Remove dataset from favorites', datasetName);
    }
    refetch();
  }, [refetch]);

  const handleToggleCollection = useCallback((isAdded, resource) => {
    const datasetName = resource?.metadata[0]?.info?.name;

    if (isAdded) {
      logEvent('Mini Explore Menu', 'Add dataset to a collection', datasetName);
    } else {
      logEvent('Mini Explore Menu', 'Remove dataset from a collection', datasetName);
    }
    refetch();
  }, [refetch]);

  const userIsLoggedIn = user?.token;
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

  const onHandleMap = useCallback((evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    handleAddMap(dataset, layer);
  }, [handleAddMap, dataset, layer]);

  return (
    <div className="c-datasets-actions">
      <button
        className={classnames({
          'c-button': true,
          '-secondary': !dataset.active,
          '-primary': dataset.active,
          '-compressed': true,
          '-disable': !layer,
          '-fullwidth': true,
        })}
        type="button"
        disabled={!layer}
        onClick={onHandleMap}
      >
        {dataset.active ? 'Active' : 'Add to map'}
      </button>
      {/* Favorite dataset icon */}
      <LoginRequired
        redirect={false}
        clickCallback={() => {
          if (!userIsLoggedIn) {
            logEvent('Mini Explore Menu', 'Anonymous user Clicks Star', datasetName);
          }
        }}
      >
        <Tooltip
          overlay={(
            <CollectionsPanel
              resource={dataset}
              resourceType="dataset"
              onClick={(e) => e.stopPropagation()}
              onKeyPress={(e) => e.stopPropagation()}
              onToggleFavorite={handleToggleFavorite}
              onToggleCollection={handleToggleCollection}
            />
          )}
          overlayClassName="c-rc-tooltip"
          placement="bottomRight"
          trigger="click"
        >
          <button
            type="button"
            className="c-button -secondary -compressed"
            tabIndex={-1}
            onClick={() => {
              if (userIsLoggedIn) {
                logEvent('Mini Explore Menu', 'Authenticated user Clicks Star', datasetName);
              }
            }}
          >
            <Icon
              name={starIconName}
              className={starIconClass}
            />
          </button>
        </Tooltip>
      </LoginRequired>
    </div>
  );
};

MiniExploreDatasetsActions.defaultProps = {
  dataset: {},
  layer: {},
};

MiniExploreDatasetsActions.propTypes = {
  dataset: PropTypes.shape({
    active: PropTypes.bool,
    id: PropTypes.string,
    metadata: PropTypes.arrayOf(
      PropTypes.shape({
        info: PropTypes.shape({
          name: PropTypes.string,
        }),
      }),
    ),
  }),
  layer: PropTypes.shape({}),
  handleAddMap: PropTypes.func.isRequired,
};

export default MiniExploreDatasetsActions;
