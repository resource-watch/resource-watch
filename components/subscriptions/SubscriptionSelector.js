import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Components
import Select from 'components/form/SelectInput';
import Icon from 'components/ui/Icon';

class SubscriptionSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDataset: null,
      selectedType: null,
      index: props.index
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.data) {
      const { selectedDataset, selectedType, index } = newProps.data;
      this.setState({
        selectedDataset,
        selectedType,
        index
      });
    }
  }


  @Autobind
  handleDatasetSelected(value) {
    this.setState({ selectedDataset: value },
      () => this.props.onUpdate(this.state));
  }

  @Autobind
  handleTypeSelected(type) {
    this.setState({ selectedType: type },
      () => this.props.onUpdate(this.state));
  }

  @Autobind
  handleRemove() {
    this.props.onRemove(this.props.index);
  }

  render() {
    const { datasets, showCross } = this.props;
    const { selectedDataset, selectedType } = this.state;

    const typeOptions = selectedDataset ?
      Object.keys(
        datasets.find(val => val.id === selectedDataset).attributes.subscribable)
        .map(val => ({ value: val, label: val }))
      : [];
    const datasetOptions = (datasets.length > 0) ?
      datasets.map(val => ({ label: val.attributes.name, value: val.id, id: val.id }))
      : [];

    return (
      <div className="c-subscription-selector" ref={(node) => { this.el = node; }}>
        <Select
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
            placeholder: 'Select a type'
          }}
          options={typeOptions}
          onChange={this.handleTypeSelected}
        />
        {showCross &&
          <button onClick={() => this.props.onRemove(this.props.index)}>
            <Icon name="icon-cross" />
          </button>
        }
      </div>
    );
  }
}

SubscriptionSelector.defaultProps = {
  showCross: true
};

SubscriptionSelector.propTypes = {
  datasets: PropTypes.array.isRequired,
  index: PropTypes.string,
  data: PropTypes.object.isRequired,
  showCross: PropTypes.object.isRequired,
  // CALLBACKS
  onRemove: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default SubscriptionSelector;
