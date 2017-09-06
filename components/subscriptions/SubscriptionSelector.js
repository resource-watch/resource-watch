import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Components
import Select from 'components/form/SelectInput';
import Input from 'components/form/Input';
import Field from 'components/form/Field';

class SubscriptionSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDataset: null,
      selectedType: null,
      selectedThreshold: 1,
      index: props.index,
      typeOptions: []
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.data) {
      const { selectedDataset, selectedType, selectedThreshold, index } = newProps.data;
      const typeOptions = selectedDataset ?
        Object.keys(
          newProps.datasets.find(val => val.id === selectedDataset).attributes.subscribable)
          .map(val => ({ value: val, label: val }))
        : [];
      this.setState({
        selectedDataset,
        selectedType,
        selectedThreshold,
        index,
        typeOptions
      });
    }
  }

  @Autobind
  handleDatasetSelected(value) {
    const { datasets } = this.props;

    const typeOptions = value ?
      Object.keys(
        datasets.find(val => val.id === value).attributes.subscribable)
        .map(val => ({ value: val, label: val }))
      : [];

    if (!this.state.selectedType) {
      this.setState({
        selectedDataset: value,
        selectedType: typeOptions[0].value,
        typeOptions
      },
      () => this.props.onUpdate(this.state));
    } else {
      this.setState({
        selectedDataset: value,
        typeOptions
      },
      () => this.props.onUpdate(this.state));
    }
  }

  @Autobind
  handleTypeSelected(type) {
    this.setState({ selectedType: type },
      () => this.props.onUpdate(this.state));
  }

  @Autobind
  handleThresholdChange(threshold) {
    let newThreshold = threshold;
    if (threshold <= 0) {
      newThreshold = 1;
    }
    this.setState({ selectedThreshold: newThreshold },
      () => this.props.onUpdate(this.state));
  }

  @Autobind
  handleRemove() {
    this.props.onRemove(this.props.index);
  }

  render() {
    const { datasets } = this.props;
    const { selectedDataset, selectedType, selectedThreshold, typeOptions } = this.state;

    const datasetOptions = (datasets.length > 0) ?
      datasets.map(val => ({ label: val.attributes.name, value: val.id, id: val.id }))
      : [];

    return (
      <div className="c-subscription-selector" ref={(node) => { this.el = node; }}>
        <Select
          className="dataset-select"
          properties={{
            name: 'dataset',
            value: selectedDataset,
            default: selectedDataset,
            placeholder: 'Select a dataset'
          }}
          options={datasetOptions}
          onChange={this.handleDatasetSelected}
        />
        <Select
          properties={{
            name: 'type',
            value: selectedType,
            default: selectedType,
            placeholder: 'Select a type',
            className: 'type-select'
          }}
          options={typeOptions}
          onChange={this.handleTypeSelected}
        />
        <div className="threshold-div">
          <span className="threshold-label">More than</span>
          <Field
            className="threshold-input"
            onChange={this.handleThresholdChange}
            properties={{
              name: 'threshold',
              type: 'number',
              default: selectedThreshold,
              value: selectedThreshold
            }}
          >
            {Input}
          </Field>
        </div>
        <button
          className="c-btn -b"
          onClick={() => this.props.onRemove(this.props.index)}
        >
          Delete
        </button>
      </div>
    );
  }
}

SubscriptionSelector.propTypes = {
  datasets: PropTypes.array.isRequired,
  index: PropTypes.string,
  data: PropTypes.object,
  // CALLBACKS
  onRemove: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default SubscriptionSelector;
