import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import d3 from 'd3';

// Components
import Spinner from 'components/ui/Spinner';

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

    useEffect(() => {
        if (indicator) {
            const countryValue = indicator.param === 'ISO' ? country.value : country.label;
            const query = indicator.query.replace(new RegExp(`{${indicator.param}}`, 'g'), `'${countryValue}'`);

            axios.get(query)
                .then((result) => {
                    const rows = result.data.rows;
                    if (rows && rows.length > 0) {
                        const resObj = rows[0];
                        console.log('resObj', resObj);
                        
                        setQueryResult({
                            value: d3.format('.3s')(resObj.x),
                            ranking: resObj.ranking,
                            count: resObj.count
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
                    />
                    <div className="indicator-value">
                        {(queryResult && queryResult.value) || '-'}
                    </div>
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
