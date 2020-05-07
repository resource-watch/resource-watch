import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Router } from 'routes';

// Components
import Spinner from 'components/ui/Spinner';

// Styles
import './styles.scss';

function CountrySelector(props) {
    const { loading, countries } = props;
    const [ filteredCountries, setFilteredCountries ] = useState(countries);    

    const onSearchChange = debounce((search) => {        
        if (search && search.length > 1) {
            setFilteredCountries(countries.filter(c => 
                c.value.toLowerCase().indexOf(search.toLowerCase()) >= 0
            ));
        } else {
            setFilteredCountries(countries);
        }
    }, 250);

    return (
        <div className="c-country-selector">
            <Spinner isLoading={loading} className="-light" />
            <div className="overlay" />
            <input
                className="search-input"
                placeholder="Search"
                onChange={(e) => onSearchChange(e.target.value)}
            />
            <ul>
                { filteredCountries.map(c =>
                    <li>
                        <input 
                            type="radio" 
                            value={c.value} 
                            name="countries"
                            id={c.value}
                            onClick={() => {
                                Router.pushRoute(
                                    'dashboards_detail', 
                                    { 
                                        country: c.value, 
                                        tab: 'country',
                                        slug: 'energy'
                                    }
                                );
                            }}
                        />
                        <label for={c.value}>{c.value}</label>
                    </li>
                )}
            </ul>
        </div>
    );
};

CountrySelector.propTypes = {
    countries: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired
}

export default CountrySelector;