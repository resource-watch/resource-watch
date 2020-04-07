import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Responsive
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';

// Explore components
import DatasetList from 'layout/explore/explore-datasets/list';
import ExploreDatasetsActions from 'layout/explore/explore-datasets/explore-datasets-actions';

// Styles
import './styles.scss';

function ExploreNearRealTimeComponent(props) {
  const {
    datasets: { today, week, month, loading },
    responsive,
    selectedDataset
  } = props;

  return (
    <div className={classnames({
        'c-explore-near-real-time': true,
        '-hidden': selectedDataset
      })}
    >
      <div className="explore-near-real-time-section">
        <div className="header">
          <h4>Updated today</h4>
          <span className="number-of-datasets">
            {`${today.length} DATASET${today.length !== 1 && 'S'}`}
          </span>
        </div>
        <DatasetList
          loading={loading}
          numberOfPlaceholders={4}
          list={today}
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
      <div className="explore-near-real-time-section">
        <div className="header">
          <h4>Updated this week</h4>
          <span className="number-of-datasets">
            {`${week.length} DATASET${week.length !== 1 && 'S'}`}
          </span>
        </div>
        <DatasetList
          loading={loading}
          numberOfPlaceholders={4}
          list={week}
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
      <div className="explore-near-real-time-section">
        <div className="header">
          <h4>Updated this month</h4>
          <span className="number-of-datasets">
            {`${month.length} DATASET${month.length !== 1 && 'S'}`}
          </span>
        </div>
        <DatasetList
          loading={loading}
          numberOfPlaceholders={4}
          list={month}
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
    </div>
  );
}

ExploreNearRealTimeComponent.propTypes = {
  datasets: PropTypes.array.isRequired,
  responsive: PropTypes.object.isRequired,
  selectedDataset: PropTypes.string.isRequired
};

export default ExploreNearRealTimeComponent;
