import { useMutation, useQueryClient, MutationObserverOptions } from 'react-query';

// services
import {
  addResourceToCollection,
  removeResourceFromCollection,
  createCollection,
  deleteCollection,
} from 'services/collections';

// hooks
import { useMe } from 'hooks/user';

// utils
import { logEvent } from 'utils/analytics';

import type { Collection, Resource } from 'types/collection';
export interface CollectionParams {
  resource: Resource;
  collection: string;
}

const addCollection = ({
  token,
  collection,
}: {
  token: string;
  collection: Pick<Collection, 'name' | 'env' | 'resources' | 'application'>;
}) => createCollection(token, collection);

const removeCollection = ({ token, collection }: { token: string; collection: string }) =>
  deleteCollection(token, collection);

const addToCollection = ({ resource, token, collection }) =>
  addResourceToCollection(token, collection, resource);

const removeFromCollection = ({ resource, token, collection }) =>
  removeResourceFromCollection(token, collection, resource);

export const useAddToCollection = (
  queryConfig: MutationObserverOptions<Collection, Error, CollectionParams> = {},
) => {
  const queryClient = useQueryClient();
  const { data: user } = useMe();

  return useMutation<Collection, Error, CollectionParams>(
    ({ resource, collection }) => addToCollection({ resource, collection, token: user.token }),
    {
      onMutate: () => {
        const previousCollections = queryClient.getQueryData<Collection[]>('fetch-collections');

        return { previousCollections };
      },
      onSuccess: async (data, variables) => {
        logEvent('Collections', `user adds ${variables.resource.type} to collection`);
        await queryClient.invalidateQueries('fetch-collections');
      },
      onError: async (error, variables, context: { previousCollections: Collection[] }) => {
        queryClient.setQueryData('fetch-collections', context.previousCollections);
        throw new Error(
          `There was an error adding the resource "${variables.resource.id}" with type "${variables.resource.type}" to the collection ${variables.collection}: ${error.message}`,
        );
      },
      onSettled: async () => {
        await queryClient.invalidateQueries('fetch-collections');
      },
      ...queryConfig,
    },
  );
};

export const useRemoveFromCollection = (
  queryConfig: MutationObserverOptions<Collection, Error, CollectionParams> = {},
) => {
  const queryClient = useQueryClient();
  const { data: user } = useMe();

  return useMutation<Collection, Error, CollectionParams>(
    ({ resource, collection }) => removeFromCollection({ resource, collection, token: user.token }),
    {
      onMutate: () => {
        const previousCollections = queryClient.getQueryData<Collection[]>('fetch-collections');

        return { previousCollections };
      },
      onSuccess: async (data, variables) => {
        logEvent('Collections', `user removes ${variables.resource.type} from collection`);
        await queryClient.invalidateQueries('fetch-collections');
      },
      onError: async (error, variables, context: { previousCollections: Collection[] }) => {
        queryClient.setQueryData('fetch-collections', context.previousCollections);
        throw new Error(
          `There was an error removing the resource "${variables.resource.id}" with type "${variables.resource.type}" to the collection ${variables.collection}: ${error.message}`,
        );
      },
      onSettled: async () => {
        await queryClient.invalidateQueries('fetch-collections');
      },
      ...queryConfig,
    },
  );
};

export const useAddCollection = (
  queryConfig: MutationObserverOptions<
    Pick<Collection, 'name' | 'env' | 'resources' | 'application'>,
    Error,
    { token: string; collection: Collection }
  > = {},
) => {
  const queryClient = useQueryClient();
  const { data: user } = useMe();

  return useMutation<
    Collection,
    Error,
    { collection: Pick<Collection, 'name' | 'env' | 'resources' | 'application'> }
  >(({ collection }) => addCollection({ collection, token: user.token }), {
    onSuccess: async () => {
      logEvent('Collections', 'user adds a new collection');
      await queryClient.invalidateQueries('fetch-collections');
    },
    onError: (error, variables) => {
      throw new Error(
        `There was an error adding the collection "${variables.collection.name}": ${error.message}`,
      );
    },
    ...queryConfig,
  });
};

export const useRemoveCollection = (
  queryConfig: MutationObserverOptions<
    Collection,
    Error,
    { token: string; collection: string }
  > = {},
) => {
  const queryClient = useQueryClient();

  const { data: user } = useMe();

  return useMutation<Collection, Error, { collection: string }>(
    ({ collection }) => removeCollection({ collection, token: user.token }),
    {
      onSuccess: async () => {
        logEvent('Collections', 'user removes a collection');
        await queryClient.invalidateQueries('fetch-collections');
      },
      onError: (error, variables) => {
        throw new Error(
          `There was an error removing the collection "${variables.collection}": ${error.message}`,
        );
      },
      ...queryConfig,
    },
  );
};
