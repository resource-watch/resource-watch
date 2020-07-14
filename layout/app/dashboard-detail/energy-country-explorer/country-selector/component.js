import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Router } from 'routes';

// Components
import Spinner from 'components/ui/Spinner';
import RadioGroup from 'components/form/RadioGroup';
import Field from 'components/form/Field';
import Input from 'components/form/Input';

// Styles
import './styles.scss';

function CountrySelector(props) {
    const {
        loading,
        countries,
        onCountrySelected,
        selectedCountry
    } = props;
    const [filteredCountries, setFilteredCountries] = useState(countries);
    const inputRef = useRef(null);
    const onSearchChange = debounce((search) => {
        if (search && search.length > 1) {
            setFilteredCountries(countries.filter(c =>
                c.label.toLowerCase().indexOf(search.toLowerCase()) >= 0
            ));
        } else {
            setFilteredCountries(countries);
        }
    }, 250);

    useEffect(() => inputRef.current.focus(), []);

    
    return (
        <div className="c-country-selector">
            <Spinner isLoading={loading} className="-light" />
            <div className="overlay" />
            <Field
                className="search-input"
                onChange={value => onSearchChange(value)}
                properties={{
                    name: 'search',
                    type: 'text',
                    placeholder: 'Search',
                    ref: inputRef
                }}
            >
                {Input}
            </Field>
            <div>
                <RadioGroup
                    options={filteredCountries}
                    name="countries"
                    properties={{
                        ...(selectedCountry && { default: selectedCountry })
                    }}
                    onChange={(value) => {
                        onCountrySelected(value);
                        Router.pushRoute(
                            'dashboards_detail',
                            {
                                country: value,
                                tab: 'country',
                                slug: 'energy'
                            }
                        );
                    }}
                />
            </div>
        </div>
    );
};

CountrySelector.propTypes = {
    countries: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    onCountrySelected: PropTypes.func.isRequired,
    selectedCountry: PropTypes.string
}

CountrySelector.defaultProps = {
    selectedCountry: null
};

export default CountrySelector;