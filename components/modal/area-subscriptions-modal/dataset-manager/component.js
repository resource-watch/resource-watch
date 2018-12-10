import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEqual from 'lodash/isEqual';

// components
import CustomSelect from 'components/ui/CustomSelect';
import Field from 'components/form/Field';
import Input from 'components/form/Input';

const EMPTY_DATASET = {
  id: null,
  label: '',
  value: '',
  subscriptions: [],
  threshold: 1
};

class DatasetManager extends Component {
  static propTypes = {
    datasets: PropTypes.array.isRequired,
    activeArea: PropTypes.object,
    selectedDatasets: PropTypes.array.isRequired,
    setUserSelection: PropTypes.func.isRequired
  }

  static defaultProps = { activeArea: null }

  constructor(props) {
    super(props);

    this.state = { selectedDatasets: props.selectedDatasets };
  }

  componentWillReceiveProps(nextProps) {
    const { selectedDatasets } = this.props;
    const { selectedDatasets: nextSelectedDatasets } = nextProps;
    const selectedDatasetsChanged = !isEqual(selectedDatasets, nextSelectedDatasets);

    if (selectedDatasetsChanged) this.setState({ selectedDatasets: nextSelectedDatasets });
  }

  onAddDataset = (dataset, index) => {
    const { setUserSelection } = this.props;
    const { selectedDatasets } = this.state;

    if (selectedDatasets[index]) {
      // by default, when the user selects a dataset for first time, selects the first subscriptions
      const updatedSubscriptions = dataset.subscriptions;
      updatedSubscriptions[0] = {
        ...updatedSubscriptions[0],
        selected: true
      };
      const updatedDataset = {
        ...dataset,
        subscriptions: updatedSubscriptions
      };

      selectedDatasets[index] = updatedDataset;

      this.setState({ selectedDatasets: [...selectedDatasets] }, () => {
        setUserSelection({
          datasets: selectedDatasets
            .filter(_dataset => _dataset.id !== null)
        });
      });
    } else {
      this.setState({ selectedDatasets: [...selectedDatasets, ...[dataset]] }, () => {
        setUserSelection({
          datasets: selectedDatasets
            .filter(_dataset => _dataset.id !== null)
        });
      });
    }
  }

  onAddNewSubscription = () => {
    const { setUserSelection } = this.props;
    const { selectedDatasets } = this.state;

    this.setState({ selectedDatasets: [...selectedDatasets, ...[EMPTY_DATASET]] }, () => {
      setUserSelection({
        datasets: selectedDatasets
          .filter(_dataset => _dataset.id !== null)
      });
    });
  }

  onSetSubscription = ({ value }, index) => {
    const { setUserSelection } = this.props;
    const { selectedDatasets } = this.state;

    if (selectedDatasets[index]) {
      selectedDatasets[index] = {
        ...selectedDatasets[index],
        subscriptions: selectedDatasets[index].subscriptions.map(_subscription => ({
          ..._subscription,
          ...{ selected: _subscription.value === value }
        }))
      };

      this.setState({ selectedDatasets: [...selectedDatasets] }, () => {
        setUserSelection({
          datasets: selectedDatasets
            .filter(_dataset => _dataset.id !== null)
        });
      });
    }
  }

  onSetthreshold = (value, index) => {
    const { setUserSelection } = this.props;
    const { selectedDatasets } = this.state;

    if (selectedDatasets[index]) {
      selectedDatasets[index] = {
        ...selectedDatasets[index],
        threshold: value
      };

      this.setState({ selectedDatasets: [...selectedDatasets] }, () => {
        setUserSelection({
          datasets: selectedDatasets
            .filter(_dataset => _dataset.id !== null)
        });
      });
    }
  }

  onRemoveDataset = (index) => {
    this.setState({
      selectedDatasets: this.state.selectedDatasets
        .filter((elem, _index) => _index !== index)
    });
  }

  render() {
    const { datasets, activeArea } = this.props;
    const { selectedDatasets } = this.state;

    return (
      <div className="c-dataset-manager">
        {selectedDatasets.map((_selectedDataset, index) => (
          <div
            key={_selectedDataset.id}
            className="selectors-container"
          >
            <Field
              properties={{
                name: index === 0 ? 'dataset' : null,
                label: index === 0 ? 'Dataset' : null
              }}
            >
              <CustomSelect
                placeholder="Select a dataset"
                className={classnames({ '-disabled': activeArea !== null ? false : index === 0 && _selectedDataset.value })}
                options={datasets}
                clearable={false}
                onValueChange={val => this.onAddDataset(val, index)}
                allowNonLeafSelection={false}
                value={_selectedDataset && _selectedDataset.value}
              />
            </Field>
            <Field
              properties={{
                name: index === 0 ? 'type' : null,
                label: index === 0 ? 'Type' : null
              }}
            >
              <CustomSelect
                placeholder="Select a subscription type"
                className={classnames({ '-disabled': !_selectedDataset.subscriptions.length })}
                options={_selectedDataset.subscriptions}
                onValueChange={val => this.onSetSubscription(val, index)}
                allowNonLeafSelection={false}
                clearable={false}
                value={(_selectedDataset.subscriptions
                  .find(_subscription => _subscription.selected) ||
                    _selectedDataset.subscriptions[0] || {}).value}
              />
            </Field>
            <Field
              className="threshold-input"
              onChange={val => this.onSetthreshold(val, index)}
              properties={{
                name: 'threshold',
                label: index === 0 ? 'Minimum' : null,
                type: 'number',
                default: _selectedDataset.threshold,
                value: _selectedDataset.threshold
              }}
            >
              {Input}
            </Field>
            <Field
              properties={{
                name: 'delete',
                label: index === 0 ? ' ' : null
              }}
            >
              <button
                className={classnames('c-btn -secondary', { '-disabled': index === 0 })}
                onClick={() => this.onRemoveDataset(index)}
              >
                Delete
              </button>
            </Field>
          </div>
        ))}
        <div className="subscription-btn-container">
          <button
            className={classnames('c-btn -b -fullwidth',
              { '-disabled': selectedDatasets.find(_selectedDataset => _selectedDataset.id === null) })}
            onClick={this.onAddNewSubscription}
          >
            Add subscription
          </button>
        </div>
      </div>
    );
  }
}

export default DatasetManager;
