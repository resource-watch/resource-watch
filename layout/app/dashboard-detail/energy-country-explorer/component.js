import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// Components
import Spinner from 'components/ui/Spinner';
import { Tooltip } from 'vizzuality-components';
import CountrySelector from './country-selector';
import CustomSection from './custom-section';
import CountryIndicators from './country-indicators';

// Services
import { fetchCountryPowerExplorerConfig } from 'services/config';

// Utils
import { WRIAPI } from 'utils/axios';

// Constants
import { ENERGY_COUNTRY_DASHBOARD_DATA } from './constants';
import PowerGenerationMap from './power-generation-map';

// Styles
import './styles.scss';

function EnergyCountryExplorer(props) {
  const { selectedCountry } = props;
  const [countries, setCountries] = useState({
    loading: true,
    list: []
  });
  const [config, setConfig] = useState(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    // Load config
    fetchCountryPowerExplorerConfig()
      .then(data => setConfig(data));

    // Load countries
    WRIAPI.get('https://api.resourcewatch.org/v1/query/a86d906d-9862-4783-9e30-cdb68cd808b8?sql=SELECT distinct(country_long) as country, country as iso FROM powerwatch_data_20180102 ORDER BY country_long ASC')
      .then((data) => {
        setCountries({
          loading: false,
          list: data.data.data.map(c => ({ label: c.country, value: c.iso }))
        });
      })
      .catch(err => toastr.error('Error loading countries'));
  }, []);

  const selectedCountryObj = countries.list.find(c => c.value === selectedCountry);
  const countryName = selectedCountry && !countries.loading ?
    selectedCountryObj.label :
    'Select a country';
  const countryText = `The power sector (also called the electricity sector) is a 
        segment of the global energy sector. Power enables electricity access, but 
        also causes climate change, air pollution, increases water use and faces risks to natural hazards.  
        Select a country to dive into data on national power sectors.`;

  return (
    <div className="c-energy-country-explorer">
      <div className="l-section country-section">
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <div className="country-container">
                <div className="country-selector">
                  <div>
                    <h1>
                        {countryName}
                      </h1>
                    <p>
                        {countryText}
                      </p>
                    <Tooltip
                        visible={tooltipOpen}
                        overlay={
                            <CountrySelector
                                countries={countries.list}
                                loading={countries.loading}
                                onCountrySelected={() => setTooltipOpen(false)}
                                selectedCountry={selectedCountry}
                              />
                                            }
                        overlayClassName="c-rc-tooltip -default -no-max-width"
                        placement="bottom"
                        trigger="click"
                      >
                        <button
                            className="c-btn -secondary"
                            tabIndex={-1}
                            onClick={() => setTooltipOpen(true)}
                          >
                                                Select country
                          </button>
                      </Tooltip>
                  </div>
                </div>
                {selectedCountryObj && config && config.countryIndicators &&
                <CountryIndicators
                  indicators={config.countryIndicators}
                  country={selectedCountryObj}
                />
                                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------- MAP SECTION ---------- */}
      {config && selectedCountry &&
        <div className="l-section">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="section map">
                  <h2>{config.map.header}</h2>
                  <p>{config.map.description}</p>
                  <PowerGenerationMap
                    selectedCountry={selectedCountry}
                    title={config.map.mapTitle}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
            }

      {/* ------- CUSTOM SECTIONS ---------- */}
      {selectedCountry && config &&
                config.sections.map(section =>
                  (<CustomSection
                    header={section.header}
                    description={section.description}
                    widgets={section.widgets}
                  />))
            }
    </div>
  );
}

EnergyCountryExplorer.propTypes = { selectedCountry: PropTypes.string };

EnergyCountryExplorer.defaultProps = { selectedCountry: null };

export default EnergyCountryExplorer;
