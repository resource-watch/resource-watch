import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { Router } from 'routes';

// Services
import { fetchDataset } from 'services/dataset';

// Components
import Spinner from 'components/ui/Spinner';

// Styles
import './styles.scss';

function InfoTooltip(props) {
    const { datasetID, dataYear } = props;
    const [ dataset, setDataset ] = useState({
        loading: true,
        value: null
    });

    const metadataObj = dataset.value && dataset.value.metadata[0];
    const datasetName = metadataObj && metadataObj.info.name;
    const datasetDescription = metadataObj && metadataObj.info.functions;

    useEffect(() => {
        fetchDataset(datasetID, { includes: 'metadata' })
            .then(data => setDataset({
                loading: false,
                value: data
            }))
            .catch(err => toastr.error(`Error loading dataset ${datasetID}`, err));
    }, [datasetID]);    

    return (
        <div className="c-info-tooltip">
            <Spinner isLoading={dataset.loading} className="-light" />
            {!dataset.loading &&
                <Fragment>
                    <h3>{datasetName}</h3>
                    <div>
                        <strong>Data year: </strong>
                        {dataYear}
                    </div>
                    <div className="description">
                        <p>{datasetDescription}</p>
                    </div>
                    <div className="actions">
                        <button
                            className="c-button -primary -compressed -fs-tiny"
                            onClick={() => Router.pushRoute('explore', { dataset: datasetID }) }
                        >
                            More info
                        </button>
                    </div>
                </Fragment>
            }
        </div>
    );
};

InfoTooltip.propTypes = {
    datasetID: PropTypes.string.isRequired,
    dataYear: PropTypes.string.isRequired
};

export default InfoTooltip;