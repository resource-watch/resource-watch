import React, { useEffect, useState } from 'react';

// Widget editor
import Renderer from '@widget-editor/renderer';

// Components
import Spinner from 'components/ui/Spinner';
import Select from 'react-select';

// Services
import { fetchCountries } from 'services/geostore';
import { fetchWidget } from 'services/widget';

// Styles
import './styles.scss';

// Constants
import { ENERGY_COUNTRY_DASHBOARD_DATA } from './constants';

function EnergyCountryExplorer(props) {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        energy_profile: {
            map: null,
            loading: true
        }
    });
    const { energy_profile } = dashboardData;

    useEffect(() => {
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

    useEffect(() => {
        const energyProfileMapWidget = ENERGY_COUNTRY_DASHBOARD_DATA.energy_profile.map_widget;
        fetchWidget(energyProfileMapWidget)
            .then((data) => {
                setDashboardData({ 
                    ...dashboardData,
                    energy_profile: {
                        map: data,
                        loading: false
                    }
                })
            });
    }, [selectedCountry]);

    const handleCountrySelected = (value) => {
        setSelectedCountry(value);
    };    

    console.log('energy_profile', energy_profile);
    

    return (
        <div className="c-energy-country-explorer">
            <Spinner className="-light" isLoading={loading} />
            <div className="country-selector">
                <Select
                    options={countries}
                    className="-fluid"
                    onChange={handleCountrySelected}
                    placeholder="Select a country"
                    value={selectedCountry}
                />
            </div>
            {selectedCountry &&
                <div className="content">
                    <div className="country-container section">
                        <h2>{selectedCountry.label}</h2>
                    </div>
                    <div className="section energy-profile">
                        <h3>Energy profile</h3>
                        <h5>Energy production, risks, and impacts</h5>
                        <Spinner isLoading={energy_profile.loading} className="-light" />
                        {energy_profile.map && 
                            <div className="energy-profile-map">
                                {/* <Renderer widgetConfig={energy_profile.map.widgetConfig} /> */}
                                <iframe src="http://localhost:9000/embed/data/explore?section=All%20data&zoom=3&lat=44.192861132493526&lng=12.216796875010317&pitch=0&bearing=0&basemap=dark&labels=light&layers=%255B%257B%2522dataset%2522%253A%2522a86d906d-9862-4783-9e30-cdb68cd808b8%2522%252C%2522opacity%2522%253A1%252C%2522layer%2522%253A%25222a694289-fec9-4bfe-a6d2-56c3864ec349%2522%257D%255D&page=1&sort=most-viewed&sortDirection=-1" width="100%" height="500px" frameBorder="0" />
                            </div>
                        }
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
            }
        </div>
    );
};

export default EnergyCountryExplorer;
