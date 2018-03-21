import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

// Components
import DatasetList from 'components/datasets/list';
import Paginator from 'components/ui/Paginator';

// Explore components
import ExploreDatasetsActions from './explore-datasets-actions';

class ExploreDatasetsComponent extends React.Component {
  static propTypes = {
    list: PropTypes.array,
    mode: PropTypes.string,
    page: PropTypes.number,
    total: PropTypes.number,
    limit: PropTypes.number,

    // Actions
    fetchDatasets: PropTypes.func,
    setDatasetsPage: PropTypes.func
  };

  fetchDatasets = debounce((page) => {
    this.props.setDatasetsPage(page);
    this.props.fetchDatasets();
  });

  render() {
    const {
      list, mode, page, limit, total
    } = this.props;

    return (
      <div className="c-explore-datasets">
        {!list.length &&
          <div className="request-data-container">
            <div className="request-data-text">
              Oops! We couldn&#39;t find data for your search...
            </div>
            <a
              className="c-button -primary"
              href="https://docs.google.com/forms/d/e/1FAIpQLSfXsPGQxM6p8KloU920t5Tfhx9FYFOq8-Rjml07UDH9EvsI1w/viewform"
              target="_blank"
              rel="noopener noreferrer"
            >
              Request data
            </a>
          </div>
        }

        {!!list.length &&
          <DatasetList
            list={list}
            mode={mode}
            grid={{
              small: 'small-12',
              medium: 'medium-6'
            }}
            actions={
              <ExploreDatasetsActions />
            }
          />
        }

        {!!list.length &&
          <Paginator
            options={{
              page,
              limit,
              size: total
            }}
            onChange={(p) => {
              this.fetchDatasets(p);
              // Scroll to the top of the list
              document.getElementsByClassName('sidebar-content')[0].scrollTop = 0;
            }}
          />
        }

      </div>
    );
  }
}

export default ExploreDatasetsComponent;
