import React, { useEffect, useState } from 'react';
import { toastr } from 'react-redux-toastr';

// Widget editor
import Renderer from '@widget-editor/renderer';

// Components
import Spinner from 'components/ui/Spinner';
import Select from 'react-select';

// Services
import { fetchCountries } from 'services/geostore';
import { fetchWidget } from 'services/widget';
import { fetchCountryPowerExplorerConfig } from 'services/config';

// Styles
import './styles.scss';

// Constants
import { ENERGY_COUNTRY_DASHBOARD_DATA } from './constants';
import PowerGenerationMap from './power-generation-map';

function EnergyCountryExplorer(props) {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
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
        fetchCountryPowerExplorerConfig()
            .then(data => setConfig(data));
        fetchCountries()
            .then((data) => {
                setCountries(data.filter(c => c.name).map(c => ({
                    label: c.name,
                    value: c.iso,
                    geostoreId: c.geostoreId
                })));
                setLoading(false);
            });
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

    console.log('energy_profile', energy_profile);


    return (
        <div className="c-energy-country-explorer">
            <div className="l-section country-section">
                <div className="l-container">
                    <div className="row">
                        <div className="column small-12">
                            <div className="country-selector">
                                <Spinner className="-light" isLoading={loading} />
                                <Select
                                    options={countries}
                                    className="country-selector -fluid"
                                    onChange={handleCountrySelected}
                                    placeholder="Select a country"
                                    value={selectedCountry}
                                />
                            </div>
                            {selectedCountry &&
                                <div className="country-overview" >
                                    <h3>Country overview</h3>
                                </div>
                            }
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
