import React, { useState, useEffect } from 'react';
import { toastr } from 'react-redux-toastr';
import debounce from 'lodash/debounce';
import Select from 'react-select';

// Services
import { fetchDatasets } from 'services/dataset';

// Components
import Spinner from 'components/ui/Spinner';

// Constants
import { TOPICS } from 'layout/explore/explore-topics/constants';

// Styles
import './styles.scss';

function ExploreForm() {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [highlightedDatasets, setHighlightedDatasets] = useState({ old: [], new: [], loading: true });
  const [search, setSearch] = useState({ loading: false, list: [], value: '' });

  const getDatasetName = d =>
    (d.metadata.length > 0 && d.metadata[0].name) || d.name;

  useEffect(() => {
    fetchDatasets({
      includes: 'metadata',
      isHighlighted: true,
      'page[size]': 4
    })
      .then((datasets) => {
        const datasetsMap = datasets.map(d => ({
          label: getDatasetName(d),
          id: d.id
        }));
        setHighlightedDatasets({ old: datasetsMap, new: datasetsMap, loading: false });
      })
      .catch(err => toastr.error('Error loading highlighted datasets', err));
  }, []);

  const handleDatasetSearchInputChange = debounce((value) => {
    if (value) {
      fetchDatasets({
        includes: 'metadata',
        published: true,
        status: 'saved',
        name: value
      })
        .then(data => setSearch({
          list: data.map(d => ({
            label: getDatasetName(d),
            id: d.id
          })),
          loading: false,
          value
        }))
        .catch(err => toastr.error('Error performing dataset search', err));
    }
  }, 250);

  const handleDatasetSearchChange = (value) => {
    if (highlightedDatasets.new.find(e => e.id === value.id)) {
      toastr.error('This dataset is already part of the list');
    } else {
      setHighlightedDatasets({
        ...highlightedDatasets,
        new: [...highlightedDatasets.new, value]
      });
      setSearch({ loading: false, list: [], value: '' });
    }
  };

  return (
    <div className="c-explore-form">
      <div className="discover-section">
        <h3>Discover section</h3>
        <div className="highlighted-datasets">
          <h4>Highlighted datasets</h4>
          <div className="highlighted-datasets-search">
            <Spinner isLoading={search.loading} className="-relative -light" />
            <Select
              options={search.list}
              className="-fluid"
              onChange={handleDatasetSearchChange}
              onInputChange={handleDatasetSearchInputChange}
              placeholder="Type here to add a new dataset"
            />
          </div>
          <ul className="highlighted-datasets-list">
            <Spinner isLoading={highlightedDatasets.loading} className="-relative -light" />
            {highlightedDatasets.new.map(hd => (
              <li
                className="highlighted-dataset"
                key={hd.id}
              >
                <span>{hd.label}</span>
                <button
                  className="c-button -primary -compressed"
                  onClick={() => {
                                        setHighlightedDatasets({
                                            ...highlightedDatasets,
                                            new: highlightedDatasets.new.filter(e => e.id !== hd.id)
                                        });
                                    }}
                >
                                    Remove
                </button>
              </li>
                        ))}
          </ul>
        </div>
      </div>
      <div className="related-topics">
        <h4>Related topics</h4>
        <Select
          multi
          value={selectedTopics}
          default={selectedTopics}
          placeholder="Select a set of related topics..."
          options={TOPICS.map(t => ({ label: t.label, value: t.id }))}
          onChange={value => setSelectedTopics(value)}
        />
      </div>
      <div className="actions">
        <button
          className="c-button -primary"
          onClick={() => {
                        // TO-DO save
                    }}
        >
                    Save
        </button>
      </div>
    </div>
  );
}

export default ExploreForm;
