import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { toastr } from 'react-redux-toastr';

// components
import AreasForm from 'components/areas/form';

// services
import { createGeostore } from 'services/geostore';
import { createArea } from 'services/areas';

// utils
import { logEvent } from 'utils/analytics';

const AreasNew = ({ token }) => {
  const router = useRouter();
  const handleRedirect = useCallback(() => {
    router.push('/myrw/areas');
  }, [router]);

  const handleSubmit = useCallback(async (form) => {
    const { geojson, name, geostore } = form;
    if (geojson) {
      try {
        const { id: geostoreId } = await createGeostore(geojson);

        await createArea(name, geostoreId, token);
        logEvent('My RW', 'Create area', name);
        toastr.success('Area created successfully', 'You will be redirected to your areas.', {
          timeOut: 2000,
          onHideComplete: handleRedirect,
        });
      } catch (e) {
        toastr.error('There was an error creating the area.');
      }
    }
    // country flow
    if (geostore) {
      try {
        await createArea(name, geostore, token);
        logEvent('My RW', 'Create area', name);
        toastr.success('Area created successfully', 'You will be redirected to your areas.', {
          timeOut: 2000,
          onHideComplete: handleRedirect,
        });
      } catch (e) {
        toastr.error('There was an error creating the area.');
      }
    }
  }, [token, handleRedirect]);

  return (<AreasForm onSubmit={handleSubmit} />);
};

AreasNew.propTypes = {
  token: PropTypes.string.isRequired,
};

export default AreasNew;
