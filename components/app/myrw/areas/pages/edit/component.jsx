import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { toastr } from 'react-redux-toastr';

// components
import AreasForm from 'components/areas/form';
import Spinner from 'components/ui/Spinner';

// utils
import { logEvent } from 'utils/analytics';

// hooks
import useUserArea from 'hooks/user-areas/user-area';

// services
import { updateArea } from 'services/areas';

const AreasEdit = ({ id, token }) => {
  const router = useRouter();
  const {
    data: area,
    isFetching,
    isSuccess,
  } = useUserArea(id, token);

  const handleSubmit = useCallback(({
    name,
    geostore,
  }) => {
    updateArea(id, name, token, geostore)
      .then(() => {
        logEvent('My RW', 'Update area', name);
        router.push('/myrw/areas');
        toastr.success('Success', 'Area successfully updated.');
      })
      .catch(() => {
        toastr.error('There was an error updating the area.');
      });
  }, [router, id, token]);

  return (
    <>
      {isFetching && (
        <Spinner
          isLoading
          className="-transparent"
        />
      )}
      {isSuccess && (
        <AreasForm
          mode="edit"
          area={area}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

AreasEdit.propTypes = {
  id: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};

export default AreasEdit;
