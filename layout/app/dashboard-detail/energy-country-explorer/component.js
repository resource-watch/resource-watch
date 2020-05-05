import React, { useEffect, useState } from 'react';

// Components
import Spinner from 'components/ui/Spinner';
import { Tooltip } from 'vizzuality-components';
import CountrySelector from './country-selector';

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
    const [countries, setCountries] = useState({
        loading: true,
        list: []
    });
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        energy_profile: {
            map: null,
            loading: false
        }
    });
    const [config, setConfig] = useState(null);
    const { energy_profile } = dashboardData;

    useEffect(() => {
        // Load config
        fetchCountryPowerExplorerConfig()
            .then(data => setConfig(data));
        
        // Load countries
        WRIAPI.get('query/a86d906d-9862-4783-9e30-cdb68cd808b8?sql=SELECT distinct(country_long) FROM powerwatch_data_20180102 ORDER BY country_long ASC')
            .then((data) => {
              setCountries({
                loading: false,
                list: data.data.data.map(c => ({ label: c.country_long, value: c.country_long }))
              });
            })
            .catch(err => toastr.error('Error loading countries'));
        // fetchCountries()
        //     .then((data) => {
        //         setCountries(data.filter(c => c.name).map(c => ({
        //             label: c.name,
        //             value: c.iso,
        //             geostoreId: c.geostoreId
        //         })));
        //         setLoading(false);
        //     });
    }, []);

    // useEffect(() => {
    //     const energyProfileMapWidget = ENERGY_COUNTRY_DASHBOARD_DATA.energy_profile.map_widget;
    //     fetchWidget(energyProfileMapWidget)
    //         .then((data) => {
    //             setDashboardData({ 
    //                 ...dashboardData,
    //                 energy_profile: {
    //                     map: data,
    //                     loading: false
    //                 }
    //             })
    //         })
    //         .catch(err => toastr.error('Error loading widget', err));
    // }, [selectedCountry]);

    const handleCountrySelected = (value) => {
        setSelectedCountry(value);
    };

    const handleSelectCountryClick = () => {

    }

    const countryName = selectedCountry ? selectedCountry : 'Select a country';
    const countryText = selectedCountry ? selectedCountry : `Start by Lorem ipsum dolor sit amet, 
        consectetuer adipiscing elit. 
        Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. 
        Suspendisse urna nibh.`;

    console.log('countries', countries);
    

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
                                            overlay={
                                                <CountrySelector 
                                                    countries={countries.list}
                                                    loading={countries.loading} 
                                                />
                                            }
                                            overlayClassName="c-rc-tooltip -default -no-max-width"
                                            placement="bottom"
                                            trigger="click"
                                        >
                                            <button
                                                className="c-btn -secondary"
                                                tabIndex={-1}
                                            >
                                                Select country
                                            </button>
                                        </Tooltip>
                                    </div>
                                </div>
                                <div className="country-indicators">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {selectedCountry &&
                <div className="l-section">
                    <div className="l-container">
                        <div className="row">
                            <div className="column small-12">
                                <div className="section energy-profile">
                                    <h3>Power generation resilience and impacts</h3>
                                    <h5>Power mix profile, resilience to extreme natural events and impacts 
                                        from power generation
                                    </h5>
                                    <PowerGenerationMap selectedCountry={selectedCountry} />
                                </div>
                                <div className="section">
                                    <h3>Energy mix</h3>
                                </div>
                                <div className="section">
                                    <h3>GHG emissions</h3>
                                </div>
                                <div className="section">
                                    <h3>Socio economic indicators</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default EnergyCountryExplorer;
