import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// components
import Icon from 'components/ui/icon';
import Spinner from 'components/ui/Spinner';
import ExploreAreaForm from 'layout/explore/explore-areas-of-interest/form';

// services
import { createArea } from 'services/areas';
import { createGeostore } from 'services/geostore';

const ExploreAreasOfInterestNewArea = ({
  token,
  drawer,
  clearSidebarSubsection,
  stopDrawing,
  setPreviewAoi,
  setAreaOfInterest,
}) => {
  const [isFetching, setFetching] = useState(false);
  const handleGoBack = useCallback(() => { clearSidebarSubsection(); }, [clearSidebarSubsection]);
  const handleSubmitForm = useCallback(async (form) => {
    const { isDrawing, data } = drawer;
    const { name, geostore } = form;

    setFetching(true);

    try {
      if (isDrawing && data) {
        const { id: geostoreId } = await createGeostore(data);
        await createArea(name, geostoreId, token);
        stopDrawing();
      } else {
        const {
          id: areaId,
        } = await createArea(name, geostore, token);

        setPreviewAoi(null);
        setAreaOfInterest(areaId);
      }

      setFetching(false);
      clearSidebarSubsection();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
      toastr.error('There was an error creating the area');
      setFetching(false);
    }
  }, [token, drawer, stopDrawing, clearSidebarSubsection, setPreviewAoi, setAreaOfInterest]);

  const handleFileAccepted = useCallback(({
    geostore,
  }) => {
    setAreaOfInterest(null);
    setPreviewAoi(geostore);
  }, [setAreaOfInterest, setPreviewAoi]);

  const handleCancelForm = useCallback(() => {
    setPreviewAoi(null);
    clearSidebarSubsection();
  }, [clearSidebarSubsection, setPreviewAoi]);

  useEffect(() => () => {
    if (drawer.isDrawing) stopDrawing();
  },
  [drawer.isDrawing, stopDrawing]);

  return (
    <div className="c-explore-areas-of-interest-new-area">
      {isFetching && (
        <Spinner
          isLoading
          className="-transparent"
        />
      )}
      {!isFetching && (
        <>
          <div className="menu">
            <button
              type="button"
              className="c-btn -primary -compressed -fs-tiny"
              onClick={handleGoBack}
            >
              <Icon name="icon-arrow-left-2" />
              <span>All areas</span>
            </button>
          </div>
          <span className="section-name">Area of Interest</span>
          <h2>New Area</h2>
          <ExploreAreaForm
            onSubmit={handleSubmitForm}
            onFileAccepted={handleFileAccepted}
            onCancel={handleCancelForm}
          />
        </>
      )}
    </div>
  );
};

ExploreAreasOfInterestNewArea.propTypes = {
  token: PropTypes.string.isRequired,
  drawer: PropTypes.shape({
    isDrawing: PropTypes.bool.isRequired,
    data: PropTypes.shape({}),
  }).isRequired,
  clearSidebarSubsection: PropTypes.func.isRequired,
  stopDrawing: PropTypes.func.isRequired,
  setPreviewAoi: PropTypes.func.isRequired,
  setAreaOfInterest: PropTypes.func.isRequired,
};

export default ExploreAreasOfInterestNewArea;
