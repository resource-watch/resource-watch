import React from 'react';
import PropTypes from 'prop-types';

// Components
import { Tooltip } from 'vizzuality-components';
import IndicatorTooltip from 'layout/app/dashboard-detail/energy-country-explorer/country-indicators/indicator-card/indicator-tooltip';

// styles
import './styles.scss';

function RankingBar(props) {
  const { count, ranking, showPoint } = props;

  const pointPosition = ranking * 100 / count;

  return (
    <div className="c-ranking-bar">
      <div className="bar">
        {showPoint &&
          <Tooltip
            overlay={
              <IndicatorTooltip
                count={count}
                ranking={ranking}
              />
            }
            overlayClassName="c-rc-tooltip -default"
            placement="top"
            trigger={['hover']}
            mouseLeaveDelay={0}
            destroyTooltipOnHide
          >
            <div
              className="point"
              style={{ left: `${pointPosition}%` }}
            />
          </Tooltip>
        }
      </div>
    </div>
  );
}

RankingBar.propTypes = {
  indicator: PropTypes.object.isRequired,
  country: PropTypes.object.isRequired,
  showPoint: PropTypes.bool.isRequired
};

export default RankingBar;
