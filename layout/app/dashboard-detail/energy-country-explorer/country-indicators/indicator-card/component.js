import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import d3 from 'd3';
import { Tooltip } from 'vizzuality-components';

// Components
import Spinner from 'components/ui/Spinner';
import Icon from 'components/ui/icon';
import InfoTooltip from './info-tooltip';

// Constants
import { WORLD_COUNTRY, US_COUNTRY_VALUES } from 'layout/app/dashboard-detail/energy-country-explorer/constants';

// styles
import './styles.scss';
import RankingBar from './ranking-bar/component';

function IndicatorCard(props) {
  const { indicator, country } = props;
  const [queryResult, setQueryResult] = useState({
    value: null,
    ranking: null,
    count: null
  });
  const [loading, setLoading] = useState(true);
  const [countryIsWorld, setCountryIsWorld] = useState(false);

  useEffect(() => {
    if (indicator) {
      let countryValue = indicator.param === 'ISO' ? country.value : country.label;
      const _countryIsWorld = country.value === WORLD_COUNTRY.value;
      // --- This patch is necessary since the country name varies in some cases -----
      if (countryValue === US_COUNTRY_VALUES.nameFoundInSource) {
        countryValue = US_COUNTRY_VALUES.newNameForQueries;
      }
      // -----------------------------------------------------------------------------

      setCountryIsWorld(_countryIsWorld);
      const query = _countryIsWorld ? indicator.worldQuery :
        indicator.query.replace(new RegExp(`{${indicator.param}}`, 'g'), `'${countryValue}'`);

      axios.get(query)
        .then((result) => {
          const rows = result.data.rows;

          if (rows && rows.length > 0) {
            const resObj = rows[0];            
            setQueryResult({
              value: d3.format(indicator.format)(resObj.x).replace('G', 'B'),
              ranking: resObj.ranking,
              count: resObj.count,
              year: resObj.year
            });
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(`Error loading indicator ${indicator.name}`, err);
          setLoading(false);
        });
    }
  }, [country.label, country.value, indicator]);
  
  return (
    <div className="c-indicator-card">
      <Spinner isLoading={loading} className="-light -relative" />
      {!loading &&
        <Fragment>
          <div className="indicator-name">
            {indicator.name}
          </div>
          <RankingBar
            ranking={queryResult && queryResult.ranking}
            count={queryResult && queryResult.count}
            showPoint={!countryIsWorld}
          />
          <div className="indicator-value">
            {(queryResult && queryResult.value) || '-'}
          </div>
          <Tooltip
            overlay={
              <InfoTooltip 
                datasetID={indicator.datasetID}
                dataYear={queryResult && queryResult.year}
              />
            }
            overlayClassName="c-rc-tooltip -default -no-max-width"
            placement="top"
            trigger={['click']}
            mouseLeaveDelay={0}
            destroyTooltipOnHide
          >
            <div
              className="info-button"
              role="button"
              tabIndex={0}
              // onClick={() => handleInfoButtonClicked(indicator.datasetID)}
              // onKeyPress={() => handleInfoButtonClicked(indicator.datasetID)}
            >
              <Icon name="icon-info" />
            </div>
          </Tooltip>

        </Fragment>
      }
    </div>
  );
}

IndicatorCard.propTypes = {
  indicator: PropTypes.object.isRequired,
  country: PropTypes.object.isRequired
};

export default IndicatorCard;
