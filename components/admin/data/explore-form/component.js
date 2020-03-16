import React, { useState, useEffect } from 'react';
import { toastr } from 'react-redux-toastr';
import debounce from 'lodash/debounce';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Select from 'components/form/SelectInput';
import Spinner from 'components/ui/Spinner';

// Services
import { fetchDatasets } from 'services/dataset';

// Constants
import { TOPICS } from 'layout/explore/explore-topics/constants';

// Styles
import './styles.scss';

function ExploreForm() {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [highlightedDatasets, setHighlightedDatasets] = useState({ old: [], new: [] });
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
        setHighlightedDatasets({ old: datasetsMap, new: datasetsMap });
      })
      .catch(err => toastr.error('Error loading highlighted datasets', err));
  }, []);

  const handleDatasetSearchChange = debounce((value) => {
    setSearch({ loading: true, list: [], value });
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
  }, 250);

  return (
    <div className="c-explore-form">
      <div className="discover-section">
        <h3>Discover section</h3>
        <div className="highlighted-datasets">
          <h4>Highlighted datasets</h4>
          <div className="highlighted-datasets-search">
            <Spinner isLoading={search.loading} className="-light -relative" />
            <Field
              onChange={handleDatasetSearchChange}
              className="-fluid"
              properties={{
                            name: 'datasetSearch',
                            placeholder: 'Search for datasets here',
                            type: 'text'
                            }}
            >
              {Input}
            </Field>
            {!search.loading && search.list.length === 0 && search.value &&
            <div>The search text provided triggered no results</div>
                        }
            <ul className="search-results">
              {search.list.map(result => (
                <li className="search-result">
                  <span>{result.label}</span>
                  <button
                    className="c-button -primary -compressed"
                    onClick={() => {
                        if (highlightedDatasets.new.length === 4) {
                            toastr.error('Only up to 4 highlighted datasets can be selected');
                        } else if (highlightedDatasets.new.find(e => e.id === result.id)) {
                            toastr.error('This dataset is already part of the list');
                        } else {
                            setHighlightedDatasets({
                                ...highlightedDatasets,
                                new: [...highlightedDatasets.new, result]
                            });
                        }
                    }}
                  >
                        Add
                  </button>
                </li>
                ))}
            </ul>
          </div>

          <h5>Highlighted datasets selection</h5>
          <ul className="highlighted-datasets-list">
            {highlightedDatasets.new.map(hd => (
              <li className="highlighted-dataset">
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
        <Field
          options={TOPICS.map(t => ({ label: t.label, value: t.id }))}
          onChange={value => setSelectedTopics(value)}
          className="-fluid"
          properties={{
                        name: 'relatedTopics',
                        multi: true,
                        instanceId: 'selectWidgetRelevantProps',
                        placeholder: 'Select the related topics...',
                        default: selectedTopics,
                        value: selectedTopics
                    }}
        >
          {Select}
        </Field>
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
