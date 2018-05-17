import React from 'react';
import PropTypes from 'prop-types';

// Components
import SelectInput from 'components/form/SelectInput';
import Input from 'components/form/Input';
import Field from 'components/form/Field';

class SubscriptionSelector extends React.Component {
  render() {
    const {
      datasets,
      alert,
      onChangeSubscription
    } = this.props;
    const { dataset } = alert;

    const typeOptions = dataset ? Object.keys(dataset.subscribable)
      .map(opt => ({ label: opt, value: opt })) : [];

    const selectedDataset = dataset ? datasets.find(ds => ds.label === dataset.label) : [];

    return (
      <div className="c-subscription-selector" ref={(node) => { this.el = node; }}>

        <div className="col col--dataset">
          <SelectInput
            className="dataset-select"
            properties={{
              value: selectedDataset,
              default: selectedDataset,
              placeholder: 'Select a dataset'
            }}
            options={datasets}
            onChange={v => onChangeSubscription(v, 'dataset', this.props.index)}
          />
        </div>

        <div className="col col--type">
          <SelectInput
            properties={{
              name: 'type',
              default: alert.type,
              placeholder: 'Select a type',
              className: 'type-select',
              disabled: typeOptions.length === 0
            }}
            options={typeOptions}
            onChange={v => onChangeSubscription(v, 'type', this.props.index)}
          />
        </div>

        <div className="col col--threshhold">
          <Field
            className="threshold-input"
            onChange={v => onChangeSubscription(v, 'threshold', this.props.index)}
            properties={{
              name: 'threshold',
              type: 'number',
              default: alert.threshold,
              value: alert.threshold
            }}
          >
            {Input}
          </Field>
        </div>

        <div className="col">
          <button
            className="c-btn"
            onClick={() => this.props.onRemoveDataset(this.props.index)}
          >
            Delete
          </button>
        </div>

      </div>
    );
  }
}

SubscriptionSelector.propTypes = {
  datasets: PropTypes.array.isRequired,
  alert: PropTypes.object.isRequired,
  onChangeSubscription: PropTypes.func.isRequired,
  onRemoveDataset: PropTypes.func.isRequired
};

export default SubscriptionSelector;
