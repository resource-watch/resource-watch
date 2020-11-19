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
      <h4 className="-text-center">
        Analyze data in the areas
        <br />
        you&apos;re most interested in
      </h4>
      <p className="-text-center">
        Use your areas of interest as a &quot;geographic filter&quot;
        in the custom visualization creator for any of the datasets in the catalog.
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
