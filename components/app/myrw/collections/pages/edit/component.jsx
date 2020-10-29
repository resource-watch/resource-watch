import React, {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { toastr } from 'react-redux-toastr';

// components
import Spinner from 'components/ui/Spinner';
import CollectionsForm from 'components/app/myrw/collections/form';

// services
import { updateCollection } from 'services/collections';

// utils
import { logEvent } from 'utils/analytics';

// hooks
import useFetchCollection from 'hooks/collection/fetch-collection';

const CollectionsEdit = ({
  token,
}) => {
  const router = useRouter();
  const {
    query: {
      id,
    },
  } = router;

  const {
    data: collection,
    isFetching,
    isSuccess,
  } = useFetchCollection(id, token, {}, {
    refetchOnWindowFocus: false,
  });

  const handleSave = useCallback(async (formState) => {
    try {
      const { name } = formState;
      updateCollection(token, collection.id, { name });
      logEvent('Myrw Collections', 'Edit collection', collection.id);
      toastr.success('Success', 'Collection successfully updated');
      router.push('/myrw/collections');
    } catch (e) {
      toastr.error('Error', `Could not edit collection ${collection.id}`);
    }
  }, [token, router, collection]);

  return (
    <>
      {isFetching && (
        <Spinner
          isLoading
          className="-transparent"
        />
      )}
      {isSuccess && (
        <CollectionsForm
          collection={collection}
          onSave={handleSave}
        />
      )}
    </>
  );
};

CollectionsEdit.propTypes = {
  token: PropTypes.string.isRequired,
};

export default CollectionsEdit;
