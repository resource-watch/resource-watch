import {
  useState,
  useReducer,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import {
  useQueryClient,
} from 'react-query';
import { toastr } from 'react-redux-toastr';

// components
import CollectionPanelItem from 'components/collections-panel/collections-panel-item/component';

// hooks
import useFetchCollections from 'hooks/collection/fetch-collections';
import useIsFavorite from 'hooks/favorite/is-favorite';

// services
import {
  createCollection,
  addResourceToCollection,
  removeResourceFromCollection,
} from 'services/collections';
import {
  deleteFavourite,
  createFavourite,
} from 'services/favourites';

// constants
import { FAVOURITES_COLLECTION } from './collections-panel-constants';

// reducer
import {
  addToLoadingQueue,
  removeToLoadingQueue,
} from './actions';
import reducer from './reducer';

const CollectionsPanel = ({
  token,
  resource,
  resourceType,
  onKeyPress,
  onClick,
  onToggleFavorite,
  onToggleCollection,
}) => {
  const queryClient = useQueryClient();
  const [newCollectionState, setNewCollectionState] = useState({
    name: '',
  });
  const [collectionQueue, dispatch] = useReducer(reducer, []);
  const {
    data: collections,
    isSuccess: isCollectionsSuccess,
    refetch: refetchCollections,
  } = useFetchCollections(
    token,
    {
      sort: 'name',
    },
    {
      initialData: [],
      initialStale: true,
    },
  );
  const {
    isFavorite,
    data: favorite,
    isFetching: isFavoriteFetching,
    isSuccess: isFavoriteSuccess,
    refetch: refetchFavorites,
  } = useIsFavorite(resource.id, token);
  const isSuccess = (isCollectionsSuccess || isFavoriteSuccess);

  const onAddCollection = useCallback(async () => {
    const { newCollectionName } = newCollectionState;

    if (newCollectionName && newCollectionName !== '') {
      if (newCollectionName.toLowerCase() === 'favourites') {
        toastr.error('Duplicated Favourites list', 'You cannot duplicate this list.');
      } else {
        try {
          await createCollection(token,
            {
              name: newCollectionName,
              env: process.env.NEXT_PUBLIC_API_ENV,
              application: process.env.NEXT_PUBLIC_APPLICATIONS,
              resources: [],
            });
          refetchCollections();
        } catch (e) {
          toastr.error(e.message);
        }
      }
    } else {
      toastr.error('Please enter a collection name');
    }
  }, [token, newCollectionState, refetchCollections]);

  const handleToggleFavorite = useCallback(async () => {
    if (isFavorite) {
      try {
        await deleteFavourite(token, favorite.id);
        await refetchFavorites();
      } catch (e) {
        // do something
      }
    } else {
      try {
        await createFavourite(token, ({
          resourceId: resource.id,
          resourceType,
        }));
        await refetchFavorites();
      } catch (e) {
        // do something
      }
    }

    if (onToggleFavorite) onToggleFavorite(!isFavorite, resource);
  }, [token, resource, resourceType, isFavorite, refetchFavorites, favorite, onToggleFavorite]);

  const handleToggleCollection = useCallback(async (isAdded, collection) => {
    const resourcePayload = {
      id: resource.id,
      type: resourceType,
    };

    if (isAdded) {
      try {
        dispatch({ type: addToLoadingQueue, payload: collection.id });
        await addResourceToCollection(token, collection.id, resourcePayload);
        dispatch({ type: removeToLoadingQueue, payload: collection.id });
      } catch (e) {
        // do something
      }
    } else {
      try {
        dispatch({ type: addToLoadingQueue, payload: collection.id });
        await removeResourceFromCollection(token, collection.id, resourcePayload);
        dispatch({ type: removeToLoadingQueue, payload: collection.id });
      } catch (e) {
        // do something
      }
    }

    queryClient.invalidateQueries('fetch-collections');

    if (onToggleCollection) onToggleCollection(isAdded, resource);
  }, [token, resource, resourceType, onToggleCollection, queryClient]);

  const handleKeyPress = useCallback((evt) => {
    if (evt.key !== 'Enter') return false;
    return onAddCollection();
  }, [onAddCollection]);

  const handleInputChange = useCallback((evt) => {
    setNewCollectionState({
      newCollectionName: evt.currentTarget.value,
    });
  }, []);

  return (
    <div
      className="c-collections-panel"
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }
      }}
      onKeyPress={(e) => {
        if (onKeyPress) {
          onKeyPress(e);
        }
      }}
    >
      <div className="new-collection-container">
        <input
          type="text"
          name="new-collection"
          className="new-collection-input"
          placeholder="New collection"
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <button
          type="button"
          className="c-button add-button"
          onClick={onAddCollection}
        >
          Add
        </button>
      </div>

      {isSuccess && (
        <div className="collection-list-container">
          <ul className="collection-list">
            <CollectionPanelItem
              key={FAVOURITES_COLLECTION.id}
              collection={FAVOURITES_COLLECTION}
              loading={isFavoriteFetching}
              resource={resource}
              resourceType={resourceType}
              isChecked={isFavorite}
              onToggleCollection={handleToggleFavorite}
            />
            {collections.map((collection) => (
              <CollectionPanelItem
                key={collection.id}
                collection={collection}
                loading={
                  !!collectionQueue.find(
                    (collectionId) => collectionId === collection.id,
                  )
                }
                isChecked={collection.resources.some(
                  (collectionResource) => collectionResource.id === resource.id,
                )}
                onToggleCollection={handleToggleCollection}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

CollectionsPanel.defaultProps = {
  onClick: null,
  onKeyPress: null,
  onToggleFavorite: null,
  onToggleCollection: null,
};

CollectionsPanel.propTypes = {
  resource: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  resourceType: PropTypes.oneOf([
    'dataset',
    'layer',
    'widget',
  ]).isRequired,
  onClick: PropTypes.func,
  onKeyPress: PropTypes.func,
  onToggleFavorite: PropTypes.func,
  onToggleCollection: PropTypes.func,
  token: PropTypes.string.isRequired,
};

export default CollectionsPanel;
