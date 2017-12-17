import React from 'react';
import PropTypes from 'prop-types';

// Components
import Button from 'components/ui/Button';
import Icon from 'components/ui/Icon';
import SelectInput from 'components/widgets/editor/form/SelectInput';

// Redux
import { connect } from 'react-redux';
import { setDatasetsMode, setDatasetsSorting } from 'redactions/explore';

const SORTING_OPTIONS = [
  { value: 'modified', label: 'Last modified' },
  { value: 'viewed', label: 'Most viewed' },
  { value: 'favourited', label: 'Most favourited' }
];

class DatasetListHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: props.mode,
      list: props.list
    };

    // BINDINGS
    this.triggerSetDatasetMode = this.triggerSetDatasetMode.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      mode: nextProps.mode,
      list: nextProps.list
    });
  }

  /**
   * UI EVENTS
   * - triggerSetDatasetMode (e)
  */
  triggerSetDatasetMode(e) {
    if (this.state.mode !== e.currentTarget.dataset.mode) {
      this.props.setDatasetsMode(e.currentTarget.dataset.mode);
    }
  }

  render() {
    const { mode, list } = this.state;
    const { sortingOrder } = this.props;

    return (
      <div className="c-dataset-list-header">
        <div className="total">
          {list.length} datasets
        </div>
        <div className="actions">
          <div className="sorting-container">
            <SelectInput
              id="explore-sorting"
              properties={{
                name: 'explore-sorting',
                value: sortingOrder,
                default: sortingOrder,
                clearable: false
              }}
              options={SORTING_OPTIONS}
              onChange={sorting => this.props.setDatasetsSorting(sorting)}
            />
          </div>
          <div className="mode-container">
            <Button
              properties={{
                'data-mode': 'grid',
                className: (mode === 'grid') ? '-active' : ''
              }}
              onClick={this.triggerSetDatasetMode}
            >
              <Icon name="icon-view-grid" />
            </Button>
            <Button
              properties={{
                'data-mode': 'list',
                className: (mode === 'list') ? '-active' : ''
              }}
              onClick={this.triggerSetDatasetMode}
            >
              <Icon name="icon-view-list" />
            </Button>
          </div>
          {/* <div className="filter-container">
            Filters
          </div> */}
        </div>
      </div>
    );
  }
}

DatasetListHeader.propTypes = {
  // STATE
  mode: PropTypes.string,
  list: PropTypes.array,
  sortingOrder: PropTypes.string,
  // ACTIONS
  setDatasetsMode: PropTypes.func,
  setDatasetsSorting: PropTypes.func
};

const mapStateToProps = ({ explore }) => ({
  sortingOrder: explore.sorting.order
});

const mapDispatchToProps = dispatch => ({
  setDatasetsMode: mode => dispatch(setDatasetsMode(mode)),
  setDatasetsSorting: sorting => dispatch(setDatasetsSorting(sorting))
});

export default connect(mapStateToProps, mapDispatchToProps)(DatasetListHeader);
