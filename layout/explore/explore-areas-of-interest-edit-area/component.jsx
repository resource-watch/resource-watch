import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

// components
import Icon from 'components/ui/icon';
import Spinner from 'components/ui/Spinner';
import ExploreAreaForm from 'layout/explore/explore-areas-of-interest/form';

// services
import { updateArea } from 'services/areas';

// hooks
import useUserArea from 'hooks/user-areas/user-area';

// styles
import './styles.scss';

const ExploreAreasOfInterestEditArea = ({
  token,
  selectedAoI,
  clearSidebarSubsection,
}) => {
  const {
    data: area,
    isFetching,
    isSuccess,
  } = useUserArea(selectedAoI, token);
  const handleGoBack = useCallback(() => { clearSidebarSubsection(); }, [clearSidebarSubsection]);
  const handleSubmitForm = useCallback(async (form) => {
    const { id } = area;
    const { name, geostore } = form;

    try {
      await updateArea(id, name, token, geostore);
      clearSidebarSubsection();
    } catch (e) {
      // do something
    }
  }, [token, area, clearSidebarSubsection]);
  const handleCancelForm = useCallback(() => {
    clearSidebarSubsection();
  }, [clearSidebarSubsection]);

  return (
    <div className="c-explore-areas-of-interest-new-area">
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
      <h2>Edit Area</h2>
      {isFetching && (
        <Spinner isLoading className="-transparent" />
      )}
      {isSuccess && (
        <ExploreAreaForm
          area={area}
          onSubmit={handleSubmitForm}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
};

ExploreAreasOfInterestEditArea.propTypes = {
  token: PropTypes.string.isRequired,
  selectedAoI: PropTypes.string.isRequired,
  clearSidebarSubsection: PropTypes.func.isRequired,
};

export default ExploreAreasOfInterestEditArea;
