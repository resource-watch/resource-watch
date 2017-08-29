import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Components
import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';
import Icon from 'components/ui/Icon';

class SubscriptionSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDataset: null,
      selectedType: null
    };
  }


  @Autobind
  onChangeSelectedDataset(value) {
    this.setState({
      selectedDataset: value
    });
  }

  @Autobind
  onChangeSelectedType(type) {
    this.setState({ selectedType: type });
  }

  @Autobind
  handleRemove() {
    this.props.onRemove();
  }

  render() {
    const { datasets } = this.props;
    const { selectedDataset, selectedType } = this.state;

    const typeOptions = selectedDataset ? Object.keys(selectedDataset.attributes.subscribable)
      .map(val => ({ value: val, label: val })) : [];

    return (
      <div className="c-subscription-selector" ref={(node) => { this.el = node; }}>
        <Field
          onChange={this.handleDatasetSelected}
          className="-fluid"
          options={datasets}
          properties={{
            name: 'dataset',
            value: selectedDataset,
            instanceId: 'selectDataset',
            placeholder: 'Select a dataset'
          }}
        >
          {Select}
        </Field>
        <Field
          onChange={this.handleTypeSelected}
          className="-fluid"
          options={typeOptions}
          properties={{
            name: 'type',
            value: selectedType,
            instanceId: 'selectType',
            placeholder: 'Select a subscription type'
          }}
        >
          {Select}
        </Field>
        <button onClick={() => this.props.onRemove()}>
          <Icon name="icon-cross" />
        </button>
      </div>
    );
  }
}

SubscriptionSelector.propTypes = {
  datasets: PropTypes.array.isRequired,
  // CALLBACKS
  onRemove: PropTypes.func.isRequired
};

export default SubscriptionSelector;
