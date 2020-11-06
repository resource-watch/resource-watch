import React, {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';

// constants
import { EXPLORE_SECTIONS } from 'layout/explore/constants';

// styles
import './styles.scss';

const ExploreAreasOfInterestIntro = ({
  setSidebarSection,
}) => {
  const handleClick = useCallback(() => {
    setSidebarSection(EXPLORE_SECTIONS.ALL_DATA);
  }, [setSidebarSection]);

  return (
    <div className="c-explore-areas-of-interest-intro">
      <h4>Analyse local data</h4>
      <p className="-text-center">
        Use your areas of interest as a filter in the widget editor in any dataset
      </p>
      <button
        type="button"
        className="c-btn -primary"
        onClick={handleClick}
      >
        See all datasets
      </button>
    </div>
  );
};

ExploreAreasOfInterestIntro.propTypes = {
  setSidebarSection: PropTypes.func.isRequired,
};

export default ExploreAreasOfInterestIntro;
