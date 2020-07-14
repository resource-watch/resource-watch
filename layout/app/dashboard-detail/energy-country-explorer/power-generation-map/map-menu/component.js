import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// Responsive
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';

// Services
import { fetchDatasets } from 'services/dataset';

// Components
import DatasetList from 'layout/explore/explore-datasets/list';
import ExploreDatasetsActions from 'layout/explore/explore-datasets/explore-datasets-actions';

// Styles
import './styles.scss';

function MapMenu(props) {
  const {
    groups,
    responsive,
    toggleMapLayerGroup,
    setMapLayerGroupActive,
    resetMapLayerGroupsInteraction
  } = props;
  const [datasetsMap, setDatasetsMap] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const powerwatchDatasetID = 'a86d906d-9862-4783-9e30-cdb68cd808b8';

  useEffect(() => {
    const datasetIDs = groups.reduce((acc, group) => [...acc, ...group.datasets], []);
    fetchDatasets({
      includes: 'metadata, layer, widget',
      ids: datasetIDs.join(','),
      'page[size]': 50
    })
      .then((datasets) => {
        datasets.forEach(d => datasetsMap.set(d.id, d));
        setDatasetsMap(datasetsMap);
        setLoading(false);

        //----- Select Power plants dataset by default ---------
        const powerWatchDataset = datasetsMap.get(powerwatchDatasetID);
        toggleMapLayerGroup({ 
          dataset: powerWatchDataset, 
          toggle: true }
        );
        setMapLayerGroupActive({ 
          dataset: { id: powerwatchDatasetID }, 
          active: powerWatchDataset.layer.find(l => l.default).id
        });
        resetMapLayerGroupsInteraction();
        //-------------------------------------------------------
      })
      .catch(err => toastr.error('Error loading datasets', err));
  }, [groups]);

  return (
    <div className="c-map-menu">
      {groups.map((group) => {
                const { name, datasets } = group;
                const datasetsSt = `${datasets.length} DATASET${datasets.length > 1 ? 'S' : ''}`;
                const datasetsArray = datasets.map(d => datasetsMap.get(d));
                
                return (
                  <div className="dataset-group">
                    <div className="group-header">
                      <h4>{name}</h4>
                      <div className="number-of-datasets">{datasetsSt}</div>
                    </div>
                    <DatasetList
                      loading={loading}
                      numberOfPlaceholders={2}
                      list={datasetsArray}
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
