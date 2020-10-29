import React, {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// hooks
import useFetchCollections from 'hooks/collection/fetch-collections';

// services
import { deleteCollection } from 'services/collections';

const DeleteAction = ({
  data: collection,
  token,
}) => {
  const {
    refetch: refetchCollections,
  } = useFetchCollections(token);

  const handleDelete = useCallback(() => {
    toastr.confirm(`Are you sure that you want to delete: "${collection.name}"`, {
      onOk: async () => {
        try {
          await deleteCollection(token, collection.id);
          toastr.success('Success', 'Collection successfully removed.');
          refetchCollections();
        } catch (e) {
          toastr.error('Error', 'Could not remove collection at this time.');
        }
      },
    });
  }, [token, collection, refetchCollections]);

  return (
    <button
      type="button"
      className="c-btn"
      onClick={handleDelete}
    >
      Remove
    </button>
  );
};

DeleteAction.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  token: PropTypes.string.isRequired,
};

export default DeleteAction;
