import { createSelector } from 'reselect';

// Get datasets
const datasetList = state => state.explore.datasets.list;
const filters = state => state.explore.filters;

// Filter datasets by issues
const getFilteredDatasets = (_list, _filters) => {
  const search = _filters.search;
  const issue = _filters.issue;

  return _list.filter((it) => {
    let searchFilterPassed = false;
    let vocabularyFilterPassed = false;

    if (search && search.key === 'name') {
      if (it.attributes.name.toLowerCase().match(search.value.toLowerCase())) {
        searchFilterPassed = true;
      }
    }
    if (issue) {
      console.log('issue', issue);
      // Deafult filter by vocabulary
      for (let i = 0; i < issue.length; i++) { // eslint-disable-line
        const filter = issue[i];
        console.log('filter', filter);

        // Set vocabulary name wether the whole vocabulary is selected or only a specific tag
        // TODO: search in cascade if vocabularies get more levels (picking levels[0] by default)
        const vocName = (filter.levels.length && filter.levels.length > 0) ? filter.levels[0] : filter.value;
        console.log('vocName', vocName);
        const vocabulary = it.attributes.vocabulary.find(voc => voc.attributes.name === vocName);


          // Levels specify wether it is necessary to search into the vocabulary or not
        if (filter.levels.length && filter.levels.length > 0) {
          if (vocabulary && vocabulary.attributes.tags.includes(filter.value)) {
            vocabularyFilterPassed = true;
          }
        } else if (vocabulary) {
          vocabularyFilterPassed = true;
        }
      }
    }

    const searchCheck = (search && searchFilterPassed) || !search;
    const issueCheck = (issue && vocabularyFilterPassed) || !issue;
    return searchCheck && issueCheck;
  });
};

// Export the selector
export default createSelector(datasetList, filters, getFilteredDatasets);
