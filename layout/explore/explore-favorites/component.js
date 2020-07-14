import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import classnames from 'classnames';

// Services
import { fetchDatasets } from 'services/dataset';

// Components
import DatasetList from 'layout/explore/explore-datasets/list';
import Spinner from 'components/ui/Spinner';
import ExploreDatasetsActions from 'layout/explore/explore-datasets/explore-datasets-actions';
import Icon from 'components/ui/icon';

// Styles
import './styles.scss';

function ExploreFavoritesComponent(props) {
  const { favorites, selectedDataset } = props;
  const [datasets, setDatasets] = useState([]);
  const [datasetsLoading, setDatasetsLoading] = useState(false);

  useEffect(() => {
    const datasetIDs = (favorites.map(f => f.resourceId));
    if (datasetIDs.length > 0) {
      setDatasetsLoading(true);
      fetchDatasets({
        ids: datasetIDs.join(','),
        includes: 'widget,metadata,layer,vocabulary'
      })
        .then((data) => {
          setDatasets(data);
          setDatasetsLoading(false);
        })
        .catch((err) => {
          toastr.error('Error loading collection datasets', err);
          setDatasetsLoading(false);
        });
    } else {
      setDatasets([]);
    }
  }, [favorites]);

  return (
    <div className={classnames({
        'c-explore-favorites': true,
        '-hidden': selectedDataset
      })}
    >
      <Spinner isLoading={datasetsLoading} className="-light -relative" />
      {datasets.length > 0 &&
        <DatasetList
          list={datasets}
          actions={<ExploreDatasetsActions />}
        />
      }
      {!datasetsLoading && datasets.length === 0 &&
        <div className="no-datasets">
          <div className="empty-card" />
          <div className="message">
            <h5>You currently have no favorite datasets</h5>
            <p>
              To favorite a dataset or start a collection, click the <Icon
                name="icon-star-full"
                className="-star -small"
              /> on any dataset card
            </p>
          </div>
          <div className="empty-card" />
          <div className="empty-card" />
        </div>
      }
    </div>
  );
}

ExploreFavoritesComponent.propTypes = {
  favorites: PropTypes.array.isRequired,
  selectedDataset: PropTypes.string.isRequired
};

export default ExploreFavoritesComponent;
