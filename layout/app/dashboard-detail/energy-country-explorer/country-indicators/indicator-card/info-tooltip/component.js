import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { useRouter } from 'next/router';

// Services
import { fetchDataset } from 'services/dataset';

// Components
import Spinner from 'components/ui/Spinner';

function InfoTooltip(props) {
  const { datasetID, dataYear } = props;
  const [dataset, setDataset] = useState({
    loading: true,
    value: null,
  });
  const router = useRouter();

  const metadataObj = dataset.value && dataset.value.metadata[0];
  const datasetName = metadataObj && metadataObj.info.name;
  const datasetDescription = metadataObj && metadataObj.info.functions;

  useEffect(() => {
    fetchDataset(datasetID, { includes: 'metadata' })
      .then((data) => setDataset({
        loading: false,
        value: data,
      }))
      .catch((err) => toastr.error(`Error loading dataset ${datasetID}`, err));
  }, [datasetID]);

  return (
    <div className="c-info-tooltip">
      <Spinner isLoading={dataset.loading} className="-light" />
      {!dataset.loading
                && (
                <>
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
                      onClick={() => {
                        router.push(`/data/explore/${datasetID}`);
                      }}
                    >
                      More info
                    </button>
                  </div>
                </>
                )}
    </div>
  );
}

InfoTooltip.propTypes = {
  datasetID: PropTypes.string.isRequired,
  dataYear: PropTypes.string.isRequired,
};

export default InfoTooltip;
