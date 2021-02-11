import React, {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { toastr } from 'react-redux-toastr';

// components
import CollectionsForm from 'components/app/myrw/collections/form/';

// services
import { createCollection } from 'services/collections';

// utils
import { logEvent } from 'utils/analytics';

const CollectionsNew = ({
  token,
}) => {
  const router = useRouter();

  const handleSave = useCallback(async (formState) => {
    const { name } = formState;

    try {
      await createCollection(token,
        {
          name,
          env: process.env.API_ENV,
          application: process.env.APPLICATIONS,
          resources: [],
        });
      logEvent('Myrw Collections', 'Create collection', name);
      toastr.success('Success', 'Collection successfully created');
      router.push('/myrw/collections');
    } catch (e) {
      toastr.error('Error', `Could not create Collection ${name}`);
    }
  }, [token, router]);

  return (<CollectionsForm onSave={handleSave} />);
};

CollectionsNew.propTypes = {
  token: PropTypes.string.isRequired,
};

export default CollectionsNew;
