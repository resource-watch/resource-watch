import React from 'react';
import PropTypes from 'prop-types';

// Components
import Icon from 'components/ui/icon';
import LoginRequired from 'components/ui/login-required';

// Tooltip
import { Tooltip } from 'vizzuality-components';
import CollectionsPanel from 'components/collections-panel';
import { getTooltipContainer } from 'utils/tooltip';

// Styles
import './styles.scss';

function ExploreDetailHeaderComponent(props) {
  const { dataset, setSelectedDataset } = props;


  return (
    <div className="c-explore-detail-header">
      <button
        className="c-btn -primary -compressed"
        onClick={() => setSelectedDataset(null)}
      >
        {'< ALL DATASETS'}
      </button>
      <div className="right-buttons">
        {/* Collections tooltip */}
        <LoginRequired>
          <Tooltip
            overlay={
              <CollectionsPanel
                resource={dataset}
                resourceType="dataset"
              />
            }
            overlayClassName="c-rc-tooltip"
            placement="bottomRight"
            trigger="click"
            getTooltipContainer={getTooltipContainer}
            monitorWindowResize
          >
            <button className="c-btn -secondary -compressed">
              <Icon className="-small" name="icon-star-full" />
              <span>SAVE</span>
            </button>
          </Tooltip>
        </LoginRequired>

        <button className="c-btn -secondary -compressed">
          <Icon className="-small" name="icon-arrow-up-2" />
          <span>SHARE</span>
        </button>
      </div>
    </div>
  );
}

ExploreDetailHeaderComponent.propTypes = {
  dataset: PropTypes.object.isRequired,
  // Store
  setSelectedDataset: PropTypes.func.isRequired
};

export default ExploreDetailHeaderComponent;
