import React, { useEffect, useState } from 'react';

// Components
import Spinner from 'components/ui/Spinner';
import Select from 'react-select';

// Services
import { fetchCountries } from 'services/geostore';

// Styles
import './styles.scss';

function EnergyCountryExplorer(props) {

    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState(null);

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

    const handleCountrySelected = (value) => {
        setSelectedCountry(value);
    };    

    return (
        <div className="c-energy-country-explorer">
            <Spinner className="-light" isLoading={loading} />
            <div className="country-selector">
                <Select
                    options={countries}
                    className="-fluid"
                    onChange={handleCountrySelected}
                    placeholder="Select a country"
                />
            </div>
            {selectedCountry &&
                <div className="content">
                    <div className="country-container section">
                        <h2>{selectedCountry.label}</h2>
                    </div>
                    <div className="section">
                        <h3>Energy profile</h3>
                        <h5>Energy production, risks, and impacts</h5>
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
