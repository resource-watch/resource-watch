import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

// Components
import { Tooltip } from 'vizzuality-components';
import CountrySelector from './country-selector';
import CustomSection from './custom-section';
import CountryIndicators from './country-indicators';

// Services
import { fetchCountryPowerExplorerConfig } from 'services/config';

// Constants
import { WORLD_COUNTRY, US_COUNTRY_VALUES } from './constants';

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
  const [selectedCountryBbox, setSelectedCountryBbox] = useState(null);
  const [selectedCountryGeojson, setSelectedCountryGeojson] = useState(null);

  useEffect(() => {
    // Load config
    fetchCountryPowerExplorerConfig()
      .then(data => setConfig(data))
      .catch(err => {
        toastr.error('Error loading configuration file');
        console.error(err);
      });

    // Load countries
    axios.get('https://api.resourcewatch.org/v1/query/a86d906d-9862-4783-9e30-cdb68cd808b8?sql=SELECT distinct(country_long) as country, country as iso FROM powerwatch_data_20180102 ORDER BY country_long ASC')
      .then((data) => {
        setCountries({
          loading: false,
          list: [
            WORLD_COUNTRY,
            ...data.data.data.map(c => ({ label: c.country, value: c.iso }))
          ]
        });
      })
      .catch(err => toastr.error('Error loading countries', err));
    
    loadSelectedCountry();
  }, []);

  useEffect(() => {
    loadSelectedCountry();
  }, [selectedCountry]);

  const loadSelectedCountry = () => {    
    if (selectedCountry && selectedCountry !== WORLD_COUNTRY.value) {
      if (selectedCountry === 'USA') {
        setSelectedCountryBbox(US_COUNTRY_VALUES.bbox);
      } else {
        axios.get(`https://api.resourcewatch.org/v2/geostore/admin/${selectedCountry}`)
        .then((data) => {        
          const atts = data.data.data.attributes;          
          setSelectedCountryBbox(atts.bbox);
          setSelectedCountryGeojson(atts.geojson);
        })
        .catch(err => toastr.error(`Error loading country: ${selectedCountry}`, err));
      }
    } else {
      setSelectedCountryBbox(WORLD_COUNTRY.bbox);
      setSelectedCountryGeojson(null);
    }
  };

  const selectedCountryIsWorld = selectedCountry === WORLD_COUNTRY.value || !selectedCountry;

  const selectedCountryObj = selectedCountry ?
    countries.list.find(c => c.value === selectedCountry) :
    WORLD_COUNTRY;
  
  const showCustomSections = config && (!selectedCountry || (selectedCountryObj && 
    (selectedCountryIsWorld || (!selectedCountryIsWorld && selectedCountryBbox))));  
    
  const ndcsURL = `https://www.climatewatchdata.org/embed/countries/${selectedCountry}/ndc-content-overview?isNdcp=true#ndc-content-overview`;

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
                      {selectedCountryObj && selectedCountryObj.label}
                    </h1>
                    <ReactMarkdown linkTarget="_blank" source={config && config.countrySelector.mainText} />
                    <Tooltip
                      visible={tooltipOpen}
                      overlay={
                        <CountrySelector
                          countries={countries.list}
                          loading={countries.loading}
                          onCountrySelected={() => setTooltipOpen(false)}
                          selectedCountry={selectedCountry || WORLD_COUNTRY}
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

      {/* ------- CUSTOM SECTIONS ---------- */}
      {showCustomSections &&
                config.sections.map(section =>
                  (<CustomSection
                    section={section}
                    bbox={selectedCountryBbox}
                    geojson={selectedCountryGeojson}
                    country={selectedCountryObj}
                    key={`section-${section.header}`}
                  />))
            }
      {/* ------- NDCs ---------- */}
      {!selectedCountryIsWorld &&
        <div className="ndcs-container l-container">
          <div className="row">
            <div className="column small-12">
            <iframe
              title="NDC targets" 
              src={ndcsURL}
              width="100%"
              height="600px"
              frameBorder="0"
            />
            </div>
          </div>
        </div>
      }
    </div>
  );
}

EnergyCountryExplorer.propTypes = { selectedCountry: PropTypes.string };

EnergyCountryExplorer.defaultProps = { selectedCountry: null };

export default EnergyCountryExplorer;
