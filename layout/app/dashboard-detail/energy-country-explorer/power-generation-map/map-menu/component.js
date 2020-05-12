import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// Responsive
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';

// Services
import { fetchDatasets } from 'services/dataset';

// Components
import Spinner from 'components/ui/Spinner';
import DatasetList from 'layout/explore/explore-datasets/list';
import ExploreDatasetsActions from 'layout/explore/explore-datasets/explore-datasets-actions';

// Styles
import './styles.scss';

function MapMenu(props) {
  const { groups, responsive } = props;
  const [datasetsMap, setDatasetsMap] = useState(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const datasetIDs = groups.reduce((acc, group) => [...acc, ...group.datasets], []);
    console.log('datasetIDs', datasetIDs);

    fetchDatasets({
      includes: 'metadata, layer, widget',
      ids: datasetIDs.join(',')
    })
      .then((datasets) => {
        datasets.forEach(d => datasetsMap.set(d.id, d));
        setDatasetsMap(datasetsMap);
        setLoading(false);
      })
      .catch(err => toastr.error('Error loading datasets', err));
  }, [datasetsMap, groups]);

  return (
    <div className="c-map-menu">
      {groups.map((group) => {
                const { name, datasets } = group;
                const datasetsSt = `${datasets.length} DATASET${datasets.length > 1 ? 'S' : ''}`;
                return (
                  <div className="dataset-group">
                    <div className="group-header">
                      <h4>{name}</h4>
                      <div className="number-of-datasets">{datasetsSt}</div>
                    </div>
                    <DatasetList
                      loading={loading}
                      numberOfPlaceholders={2}
                      list={datasets.map(d => datasetsMap.get(d))}
                      actions={
                        <MediaQuery
                          minDeviceWidth={breakpoints.medium}
                          values={{ deviceWidth: responsive.fakeWidth }}
                        >
                          <ExploreDatasetsActions />
                        </MediaQuery>
                            }
                    />
                  </div>
                );
            })}
    </div>
  );
}

MapMenu.propTypes = {
  groups: PropTypes.array.isRequired,
  responsive: PropTypes.object.isRequired
};

export default MapMenu;
