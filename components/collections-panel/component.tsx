import { useState, useCallback, MouseEvent, KeyboardEvent } from 'react';
import { toastr } from 'react-redux-toastr';

// components
import CollectionPanelItem from 'components/collections-panel/collections-panel-item/component';

// hooks
import { useMe } from 'hooks/user';
import useFetchCollections from 'hooks/collection/fetch-collections';
import { useIsFavorite } from 'hooks/favorite';
import { useAddToCollection, useRemoveFromCollection, useAddCollection } from 'hooks/collection';
import { useSaveFavorite, useDeleteFavorite } from 'hooks/favorite';

// types
import type { Collection, Resource } from 'types/collection';
import type { API_ENVS, RESOURCE_TYPES, ANY_RESOURCE } from 'types';

const FAVOURITES_COLLECTION: Pick<Collection, 'id' | 'name' | 'resources'> = {
  id: '0',
  name: 'Favorites',
  resources: [],
};

export interface CollectionsPanelProps {
  resource: ANY_RESOURCE;
  resourceType: RESOURCE_TYPES;
  onKeyPress?: (evt: KeyboardEvent<HTMLDivElement>) => void;
  onClick?: (evt: MouseEvent<HTMLDivElement>) => void;
  onToggleFavorite?: (isFavorite: boolean, resource: ANY_RESOURCE) => void;
  onToggleCollection?: (isAdded: boolean, resource: Resource) => void;
}

const CollectionsPanel = ({
  resource,
  resourceType,
  onKeyPress,
  onClick,
  onToggleFavorite,
  onToggleCollection,
}: CollectionsPanelProps): JSX.Element => {
  const { data: user } = useMe();
  const { mutate: mutateAddToCollection } = useAddToCollection({
    onSuccess: async (updatedCollection, variables) => {
      if (onToggleCollection) onToggleCollection(true, variables.resource);
    },
  });
  const { mutate: mutateRemoveFromCollection } = useRemoveFromCollection({
    onSuccess: async (updatedCollection, variables) => {
      if (onToggleCollection) onToggleCollection(false, variables.resource);
    },
  });
  const { mutate: mutateAddCollection } = useAddCollection();
  const { mutate: mutateAddFavorite } = useSaveFavorite({
    onSuccess: async (updatedFavorite, variables) => {
      if (onToggleFavorite) onToggleFavorite(true, updatedFavorite);
    },
  });
  const { mutate: mutateRemoveFavorite } = useDeleteFavorite({
    onSuccess: async (updatedFavorite, variables) => {
      if (onToggleFavorite) onToggleFavorite(false, updatedFavorite);
    },
  });
  const [newCollectionState, setNewCollectionState] = useState({
    newCollectionName: '',
  });
  const { data: collections, isSuccess: isCollectionsSuccess } = useFetchCollections(
    user?.token,
    {
      sort: 'name',
    },
    {
      initialData: [],
      initialStale: true,
    },
  );
  const { data: favorite, isSuccess: isFavoriteSuccess } = useIsFavorite(resource.id, user?.token);
  const isSuccess = isCollectionsSuccess || isFavoriteSuccess;

  const onAddCollection = useCallback(async () => {
    const { newCollectionName } = newCollectionState;

    if (newCollectionName && newCollectionName !== '') {
      if (newCollectionName.toLowerCase() === 'favourites') {
        toastr.error('Duplicated Favourites list', 'You cannot duplicate this list.');
      } else {
        try {
          mutateAddCollection({
            collection: {
              name: newCollectionName,
              env: process.env.NEXT_PUBLIC_API_ENV as API_ENVS,
              application: process.env.NEXT_PUBLIC_APPLICATIONS,
              resources: [] as Resource[],
            },
          });
        } catch (e) {
          toastr.error(e.message);
        }
      }
    } else {
      toastr.error('Please enter a collection name');
    }
  }, [mutateAddCollection, newCollectionState]);

  const handleToggleFavorite = useCallback(async () => {
    if (favorite) {
      try {
        mutateRemoveFavorite({ favoriteId: favorite.id });
      } catch (e) {
        toastr.error(e.message);
      }
    } else {
      try {
        mutateAddFavorite({
          favorite: {
            resourceId: resource.id,
            resourceType,
          },
        });
      } catch (e) {
        toastr.error(e.message);
      }
    }
  }, [mutateAddFavorite, mutateRemoveFavorite, resource, resourceType, favorite]);

  const handleToggleCollection = useCallback(
    (isAdded, collection) => {
      const resourcePayload = {
        id: resource.id,
        type: resourceType,
      };

      if (isAdded) {
        try {
          mutateAddToCollection({
            resource: resourcePayload,
            collection: collection.id,
          });
        } catch (e) {
          toastr.error(e.message);
        }
      } else {
        try {
          mutateRemoveFromCollection({
            resource: resourcePayload,
            collection: collection.id,
          });
        } catch (e) {
          toastr.error(e.message);
        }
      }
    },
    [resource, resourceType, mutateAddToCollection, mutateRemoveFromCollection],
  );

  const handleKeyPress = useCallback(
    (evt) => {
      if (evt.key !== 'Enter') return false;
      return onAddCollection();
    },
    [onAddCollection],
  );

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
        <button type="button" className="c-button add-button" onClick={onAddCollection}>
          Add
        </button>
      </div>

      {isSuccess && (
        <div className="collection-list-container">
          <ul className="collection-list">
            <CollectionPanelItem
              key={FAVOURITES_COLLECTION.id}
              collection={FAVOURITES_COLLECTION}
              isChecked={Boolean(favorite)}
              onToggleCollection={handleToggleFavorite}
            />
            {collections.map((collection) => (
              <CollectionPanelItem
                key={collection.id}
                collection={collection}
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

export default CollectionsPanel;
