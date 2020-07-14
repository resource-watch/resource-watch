import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

// components
import Spinner from 'components/ui/Spinner';

// styles
import './styles.scss';

function RankingWidget(props) {
    const { widgetConfig } = props;
    const [rankingWidget, setRankingWidget] = useState({
        loading: true,
        data: null
    });
    const { data, loading } = rankingWidget;

    useEffect(() => {
        const { url } = widgetConfig;

        axios.get(url)
            .then((result) => {
                const rows = result.data.rows;
                setRankingWidget({
                    loading: false,
                    data: (rows.length > 0) ? rows[0] : null
                });
            })
            .catch((err) => {
                console.error('Error loading ranking widget', err);
                setRankingWidget({
                    loading: false,
                    data: null
                })
            });

    }, [widgetConfig]);

    return (
        <div className="c-ranking-widget">
            <Spinner
                isLoading={loading}
                className="-light -relative"
            />
            {!loading &&
                <div className="data-container">
                    {data &&
                        <Fragment>
                            <h1>{data.x}</h1>
                            <div className="subtitle">
                                Rank <span className="ranking-value">{data.ranking}</span> of {data.count} countries
                            </div>
                        </Fragment>
                    }
                    {!loading && !data &&
                        <div className="no-data">
                            No data available
                        </div>
                    }
                </div>
            }
        </div>
    );
};

RankingWidget.propTypes = {
    widgetConfig: PropTypes.object.isRequired
};

export default RankingWidget;