import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

// Responsive
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';

// Components
import Paginator from 'components/ui/Paginator';
import Icon from 'components/ui/icon';

// Explore components
import DatasetList from './list';
import ExploreDatasetsTags from './explore-datasets-tags';
import ExploreDatasetsActions from './explore-datasets-actions';

// Styles
import './styles.scss';

class ExploreDatasetsComponent extends React.Component {
  static propTypes = {
    list: PropTypes.array,
    page: PropTypes.number,
    total: PropTypes.number,
    limit: PropTypes.number,
    options: PropTypes.object,
    responsive: PropTypes.object,
    selectedTags: PropTypes.array.isRequired,

    // Actions
    fetchDatasets: PropTypes.func.isRequired,
    setDatasetsPage: PropTypes.func.isRequired,
    toggleFiltersSelected: PropTypes.func.isRequired,
    resetFiltersSort: PropTypes.func.isRequired,
    setFiltersSearch: PropTypes.func.isRequired
  };

  // onTagSelected = (tag) => {
  //   const options = Object.keys(this.props.options).map(o => this.props.options[o]);

  //   const tab = (options.find((o) => {
  //     const labels = (tag && tag.labels) || [];
  //     return o.type === labels[1];
  //   }) || {}).value || 'custom';

  //   this.props.toggleFiltersSelected({
  //     tab,
  //     tag
  //   });
  //   this.fetchDatasets(1);
  // }

  fetchDatasets = debounce((page) => {
    this.props.setDatasetsPage(page);
    this.props.fetchDatasets();
  });

  render() {
    const {
      list,
      page,
      limit,
      total,
      responsive,
      selectedTags,
      search
    } = this.props;

    return (
      <div className="c-explore-datasets">
        <div className="explore-datasets-header">
          <div className="tags-container">
            {selectedTags.length > 0 &&
              selectedTags.map(t => (
                <button
                  key={t.id}
                  className="c-button -primary -compressed"
                  onClick={() => {
                    this.props.toggleFiltersSelected({ tag: t, tab: 'topics' });
                    this.fetchDatasets();
                  }}
                >
                  {t.label.toUpperCase()}
                  <Icon
                    name="icon-cross"
                    className="-tiny"
                  />
                </button>
              ))}
            {search && (
              <button
                key="text-filter"
                className="c-button -primary -compressed"
                onClick={() => {
                  this.props.resetFiltersSort();
                  this.props.setFiltersSearch('');
                  this.fetchDatasets();
                }}
              >
                {`TEXT: ${search.toUpperCase()}`}
                <Icon
                  name="icon-cross"
                  className="-tiny"
                />
              </button>
            )}
          </div>
          <div className="number-of-datasets">
            {`${total} ${total === 1 ? 'DATASET' : 'DATASETS' }`}
          </div>
        </div>
      
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
            grid={{
              small: 'small-12',
              medium: 'medium-6'
            }}
            tags={
              <ExploreDatasetsTags
                onTagSelected={this.onTagSelected}
              />
            }
            actions={
              <MediaQuery
                minDeviceWidth={breakpoints.medium}
                values={{ deviceWidth: responsive.fakeWidth }}
              >
                <ExploreDatasetsActions />
              </MediaQuery>
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
              // Scroll to the top of the list
              if (window.scrollTo && document.querySelector('.sidebar-content').scrollTo) {
                window.scrollTo(0, 0);
                document.querySelector('.sidebar-content').scrollTo(0, 0);
              }

              this.fetchDatasets(p);
            }}
          />
        }

      </div>
    );
  }
}

export default ExploreDatasetsComponent;
