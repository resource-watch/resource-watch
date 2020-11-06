import React from 'react';
import PropTypes from 'prop-types';

// components
import Spinner from 'components/ui/Spinner';
import CollectionsList from 'components/collections-list';

// hooks
import useFetchCollections from 'hooks/collection/fetch-collections';

const CollectionsIndex = ({
  token,
}) => {
  const {
    data: collections,
    isFetching,
    isSuccess,
    refetch,
  } = useFetchCollections(
    token,
    {
      initialData: [],
      initialStale: true,
    },
  );

  return (
    <>
      {isFetching && (
        <Spinner
          isLoading
          className="-transparent"
        />
      )}
      {isSuccess && (
        <CollectionsList
          collections={collections}
          onRowDelete={refetch}
        />
      )}
    </>
  );
};

CollectionsIndex.propTypes = {
  token: PropTypes.string.isRequired,
};

export default CollectionsIndex;
